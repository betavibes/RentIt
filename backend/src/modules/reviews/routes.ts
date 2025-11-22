import express from 'express';
import { authMiddleware } from '../../middleware/auth';
import {
    createReview,
    getProductReviews,
    getUserReviews,
    updateReview,
    deleteReview,
    getProductRating
} from './controller';

const router = express.Router();

// Public routes
router.get('/product/:productId', getProductReviews);
router.get('/product/:productId/rating', getProductRating);

// Protected routes (require authentication)
router.post('/', authMiddleware, createReview);
router.get('/my-reviews', authMiddleware, getUserReviews);
router.put('/:id', authMiddleware, updateReview);
router.delete('/:id', authMiddleware, deleteReview);

export default router;
