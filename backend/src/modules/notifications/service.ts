import { pool } from '../../config/database';

// Notification service for creating notifications
export const createNotification = async (
    userId: string,
    type: string,
    title: string,
    message: string
) => {
    try {
        await pool.query(
            'INSERT INTO notifications (user_id, type, title, message) VALUES ($1, $2, $3, $4)',
            [userId, type, title, message]
        );
    } catch (error) {
        console.error('Create notification error:', error);
    }
};

// Notification helpers for common events
export const notifyOrderCreated = async (userId: string, orderId: string, totalAmount: number) => {
    await createNotification(
        userId,
        'order_created',
        'Order Placed Successfully',
        `Your order #${orderId.substring(0, 8)} for ₹${totalAmount} has been placed successfully.`
    );
};

export const notifyPaymentSuccess = async (userId: string, orderId: string, amount: number) => {
    await createNotification(
        userId,
        'payment_success',
        'Payment Successful',
        `Payment of ₹${amount} for order #${orderId.substring(0, 8)} was successful.`
    );
};

export const notifyOrderStatusChange = async (userId: string, orderId: string, status: string) => {
    const statusMessages: Record<string, string> = {
        confirmed: 'Your order has been confirmed and is being prepared.',
        completed: 'Your order has been completed. Thank you for renting with us!',
        cancelled: 'Your order has been cancelled.'
    };

    const message = statusMessages[status] || `Your order status has been updated to ${status}.`;

    await createNotification(
        userId,
        'order_status_change',
        `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        `Order #${orderId.substring(0, 8)}: ${message}`
    );
};
