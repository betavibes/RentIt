import { Request, Response } from 'express';
import { pool } from '../../config/database';

// Get revenue summary
export const getRevenueSummary = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT 
                COALESCE(SUM(total_amount), 0) as total_revenue,
                COALESCE(SUM(CASE WHEN DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE) THEN total_amount ELSE 0 END), 0) as monthly_revenue,
                COALESCE(SUM(CASE WHEN DATE(created_at) = CURRENT_DATE THEN total_amount ELSE 0 END), 0) as daily_revenue
            FROM orders
            WHERE status = 'completed'
        `);

        res.json({
            totalRevenue: parseFloat(result.rows[0].total_revenue),
            monthlyRevenue: parseFloat(result.rows[0].monthly_revenue),
            dailyRevenue: parseFloat(result.rows[0].daily_revenue)
        });
    } catch (error) {
        console.error('Get revenue summary error:', error);
        res.status(500).json({ message: 'Failed to get revenue summary' });
    }
};

// Get order statistics
export const getOrderStats = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT 
                COUNT(*) as total_orders,
                COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
                COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_orders,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
                COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders
            FROM orders
        `);

        res.json({
            totalOrders: parseInt(result.rows[0].total_orders),
            pendingOrders: parseInt(result.rows[0].pending_orders),
            confirmedOrders: parseInt(result.rows[0].confirmed_orders),
            completedOrders: parseInt(result.rows[0].completed_orders),
            cancelledOrders: parseInt(result.rows[0].cancelled_orders)
        });
    } catch (error) {
        console.error('Get order stats error:', error);
        res.status(500).json({ message: 'Failed to get order statistics' });
    }
};

// Get popular products
export const getPopularProducts = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT 
                p.id as product_id,
                p.name as product_name,
                COUNT(oi.id) as rental_count
            FROM products p
            JOIN order_items oi ON p.id = oi.product_id
            JOIN orders o ON oi.order_id = o.id
            WHERE o.status IN ('confirmed', 'completed')
            GROUP BY p.id, p.name
            ORDER BY rental_count DESC
            LIMIT 5
        `);

        res.json(result.rows.map(row => ({
            productId: row.product_id,
            productName: row.product_name,
            rentalCount: parseInt(row.rental_count)
        })));
    } catch (error) {
        console.error('Get popular products error:', error);
        res.status(500).json({ message: 'Failed to get popular products' });
    }
};

// Get customer statistics
export const getCustomerStats = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT 
                COUNT(DISTINCT u.id) as total_customers,
                COUNT(DISTINCT CASE WHEN o.id IS NOT NULL THEN u.id END) as active_customers
            FROM users u
            LEFT JOIN orders o ON u.id = o.user_id
            WHERE u.role = 'customer'
        `);

        res.json({
            totalCustomers: parseInt(result.rows[0].total_customers),
            activeCustomers: parseInt(result.rows[0].active_customers)
        });
    } catch (error) {
        console.error('Get customer stats error:', error);
        res.status(500).json({ message: 'Failed to get customer statistics' });
    }
};

// Get monthly revenue for last 12 months
export const getMonthlyRevenue = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT 
                TO_CHAR(DATE_TRUNC('month', created_at), 'Mon YYYY') as month,
                COALESCE(SUM(total_amount), 0) as revenue
            FROM orders
            WHERE status = 'completed'
                AND created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '11 months')
            GROUP BY DATE_TRUNC('month', created_at)
            ORDER BY DATE_TRUNC('month', created_at)
        `);

        res.json(result.rows.map(row => ({
            month: row.month,
            revenue: parseFloat(row.revenue)
        })));
    } catch (error) {
        console.error('Get monthly revenue error:', error);
        res.status(500).json({ message: 'Failed to get monthly revenue' });
    }
};

// Get recent activity
export const getRecentActivity = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT 
                o.id,
                o.total_amount,
                o.status,
                o.created_at,
                u.name as customer_name,
                'order' as type
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
            LIMIT 10
        `);

        res.json(result.rows);
    } catch (error) {
        console.error('Get recent activity error:', error);
        res.status(500).json({ message: 'Failed to get recent activity' });
    }
};
