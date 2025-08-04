import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { getAllUsers,
    getUserById,
    updateProfile,
    createUser,
    searchUsers,
    updateUser, 
    deleteUser,
    getCurrentUser
  } from '../controllers/userController';
import { requireManager, requireMember } from '../middleware/auth';

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
  console.log('handleValidationErrors')
  next();
};

const validateUserPayload = [
  body('firstName').optional().trim().isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  body('lastName').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  body('phone').optional().isMobilePhone('any').withMessage('Please enter a valid phone number'),
  body('address').optional().trim().isLength({ max: 200 }).withMessage('Address cannot exceed 200 characters'),
];

// @route   GET /api/users
// @desc    Get all users (admin/manager only)
// @access  Private
router.get('/', requireMember, getAllUsers);

// @route   GET /api/users/me
// @desc    Get current user
// @access  Private
router.get('/me', getCurrentUser);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', getUserById);


// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', validateUserPayload, handleValidationErrors,  updateProfile);

// @route   POST /api/users
// @desc    Create new user (admin only)
// @access  Private
router.post('/', requireManager, validateUserPayload, handleValidationErrors, createUser);

// @route   POST /api/users/search
// @desc    Search users by firstName, lastName, email, or phone
// @access  Private
router.post('/search', [
  body('searchText').trim().isLength({ max: 50 }).withMessage('Search text must be less than 50 characters')
], handleValidationErrors, searchUsers);

// @route   PUT /api/users/:id
// @desc    Update user by ID (admin only)
// @access  Private
router.put('/:id', requireManager, validateUserPayload, handleValidationErrors, updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user by ID (admin only)
// @access  Private
router.delete('/:id', requireManager, deleteUser);

export default router; 