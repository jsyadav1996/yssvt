import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent, deleteEventMedia } from '../controllers/eventController';
import { requireManager } from '../middleware/auth';
import { uploadMultipleImages } from '../middleware/upload';

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

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', getAllEvents);

// @route   GET /api/events/:id
// @desc    Get event by ID
// @access  Public
router.get('/:id', getEventById);

// @route   POST /api/events
// @desc    Create new event (manager/admin only)
// @access  Private
router.post('/', requireManager, uploadMultipleImages, [
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('date').isISO8601().withMessage('Please provide a valid date'),
  handleValidationErrors
], createEvent);

// @route   PUT /api/events/:id
// @desc    Update event (manager/admin only)
// @access  Private
router.put('/:id', requireManager, uploadMultipleImages, [
  body('title').optional().trim().isLength({ min: 3, max: 100 }),
  body('date').optional().isISO8601(),
  handleValidationErrors
], updateEvent);

// @route   DELETE /api/events/:id
// @desc    Delete event (manager/admin only)
// @access  Private
router.delete('/:id', requireManager, deleteEvent);

// @route   DELETE /api/events/media/:mediaId
// @desc    Delete individual event media (manager/admin only)
// @access  Private
router.delete('/media/:mediaId', requireManager, deleteEventMedia);

export default router; 