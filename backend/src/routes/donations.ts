import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Donation } from '../models/Donation';
import { AuthRequest } from '../types';
import { requireManager } from '../middleware/auth';

const router = Router();

// @route   GET /api/donations
// @desc    Get all donations (manager/admin only)
// @access  Private
router.get('/', requireManager, async (req: Request, res: Response) => {
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
});

// @route   GET /api/donations/my
// @desc    Get user's donations
// @access  Private
router.get('/my', async (req: AuthRequest, res: Response) => {
  try {
    const donations = await Donation.find({ donor: req.user!._id })
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
});

// @route   POST /api/donations
// @desc    Create new donation
// @access  Private
router.post('/', [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('currency').isIn(['USD', 'EUR', 'GBP', 'INR']).withMessage('Invalid currency'),
  body('purpose').optional().trim().isLength({ max: 200 }),
  body('anonymous').isBoolean().withMessage('Anonymous must be a boolean'),
  body('paymentMethod').isIn(['credit_card', 'debit_card', 'bank_transfer', 'paypal', 'cash']).withMessage('Invalid payment method')
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

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
});

// @route   PUT /api/donations/:id/status
// @desc    Update donation status (manager/admin only)
// @access  Private
router.put('/:id/status', requireManager, [
  body('status').isIn(['pending', 'completed', 'failed']).withMessage('Invalid status'),
  body('transactionId').optional().trim()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

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

    res.json({
      success: true,
      message: 'Donation status updated successfully',
      data: { donation }
    });
  } catch (error) {
    console.error('Update donation status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router; 