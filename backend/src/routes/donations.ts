import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import { getAllDonations, getUserDonations, createDonation, updateDonation, getDonationById, deleteDonation } from '../controllers/donationController';
import { authMiddleware, requireAdmin, requireMember } from '../middleware/auth';

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
router.get('/', authMiddleware, requireMember, getAllDonations);

// @route   GET /api/donations/my
// @desc    Get user's donations
// @access  Private
// router.get('/my', getUserDonations);

// @route   GET /api/donations/:id
// @desc    Get donation by ID
// @access  Private
router.get('/:id', authMiddleware, requireMember, [
  param('id').isInt().withMessage('Invalid donation ID'),
  handleValidationErrors
], getDonationById);

// @route   POST /api/donations
// @desc    Create new donation
// @access  Private
router.post('/', authMiddleware, requireAdmin, [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('purpose').optional().trim().isLength({ max: 500 }).withMessage('Purpose must be less than 500 characters'),
  body('paymentMethod').isIn(['online', 'cash']).withMessage('Invalid payment method'),
  body('donorId').optional().isInt().withMessage('Invalid donor ID'),
  body('date').optional().isISO8601().withMessage('Invalid date format'),
  body('location').optional().trim().isLength({ max: 255 }).withMessage('Location must be less than 255 characters'),
  body('bankName').optional().trim().isLength({ max: 100 }).withMessage('Bank name must be less than 100 characters'),
  handleValidationErrors
], createDonation);

// @route   PUT /api/donations/:id
// @desc    Update donation
// @access  Private
router.put('/:id', authMiddleware, requireAdmin, [
  param('id').isInt().withMessage('Invalid donation ID'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('purpose').optional().trim().isLength({ max: 500 }).withMessage('Purpose must be less than 500 characters'),
  body('paymentMethod').isIn(['online', 'cash']).withMessage('Invalid payment method'),
  body('donorId').optional().isInt().withMessage('Invalid donor ID'),
  body('date').optional().isISO8601().withMessage('Invalid date format'),
  body('location').optional().trim().isLength({ max: 255 }).withMessage('Location must be less than 255 characters'),
  body('bankName').optional().trim().isLength({ max: 100 }).withMessage('Bank name must be less than 100 characters'),
  handleValidationErrors
], updateDonation);

// @route   DELETE /api/donations/:id
// @desc    Delete donation
// @access  Private
router.delete('/:id', authMiddleware, requireAdmin, [
  param('id').isInt().withMessage('Invalid donation ID'),
  handleValidationErrors
], deleteDonation);

export default router; 