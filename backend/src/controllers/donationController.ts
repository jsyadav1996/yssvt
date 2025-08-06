import { Request, Response } from 'express';
import { donationService } from '../services/donationService';

// Extend Request to include user
interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get all donations (manager/admin only)
// @access  Private
export const getAllDonations = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const result = await donationService.getDonations({
      page: Number(page),
      limit: Number(limit)
    });

    const totalDonationAmount = await donationService.getTotalDonationAmount();

    res.json({
      success: true,
      data: {
        donations: result.donations,
        totalDonationAmount: Number(totalDonationAmount),
        pagination: {
          currentPage: result.pagination.currentPage,
          totalPages: result.pagination.totalPages,
          totalDonations: result.pagination.totalDonations,
          hasNext: result.pagination.hasNextPage,
          hasPrev: result.pagination.hasPrevPage
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

    const result = await donationService.getUserDonations(
      parseInt(req.user!.id),
      Number(page),
      Number(limit)
    );

    res.json({
      success: true,
      data: {
        donations: result.donations,
        pagination: {
          currentPage: result.pagination.currentPage,
          totalPages: result.pagination.totalPages,
          totalDonations: result.pagination.totalDonations,
          hasNext: result.pagination.hasNextPage,
          hasPrev: result.pagination.hasPrevPage
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

    const donation = await donationService.createDonation({
      donorId: donorId ? parseInt(donorId) : parseInt(req.user!.id),
      amount,
      purpose,
      paymentMethod,
      ...(date && { date: new Date(date) }),
      ...(location && { location }),
      ...(bankName && { bankName })
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
    const donation = await donationService.findDonationById(parseInt(req.params.id));

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

    const donation = await donationService.updateDonation(parseInt(req.params.id), updateData);

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
    const donation = await donationService.findDonationById(parseInt(req.params.id));

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    await donationService.deleteDonation(parseInt(req.params.id));

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