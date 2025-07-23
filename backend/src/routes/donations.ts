import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { getAllDonations, getUserDonations, createDonation, updateDonationStatus } from '../controllers/donationController';
import { requireManager } from '../middleware/auth';

const router = Router();

// Validation middleware
const handleValidationErrors = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    });
  }
  next();
};

// @route   GET /api/donations
// @desc    Get all donations (manager/admin only)
// @access  Private
router.get('/', requireManager, getAllDonations);

// @route   GET /api/donations/my
// @desc    Get user's donations
// @access  Private
router.get('/my', getUserDonations);

// @route   POST /api/donations
// @desc    Create new donation
// @access  Private
router.post('/', [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('currency').isIn(['USD', 'EUR', 'GBP', 'INR']).withMessage('Invalid currency'),
  body('purpose').optional().trim().isLength({ max: 200 }),
  body('anonymous').isBoolean().withMessage('Anonymous must be a boolean'),
  body('paymentMethod').isIn(['credit_card', 'debit_card', 'bank_transfer', 'paypal', 'cash']).withMessage('Invalid payment method'),
  handleValidationErrors
], createDonation);

// @route   PUT /api/donations/:id/status
// @desc    Update donation status (manager/admin only)
// @access  Private
router.put('/:id/status', requireManager, [
  body('status').isIn(['pending', 'completed', 'failed']).withMessage('Invalid status'),
  body('transactionId').optional().trim(),
  handleValidationErrors
], updateDonationStatus);

export default router; 