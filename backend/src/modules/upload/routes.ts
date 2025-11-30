import { Router } from 'express';
import { uploadProductImages } from './controller';
import { upload } from '../../config/upload';
import { authMiddleware } from '../../middleware/auth';
import { requireAdmin } from '../../middleware/auth';

const router = Router();

// Upload product images (up to 4 images)
// Protected route - only admins can upload
router.post(
    '/product-images',
    authMiddleware,
    requireAdmin,
    upload.array('images', 4), // Accept up to 4 images with field name 'images'
    uploadProductImages
);

export default router;
