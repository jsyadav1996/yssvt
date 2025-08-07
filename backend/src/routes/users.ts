import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { getAllUsers,
    getUserById,
    createUser,
    searchUsers,
    updateUser, 
    deleteUser,
    getCurrentUser,
    updateProfile
  } from '../controllers/userController';
import { requireManager, requireMember } from '../middleware/auth';
import { uploadSingleImage } from '../middleware/upload';

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
  body('firstName').trim().isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  body('lastName').trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phone').optional().isMobilePhone('any').withMessage('Please enter a valid phone number'),
  body('address').optional().trim().isLength({ max: 200 }).withMessage('Address cannot exceed 200 characters'),
  body('city').optional().trim().isLength({ max: 50 }).withMessage('City cannot exceed 50 characters'),
  body('state').optional().trim().isLength({ max: 50 }).withMessage('State cannot exceed 50 characters'),
  body('pincode').optional().trim().isLength({ max: 50 }).withMessage('Pincode cannot exceed 50 characters'),
  body('dob').optional().isISO8601().withMessage('Please enter a valid date of birth'),
  body('gender').optional().isIn(['male', 'female']).withMessage('Gender must be either male or female'),
  body('occupationField').optional().custom((value) => {
    if (value === null || value === undefined || value === '') {
      return true; // Allow null, undefined, or empty string
    }
    
    const validFields = [
      'agriculture_and_allied',
      'industry_and_manufacturing',
      'trade_and_business',
      'government_and_public_services',
      'education_and_research',
      'healthcare',
      'media_and_entertainment',
      'corporate_sector',
      'legal_and_judiciary',
      'skilled_services',
      'transport_and_logistics',
      'hospitality_and_tourism',
      'freelancing_and_emerging_roles'
    ];
    
    if (!validFields.includes(value)) {
      throw new Error('Invalid occupation field');
    }
    
    return true;
  }),
  body('occupation').optional().custom((value) => {
    if (value === null || value === undefined || value === '') {
      return true; // Allow null, undefined, or empty string
    }
    
    const validOccupations = [
      'farmer',
      'fisherman',
      'livestock_rearer',
      'horticulturist',
      'factory_worker',
      'industrialist',
      'mechanic',
      'welder',
      'carpenter',
      'plumber',
      'shopkeeper',
      'entrepreneur',
      'wholesale_trader',
      'retail_salesperson',
      'small_business_owner',
      'government_employee',
      'police_officer',
      'soldier',
      'postman',
      'clerk',
      'teacher',
      'professor',
      'researcher',
      'tutor',
      'doctor',
      'nurse',
      'pharmacist',
      'medical_technician',
      'media_person_journalist',
      'actor',
      'singer',
      'photographer',
      'dancer',
      'engineer_it_civil_etc',
      'accountant',
      'hr_professional',
      'marketing_executive',
      'data_analyst',
      'lawyer',
      'judge',
      'barber',
      'tailor',
      'cobbler',
      'domestic_helper',
      'driver',
      'courier_delivery_agent',
      'chef',
      'hotel_manager',
      'tour_guide',
      'digital_marketer'
    ];
    
    if (!validOccupations.includes(value)) {
      throw new Error('Invalid occupation');
    }
    
    return true;
  }),
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

// @route   PUT /api/users/profile/image
// @desc    Update user profile with image
// @access  Private
router.put('/profile', uploadSingleImage, validateUserPayload, handleValidationErrors, updateProfile);

// @route   POST /api/users
// @desc    Create new user (admin only)
// @access  Private
router.post('/', requireManager, uploadSingleImage, validateUserPayload, handleValidationErrors, createUser);

// @route   POST /api/users/search
// @desc    Search users by firstName, lastName, email, or phone
// @access  Private
router.post('/search', [
  body('searchText').trim().isLength({ max: 50 }).withMessage('Search text must be less than 50 characters')
], handleValidationErrors, searchUsers);

// @route   PUT /api/users/:id
// @desc    Update user by ID (admin only)
// @access  Private
router.put('/:id', requireManager, uploadSingleImage, validateUserPayload, handleValidationErrors, updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user by ID (admin only)
// @access  Private
router.delete('/:id', requireManager, deleteUser);

export default router; 