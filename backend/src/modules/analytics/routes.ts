import express from 'express';
import { authMiddleware } from '../../middleware/auth';
import { adminMiddleware } from '../../middleware/admin';
import {
    getRevenueSummary,
    getOrderStats,
    getPopularProducts,
    getCustomerStats,
    getMonthlyRevenue,
    getRecentActivity
} from './controller';

const router = express.Router();

// All routes require admin authentication
router.use(authMiddleware, adminMiddleware);

router.get('/revenue', getRevenueSummary);
router.get('/orders', getOrderStats);
router.get('/products/popular', getPopularProducts);
router.get('/customers', getCustomerStats);
router.get('/revenue/monthly', getMonthlyRevenue);
router.get('/activity/recent', getRecentActivity);

export default router;
