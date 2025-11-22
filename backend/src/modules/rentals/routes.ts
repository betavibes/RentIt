import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth';
import {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    cancelOrder
} from './controller';

const router = Router();

// Customer routes
router.post('/', authenticate, createOrder);
router.get('/my-orders', authenticate, getMyOrders);
router.get('/:id', authenticate, getOrderById);
router.delete('/:id', authenticate, cancelOrder);

// Admin routes
router.get('/', authenticate, requireAdmin, getAllOrders);
router.patch('/:id/status', authenticate, requireAdmin, updateOrderStatus);

export default router;
