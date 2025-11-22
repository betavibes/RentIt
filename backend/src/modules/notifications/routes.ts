import express from 'express';
import { authMiddleware } from '../../middleware/auth';
import {
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
} from './controller';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', getUserNotifications);
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllAsRead);
router.delete('/:id', deleteNotification);

export default router;
