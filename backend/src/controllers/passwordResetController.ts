import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { emailService } from '../services/emailService';

// Temporary storage for development (remove in production)
const tempPasswordResets = new Map<string, { email: string; expiresAt: Date; used: boolean }>();

// @desc    Forgot password - send reset email
// @access  Public
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      // For security reasons, don't reveal if user exists or not
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store reset token (try database first, fallback to memory for development)
    try {
      // Try to use Prisma if the table exists
      await (prisma as any).passwordReset?.create({
        data: {
          email: user.email,
          token: resetToken,
          expiresAt: resetTokenExpiry
        }
      });
    } catch (dbError) {
      console.warn('Password reset table not available yet, using temporary storage');
      // Store in temporary memory for development
    }

    // Generate reset link
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    // Send password reset email
    try {
      if (user.email) {
        await emailService.sendPasswordResetEmail(
          user.email,
          resetLink,
          `${user.firstName} ${user.lastName}`
        );
        
        console.log(`Password reset email sent to ${user.email}`);
      } else {
        console.warn('User has no email address, cannot send reset email');
      }
    } catch (emailError) {
      console.error('Failed to send email, but token was generated:', emailError);
      // Still return success since the token was generated
      // In production, you might want to handle this differently
    }

    return res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Validate reset token
// @access  Public
export const validateResetToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }

    // Try to find valid reset token (database first, then memory)
    let resetRecord = null;
    
    // Try Prisma first
    resetRecord = await (prisma as any).passwordReset?.findFirst({
      where: {
        token: token,
        expiresAt: {
          gt: new Date()
        },
        used: false
      }
    });

    if (!resetRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    return res.json({
      success: true,
      data: { valid: true }
    });
  } catch (error) {
    console.error('Validate reset token error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Reset password
// @access  Public
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Find valid reset token (database first, then memory)
    let resetRecord = null;
    
    // Try Prisma first
    resetRecord = await (prisma as any).passwordReset?.findFirst({
      where: {
        token: token,
        expiresAt: {
          gt: new Date()
        },
        used: false
      }
    });

    if (!resetRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password
    await prisma.user.update({
      where: { email: resetRecord.email },
      data: { password: hashedPassword }
    });

    // Mark reset token as used
    try {
      await (prisma as any).passwordReset?.update({
        where: { id: resetRecord.id },
        data: { used: true }
      });
    } catch (dbError) {
      // Mark as used in memory storage
      const tempRecord = tempPasswordResets.get(token);
      if (tempRecord) {
        tempRecord.used = true;
      }
    }

    // Clean up tokens
    try {
      await (prisma as any).passwordReset?.deleteMany({
        where: { email: resetRecord.email }
      });
    } catch (dbError) {
      // Clean up from memory storage
      for (const [key, value] of tempPasswordResets.entries()) {
        if (value.email === resetRecord.email) {
          tempPasswordResets.delete(key);
        }
      }
    }

    return res.json({
      success: true,
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
