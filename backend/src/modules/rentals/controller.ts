import { Request, Response } from 'express';
import { pool } from '../../config/database';
import { v4 as uuidv4 } from 'uuid';

// Create a new rental order
export const createOrder = async (req: any, res: Response) => {
    const client = await pool.connect();
    try {
        const userId = req.user.id;
        const { items, rentalStartDate, rentalEndDate, notes } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Order must contain at least one item' });
        }

        await client.query('BEGIN');

        // Calculate totals
        let totalAmount = 0;
        let depositAmount = 0;

        // Validate products and calculate amounts
        for (const item of items) {
            const product = await client.query(
                'SELECT * FROM products WHERE id = $1',
                [item.productId]
            );

            if (product.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ message: `Product ${item.productId} not found` });
            }

            if (product.rows[0].condition !== 'available') {
                await client.query('ROLLBACK');
                return res.status(400).json({ message: `Product ${product.rows[0].name} is not available` });
            }

            const days = Math.ceil((new Date(rentalEndDate).getTime() - new Date(rentalStartDate).getTime()) / (1000 * 60 * 60 * 24));
            const subtotal = product.rows[0].price * days * (item.quantity || 1);
            const itemDeposit = product.rows[0].deposit * (item.quantity || 1);

            totalAmount += subtotal;
            depositAmount += itemDeposit;
        }

        // Create order
        const orderId = uuidv4();
        await client.query(
            `INSERT INTO orders (id, user_id, total_amount, deposit_amount, status, rental_start_date, rental_end_date, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [orderId, userId, totalAmount, depositAmount, 'pending', rentalStartDate, rentalEndDate, notes]
        );

        // Create order items and update product status
        for (const item of items) {
            const product = await client.query('SELECT * FROM products WHERE id = $1', [item.productId]);
            const productData = product.rows[0];

            const days = Math.ceil((new Date(rentalEndDate).getTime() - new Date(rentalStartDate).getTime()) / (1000 * 60 * 60 * 24));
            const subtotal = productData.price * days * (item.quantity || 1);

            await client.query(
                `INSERT INTO order_items (id, order_id, product_id, daily_rate, deposit, quantity, subtotal)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [uuidv4(), orderId, item.productId, productData.price, productData.deposit, item.quantity || 1, subtotal]
            );

            // Update product status to rented
            await client.query(
                'UPDATE products SET condition = $1 WHERE id = $2',
                ['rented', item.productId]
            );
        }

        await client.query('COMMIT');

        // Fetch created order with details
        const orderResult = await client.query(
            `SELECT o.*, u.name as user_name, u.email as user_email
       FROM orders o
       JOIN users u ON o.user_id = u.id
       WHERE o.id = $1`,
            [orderId]
        );

        res.status(201).json(orderResult.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Create order error:', error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        client.release();
    }
};

// Get current user's orders
export const getMyOrders = async (req: any, res: Response) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT o.*,
        json_agg(json_build_object(
          'id', oi.id,
          'productId', oi.product_id,
          'productName', p.name,
          'productImage', (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1),
          'dailyRate', oi.daily_rate,
          'deposit', oi.deposit,
          'quantity', oi.quantity,
          'subtotal', oi.subtotal
        )) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
            [userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Get my orders error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get order by ID
export const getOrderById = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const isAdmin = req.user.role === 'admin';

        const result = await pool.query(
            `SELECT o.*, u.name as user_name, u.email as user_email, u.phone_number as user_phone,
        json_agg(json_build_object(
          'id', oi.id,
          'productId', oi.product_id,
          'productName', p.name,
          'productImage', (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1),
          'dailyRate', oi.daily_rate,
          'deposit', oi.deposit,
          'quantity', oi.quantity,
          'subtotal', oi.subtotal
        )) as items
       FROM orders o
       JOIN users u ON o.user_id = u.id
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE o.id = $1 ${!isAdmin ? 'AND o.user_id = $2' : ''}
       GROUP BY o.id, u.name, u.email, u.phone_number`,
            isAdmin ? [id] : [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all orders (Admin only)
export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const { status, startDate, endDate } = req.query;

        let query = `
      SELECT o.*, u.name as user_name, u.email as user_email,
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE 1=1
    `;
        const params: any[] = [];
        let paramIndex = 1;

        if (status) {
            query += ` AND o.status = $${paramIndex}`;
            params.push(status);
            paramIndex++;
        }

        if (startDate) {
            query += ` AND o.rental_start_date >= $${paramIndex}`;
            params.push(startDate);
            paramIndex++;
        }

        if (endDate) {
            query += ` AND o.rental_end_date <= $${paramIndex}`;
            params.push(endDate);
            paramIndex++;
        }

        query += ' ORDER BY o.created_at DESC';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update order status (Admin only)
export const updateOrderStatus = async (req: Request, res: Response) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;
        const { status, actualReturnDate, notes } = req.body;

        await client.query('BEGIN');

        // Get current order
        const orderResult = await client.query('SELECT * FROM orders WHERE id = $1', [id]);
        if (orderResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Order not found' });
        }

        const currentOrder = orderResult.rows[0];

        // Update order
        await client.query(
            `UPDATE orders SET status = $1, actual_return_date = $2, notes = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4`,
            [status, actualReturnDate, notes, id]
        );

        // If order is completed or cancelled, update product status back to available
        if (status === 'completed' || status === 'cancelled') {
            const items = await client.query('SELECT product_id FROM order_items WHERE order_id = $1', [id]);
            for (const item of items.rows) {
                await client.query(
                    'UPDATE products SET condition = $1 WHERE id = $2',
                    ['available', item.product_id]
                );
            }
        }

        await client.query('COMMIT');

        const updatedOrder = await client.query('SELECT * FROM orders WHERE id = $1', [id]);
        res.json(updatedOrder.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Update order status error:', error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        client.release();
    }
};

// Cancel order
export const cancelOrder = async (req: any, res: Response) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const isAdmin = req.user.role === 'admin';

        await client.query('BEGIN');

        // Get order
        const orderResult = await client.query(
            `SELECT * FROM orders WHERE id = $1 ${!isAdmin ? 'AND user_id = $2' : ''}`,
            isAdmin ? [id] : [id, userId]
        );

        if (orderResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Order not found' });
        }

        const order = orderResult.rows[0];

        // Only allow cancellation if order is pending or confirmed
        if (order.status !== 'pending' && order.status !== 'confirmed') {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Cannot cancel order in current status' });
        }

        // Update order status
        await client.query(
            'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            ['cancelled', id]
        );

        // Restore product availability
        const items = await client.query('SELECT product_id FROM order_items WHERE order_id = $1', [id]);
        for (const item of items.rows) {
            await client.query(
                'UPDATE products SET condition = $1 WHERE id = $2',
                ['available', item.product_id]
            );
        }

        await client.query('COMMIT');

        res.json({ message: 'Order cancelled successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Cancel order error:', error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        client.release();
    }
};
