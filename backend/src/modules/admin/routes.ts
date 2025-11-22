import { Router } from 'express';
import { getAllUsers, updateUserStatus, updateUserRole } from './controller';
import { authMiddleware } from '../../middleware/auth';
import { adminMiddleware } from '../../middleware/admin';

const router = Router();

// Protect all admin routes
router.use(authMiddleware, adminMiddleware);

router.get('/users', getAllUsers);
router.patch('/users/:id/status', updateUserStatus);
router.patch('/users/:id/role', updateUserRole);

export default router;
