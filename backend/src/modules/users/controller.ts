import { Request, Response } from 'express';
import { pool } from '../../config/database';
import bcrypt from 'bcryptjs';

// Get current user profile
export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;

        const result = await pool.query(
            `SELECT id, email, name, phone_number, address, city, state, postal_code, role, created_at
       FROM users WHERE id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = result.rows[0];
        res.json({
            id: user.id,
            email: user.email,
            name: user.name,
            phoneNumber: user.phone_number,
            address: user.address,
            city: user.city,
            state: user.state,
            postalCode: user.postal_code,
            role: user.role,
            createdAt: user.created_at
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Failed to get profile' });
    }
};

// Update user profile
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { name, phoneNumber, address, city, state, postalCode } = req.body;

        // Validate required fields
        if (!name || name.trim().length === 0) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const result = await pool.query(
            `UPDATE users 
       SET name = $1, phone_number = $2, address = $3, city = $4, state = $5, postal_code = $6
       WHERE id = $7
       RETURNING id, email, name, phone_number, address, city, state, postal_code, role, created_at`,
            [name, phoneNumber, address, city, state, postalCode, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = result.rows[0];
        res.json({
            id: user.id,
            email: user.email,
            name: user.name,
            phoneNumber: user.phone_number,
            address: user.address,
            city: user.city,
            state: user.state,
            postalCode: user.postal_code,
            role: user.role,
            createdAt: user.created_at
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
};

// Change password
export const changePassword = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { oldPassword, newPassword } = req.body;

        // Validate input
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Old and new passwords are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters' });
        }

        // Get current password hash
        const userResult = await pool.query(
            'SELECT password_hash FROM users WHERE id = $1',
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify old password
        const isValidPassword = await bcrypt.compare(oldPassword, userResult.rows[0].password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        // Update password
        await pool.query(
            'UPDATE users SET password_hash = $1 WHERE id = $2',
            [newPasswordHash, userId]
        );

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Failed to change password' });
    }
};

// Get dashboard statistics
export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;

        // Get active rentals (orders with status 'confirmed' or 'active')
        const activeRentalsResult = await pool.query(
            `SELECT COUNT(*) as count FROM orders 
       WHERE user_id = $1 AND status IN ('confirmed', 'active')`,
            [userId]
        );

        // Get upcoming returns (orders ending in next 7 days)
        const upcomingReturnsResult = await pool.query(
            `SELECT COUNT(*) as count FROM orders 
       WHERE user_id = $1 
       AND status IN ('confirmed', 'active')
       AND rental_end_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'`,
            [userId]
        );

        // Get total orders
        const totalOrdersResult = await pool.query(
            'SELECT COUNT(*) as count FROM orders WHERE user_id = $1',
            [userId]
        );

        // Get total spent (sum of all completed orders)
        const totalSpentResult = await pool.query(
            `SELECT COALESCE(SUM(total_amount), 0) as total FROM orders 
       WHERE user_id = $1 AND status = 'completed'`,
            [userId]
        );

        res.json({
            activeRentals: parseInt(activeRentalsResult.rows[0].count),
            upcomingReturns: parseInt(upcomingReturnsResult.rows[0].count),
            totalOrders: parseInt(totalOrdersResult.rows[0].count),
            totalSpent: parseFloat(totalSpentResult.rows[0].total)
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({ message: 'Failed to get dashboard statistics' });
    }
};
