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
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const donations = await prisma.donation.findMany({
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

    const total = await prisma.donation.count();

    // Calculate total donation amount
    const totalAmountResult = await prisma.donation.aggregate({
      _sum: {
        amount: true
      }
    });

    const totalDonationAmount = totalAmountResult._sum.amount || 0;

    res.json({
      success: true,
      data: {
        donations,
        totalDonationAmount: Number(totalDonationAmount),
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
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const donations = await prisma.donation.findMany({
      where: { donorId: parseInt(req.user!.id) },
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

    const total = await prisma.donation.count({
      where: { donorId: parseInt(req.user!.id) }
    });

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
    const { amount, purpose, paymentMethod, donorId, date, location, bankName } = req.body;

    const donation = await prisma.donation.create({
      data: {
        donorId: donorId ? parseInt(donorId) : parseInt(req.user!.id),
        amount,
        purpose,
        paymentMethod,
        ...(date && { date: new Date(date) }),
        ...(location && { location }),
        ...(bankName && { bankName })
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

// @desc    Get donation by ID
// @access  Private
export const getDonationById = async (req: Request, res: Response) => {
  try {
    const donation = await prisma.donation.findUnique({
      where: { id: parseInt(req.params.id) },
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
      data: donation
    });
  } catch (error) {
    console.error('Get donation by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update donation
// @access  Private
export const updateDonation = async (req: Request, res: Response) => {
  try {
    const { amount, purpose, paymentMethod, donorId, date, location, bankName } = req.body;

    const updateData: any = {
      amount,
      purpose,
      paymentMethod,
      ...(donorId && { donorId: parseInt(donorId) }),
      ...(date && { date: new Date(date) }),
      ...(location && { location }),
      ...(bankName && { bankName })
    };

    const donation = await prisma.donation.update({
      where: { id: parseInt(req.params.id) },
      data: updateData,
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
      message: 'Donation updated successfully',
      data: { donation }
    });
  } catch (error) {
    console.error('Update donation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete donation
// @access  Private
export const deleteDonation = async (req: Request, res: Response) => {
  try {
    const donation = await prisma.donation.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    await prisma.donation.delete({
      where: { id: parseInt(req.params.id) }
    });

    return res.json({
      success: true,
      message: 'Donation deleted successfully'
    });
  } catch (error) {
    console.error('Delete donation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 