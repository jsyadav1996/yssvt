import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

// Extend Request to include user
interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get all donations (manager/admin only)
// @access  Private
export const getAllDonations = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    const donations = await prisma.donation.findMany({
      where: filter,
      include: {
        donor: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit)
    });

    const total = await prisma.donation.count({ where: filter });

    res.json({
      success: true,
      data: {
        donations,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
          totalDonations: total,
          hasNext: skip + donations.length < total,
          hasPrev: Number(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get donations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user's donations
// @access  Private
export const getUserDonations = async (req: AuthRequest, res: Response) => {
  try {
    const donations = await prisma.donation.findMany({
      where: { donorId: parseInt(req.user!.id) },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: { donations }
    });
  } catch (error) {
    console.error('Get user donations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new donation
// @access  Private
export const createDonation = async (req: AuthRequest, res: Response) => {
  try {
    const { amount, currency, purpose, anonymous, paymentMethod } = req.body;

    const donation = await prisma.donation.create({
      data: {
        donorId: parseInt(req.user!.id),
        amount,
        currency,
        purpose,
        anonymous,
        paymentMethod,
        status: 'pending'
      },
      include: {
        donor: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Donation created successfully',
      data: { donation }
    });
  } catch (error) {
    console.error('Create donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update donation status (manager/admin only)
// @access  Private
export const updateDonationStatus = async (req: Request, res: Response) => {
  try {
    const { status, transactionId } = req.body;
    const updateFields: any = { status };
    
    if (transactionId) {
      updateFields.transactionId = transactionId;
    }

    const donation = await prisma.donation.update({
      where: { id: parseInt(req.params.id) },
      data: updateFields,
      include: {
        donor: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    return res.json({
      success: true,
      message: 'Donation status updated successfully',
      data: { donation }
    });
  } catch (error) {
    console.error('Update donation status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 