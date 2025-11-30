import { Router } from 'express';
import { generateProductImages } from './controller';
import { authMiddleware, requireAdmin } from '../../middleware/auth';

const router = Router();

// Generate product images using AI
// Protected route - only admins can generate
router.post(
    '/generate-images',
    authMiddleware,
    requireAdmin,
    generateProductImages
);

export default router;
