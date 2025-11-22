import express from 'express';
import { authMiddleware } from '../../middleware/auth';
import { getProfile, updateProfile, changePassword, getDashboardStats } from './controller';

const router = express.Router();

// All routes require authentication
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.put('/password', authMiddleware, changePassword);
router.get('/dashboard/stats', authMiddleware, getDashboardStats);

export default router;
