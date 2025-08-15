import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

// Extend Request to include user
export interface AuthRequest extends Request {
  user?: any;
}

/**
 * Middleware to protect system_admin users from being updated/deleted by non-system_admin users
 * This middleware should be used before updateUser and deleteUser operations
 */
export const protectSystemAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Get the target user ID from the request parameters
    const targetUserId = req.params.id;
    
    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Get the current authenticated user from the request
    const currentUser = req.user;

    // If the current user is system_admin, allow all operations
    if (currentUser.role === 'system_admin') {
      return next();
    }

    // Check if the target user is a system_admin
    const targetUser = await prisma.user.findUnique({
      where: { id: parseInt(targetUserId) },
      select: { role: true }
    });

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'Target user not found'
      });
    }

    // If target user is system_admin and current user is not system_admin, deny access
    if (targetUser.role === 'system_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    // Allow the operation to proceed
    next();
  } catch (error) {
    console.error('Protect system admin middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authorization check'
    });
  }
};

/**
 * Middleware to prevent non-system_admin users from creating system_admin users
 * This middleware should be used before createUser operations
 */
export const preventSystemAdminCreation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Get the current authenticated user from the request
    const currentUser = req.user;
    

    // If the current user is system_admin, allow all operations
    if (currentUser.role === 'system_admin') {
      return next();
    }

    // Check if the request is trying to create a system_admin user
    if (req.body.role === 'system_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only system administrators can create other system administrators.'
      });
    }

    // Allow the operation to proceed
    next();
  } catch (error) {
    console.error('Prevent system admin creation middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authorization check'
    });
  }
};
