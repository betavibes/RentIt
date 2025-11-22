import { Request, Response } from 'express';
import { pool } from '../../config/database';
import { v4 as uuidv4 } from 'uuid';

// Simulate payment processing delay
const simulatePaymentProcessing = () => new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

// Test card validation
const validateTestCard = (cardNumber: string): boolean => {
    const successCards = ['4111111111111111'];
    const failureCards = ['4000000000000002'];

    if (successCards.includes(cardNumber.replace(/\s/g, ''))) return true;
    if (failureCards.includes(cardNumber.replace(/\s/g, ''))) return false;

    // Random success for other cards (90% success rate)
    return Math.random() > 0.1;
};

// Test UPI validation
const validateTestUPI = (upiId: string): boolean => {
    const successUPIs = ['test@upi', 'demo@paytm'];
    const failureUPIs = ['fail@upi'];

    if (successUPIs.includes(upiId.toLowerCase())) return true;
    if (failureUPIs.includes(upiId.toLowerCase())) return false;

    // Random success for other UPIs (90% success rate)
    return Math.random() > 0.1;
};

// Initiate payment
export const initiatePayment = async (req: any, res: Response) => {
    try {
        const { orderId } = req.body;
        const userId = req.user.id;

        // Verify order exists and belongs to user
        const orderResult = await pool.query(
            'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
            [orderId, userId]
        );

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const order = orderResult.rows[0];
        const totalAmount = parseFloat(order.total_amount) + parseFloat(order.deposit_amount);

        // Generate transaction ID
        const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Create payment record
        const paymentId = uuidv4();
        await pool.query(
            `INSERT INTO payments (id, order_id, amount, payment_method, status, transaction_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
            [paymentId, orderId, totalAmount, 'pending', 'pending', transactionId]
        );

        res.json({
            paymentId,
            orderId,
            amount: totalAmount,
            transactionId
        });
    } catch (error) {
        console.error('Initiate payment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Process payment (Demo)
export const processPayment = async (req: any, res: Response) => {
    try {
        const { paymentId, paymentMethod, paymentDetails } = req.body;

        // Get payment record
        const paymentResult = await pool.query('SELECT * FROM payments WHERE id = $1', [paymentId]);
        if (paymentResult.rows.length === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        const payment = paymentResult.rows[0];

        // Update status to processing
        await pool.query(
            'UPDATE payments SET status = $1, payment_method = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
            ['processing', paymentMethod, paymentId]
        );

        // Simulate payment processing
        await simulatePaymentProcessing();

        // Validate payment based on method
        let success = false;
        let gatewayResponse: any = {
            timestamp: new Date().toISOString(),
            method: paymentMethod
        };

        if (paymentMethod === 'card') {
            success = validateTestCard(paymentDetails.cardNumber);
            gatewayResponse.cardLast4 = paymentDetails.cardNumber.slice(-4);
        } else if (paymentMethod === 'upi') {
            success = validateTestUPI(paymentDetails.upiId);
            gatewayResponse.upiId = paymentDetails.upiId;
        } else if (paymentMethod === 'wallet') {
            // Wallet always succeeds for demo wallet
            success = paymentDetails.walletType === 'demo' || Math.random() > 0.1;
            gatewayResponse.walletType = paymentDetails.walletType;
        }

        const newStatus = success ? 'completed' : 'failed';
        gatewayResponse.status = newStatus;
        gatewayResponse.message = success ? 'Payment successful' : 'Payment failed';

        // Update payment status
        await pool.query(
            `UPDATE payments SET status = $1, payment_gateway_response = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3`,
            [newStatus, JSON.stringify(gatewayResponse), paymentId]
        );

        // If payment successful, update order status to confirmed
        if (success) {
            await pool.query(
                'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
                ['confirmed', payment.order_id]
            );
        }

        res.json({
            success,
            paymentId,
            status: newStatus,
            transactionId: payment.transaction_id,
            message: gatewayResponse.message
        });
    } catch (error) {
        console.error('Process payment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get payment status
export const getPaymentStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await pool.query('SELECT * FROM payments WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Get payment status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Refund payment (Admin only)
export const refundPayment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const paymentResult = await pool.query('SELECT * FROM payments WHERE id = $1', [id]);
        if (paymentResult.rows.length === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        const payment = paymentResult.rows[0];

        if (payment.status !== 'completed') {
            return res.status(400).json({ message: 'Can only refund completed payments' });
        }

        // Update payment status to refunded
        await pool.query(
            'UPDATE payments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            ['refunded', id]
        );

        // Update order status to cancelled
        await pool.query(
            'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            ['cancelled', payment.order_id]
        );

        res.json({ message: 'Payment refunded successfully' });
    } catch (error) {
        console.error('Refund payment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
