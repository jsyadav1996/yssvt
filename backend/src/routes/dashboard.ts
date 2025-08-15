import express from 'express';
import { getDashboardData } from '../controllers/dashboardController';
import { authMiddleware, requireManager } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/dashboard
// @desc    Get dashboard statistics and recent activities
// @access  Private (admin/manager only)
router.get('/', authMiddleware, requireManager, getDashboardData);

export default router; 