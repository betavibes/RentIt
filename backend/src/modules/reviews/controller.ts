import { Request, Response } from 'express';
import { pool } from '../../config/database';

// Create a review
export const createReview = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { productId, orderId, rating, comment } = req.body;

        // Validate input
        if (!productId || !orderId || !rating) {
            return res.status(400).json({ message: 'Product ID, Order ID, and rating are required' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        // Check if order exists and belongs to user
        const orderCheck = await pool.query(
            'SELECT id, status FROM orders WHERE id = $1 AND user_id = $2',
            [orderId, userId]
        );

        if (orderCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if order is completed
        if (orderCheck.rows[0].status !== 'completed') {
            return res.status(400).json({ message: 'Can only review completed orders' });
        }

        // Check if review already exists
        const existingReview = await pool.query(
            'SELECT id FROM reviews WHERE order_id = $1 AND product_id = $2',
            [orderId, productId]
        );

        if (existingReview.rows.length > 0) {
            return res.status(400).json({ message: 'Review already exists for this product in this order' });
        }

        // Create review
        const result = await pool.query(
            `INSERT INTO reviews (product_id, user_id, order_id, rating, comment)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [productId, userId, orderId, rating, comment]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({ message: 'Failed to create review' });
    }
};

// Get reviews for a product
export const getProductReviews = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;

        const result = await pool.query(
            `SELECT r.*, u.name as user_name
             FROM reviews r
             JOIN users u ON r.user_id = u.id
             WHERE r.product_id = $1
             ORDER BY r.created_at DESC`,
            [productId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Get product reviews error:', error);
        res.status(500).json({ message: 'Failed to get reviews' });
    }
};

// Get user's reviews
export const getUserReviews = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;

        const result = await pool.query(
            `SELECT r.*, p.name as product_name,
             (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as product_image
             FROM reviews r
             JOIN products p ON r.product_id = p.id
             WHERE r.user_id = $1
             ORDER BY r.created_at DESC`,
            [userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Get user reviews error:', error);
        res.status(500).json({ message: 'Failed to get reviews' });
    }
};

// Update a review
export const updateReview = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { id } = req.params;
        const { rating, comment } = req.body;

        if (!rating) {
            return res.status(400).json({ message: 'Rating is required' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        // Check if review exists and belongs to user
        const reviewCheck = await pool.query(
            'SELECT id FROM reviews WHERE id = $1 AND user_id = $2',
            [id, userId]
        );

        if (reviewCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Review not found or unauthorized' });
        }

        // Update review
        const result = await pool.query(
            `UPDATE reviews SET rating = $1, comment = $2
             WHERE id = $3
             RETURNING *`,
            [rating, comment, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({ message: 'Failed to update review' });
    }
};

// Delete a review
export const deleteReview = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const userRole = (req as any).user.role;
        const { id } = req.params;

        // Admin can delete any review, users can only delete their own
        let query = 'DELETE FROM reviews WHERE id = $1';
        const params: any[] = [id];

        if (userRole !== 'admin') {
            query += ' AND user_id = $2';
            params.push(userId);
        }

        query += ' RETURNING id';

        const result = await pool.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Review not found or unauthorized' });
        }

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({ message: 'Failed to delete review' });
    }
};

// Get product rating summary
export const getProductRating = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;

        const result = await pool.query(
            `SELECT 
                COALESCE(AVG(rating), 0) as average_rating,
                COUNT(*) as total_reviews
             FROM reviews
             WHERE product_id = $1`,
            [productId]
        );

        res.json({
            averageRating: parseFloat(result.rows[0].average_rating).toFixed(1),
            totalReviews: parseInt(result.rows[0].total_reviews)
        });
    } catch (error) {
        console.error('Get product rating error:', error);
        res.status(500).json({ message: 'Failed to get rating' });
    }
};
