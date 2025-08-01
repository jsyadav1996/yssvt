import { Request, Response } from 'express';
import { Donation } from '../models/Donation';
import { AuthRequest } from '../types';

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

    const donations = await Donation.find(filter)
      .populate('donor', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Donation.countDocuments(filter);

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
    const donations = await Donation.find({ donor: req.user!._id as string })
      .sort({ createdAt: -1 });

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

    const donation = new Donation({
      donor: req.user!._id,
      amount,
      currency,
      purpose,
      anonymous,
      paymentMethod,
      status: 'pending'
    });

    await donation.save();
    await donation.populate('donor', 'firstName lastName email');

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

    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).populate('donor', 'firstName lastName email');

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