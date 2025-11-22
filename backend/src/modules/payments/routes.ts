import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth';
import {
    initiatePayment,
    processPayment,
    getPaymentStatus,
    refundPayment
} from './controller';

const router = Router();

// Customer routes
router.post('/initiate', authenticate, initiatePayment);
router.post('/process', authenticate, processPayment);
router.get('/:id/status', authenticate, getPaymentStatus);

// Admin routes
router.post('/:id/refund', authenticate, requireAdmin, refundPayment);

export default router;
