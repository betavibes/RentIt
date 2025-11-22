import { pool } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export const createPayment = async (data: {
  rental_id: string;
  amount: number;
  payment_method: string;
  transaction_id?: string;
  status?: string;
}) => {
  const id = uuidv4();
  const result = await pool.query(
    `INSERT INTO payments (id, rental_id, amount, payment_method, transaction_id, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
     RETURNING *`,
    [
      id,
      data.rental_id,
      data.amount,
      data.payment_method,
      data.transaction_id || null,
      data.status || 'pending',
    ]
  );
  return result.rows[0];
};

export const getPaymentById = async (id: string) => {
  const result = await pool.query(
    `SELECT p.*, r.user_id, r.product_id FROM payments p
     LEFT JOIN rentals r ON p.rental_id = r.id
     WHERE p.id = $1`,
    [id]
  );
  return result.rows[0];
};

export const getRentalPayments = async (rentalId: string) => {
  const result = await pool.query(
    `SELECT * FROM payments WHERE rental_id = $1 ORDER BY created_at DESC`,
    [rentalId]
  );
  return result.rows;
};

export const updatePaymentStatus = async (paymentId: string, status: string, transactionId?: string) => {
  const result = await pool.query(
    `UPDATE payments SET status = $1, transaction_id = COALESCE($3, transaction_id), updated_at = NOW()
     WHERE id = $2 RETURNING *`,
    [status, paymentId, transactionId]
  );
  return result.rows[0];
};

export const createSecurityDeposit = async (data: {
  rental_id: string;
  amount: number;
  status?: string;
}) => {
  const id = uuidv4();
  const result = await pool.query(
    `INSERT INTO security_deposits (id, rental_id, amount, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, NOW(), NOW())
     RETURNING *`,
    [id, data.rental_id, data.amount, data.status || 'pending']
  );
  return result.rows[0];
};

export const getSecurityDeposit = async (rentalId: string) => {
  const result = await pool.query(
    `SELECT * FROM security_deposits WHERE rental_id = $1`,
    [rentalId]
  );
  return result.rows[0];
};

export const releaseSecurityDeposit = async (rentalId: string, damageCharges?: number) => {
  const result = await pool.query(
    `UPDATE security_deposits 
     SET status = 'released', damage_charges = $2, released_at = NOW()
     WHERE rental_id = $1
     RETURNING *`,
    [rentalId, damageCharges || 0]
  );
  return result.rows[0];
};

export const createWalletTransaction = async (data: {
  user_id: string;
  amount: number;
  transaction_type: 'credit' | 'debit';
  reference_id?: string;
  description?: string;
}) => {
  const id = uuidv4();
  const result = await pool.query(
    `INSERT INTO wallet_transactions (id, user_id, amount, transaction_type, reference_id, description, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW())
     RETURNING *`,
    [id, data.user_id, data.amount, data.transaction_type, data.reference_id, data.description]
  );
  return result.rows[0];
};

export const getUserWalletBalance = async (userId: string) => {
  const result = await pool.query(
    `SELECT 
      COALESCE(SUM(CASE WHEN transaction_type = 'credit' THEN amount ELSE 0 END) -
      SUM(CASE WHEN transaction_type = 'debit' THEN amount ELSE 0 END), 0) as balance
     FROM wallet_transactions
     WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0]?.balance || 0;
};

export const getWalletTransactions = async (userId: string, limit: number = 50, offset: number = 0) => {
  const result = await pool.query(
    `SELECT * FROM wallet_transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return result.rows;
};

export const createRefund = async (data: {
  rental_id: string;
  amount: number;
  reason: string;
  status?: string;
}) => {
  const id = uuidv4();
  const result = await pool.query(
    `INSERT INTO refunds (id, rental_id, amount, reason, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
     RETURNING *`,
    [id, data.rental_id, data.amount, data.reason, data.status || 'pending']
  );
  return result.rows[0];
};

export const getRefund = async (id: string) => {
  const result = await pool.query(
    `SELECT r.*, rent.user_id FROM refunds r
     LEFT JOIN rentals rent ON r.rental_id = rent.id
     WHERE r.id = $1`,
    [id]
  );
  return result.rows[0];
};

export const updateRefundStatus = async (refundId: string, status: string) => {
  const result = await pool.query(
    `UPDATE refunds SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [status, refundId]
  );
  return result.rows[0];
};

export const getRentalRefunds = async (rentalId: string) => {
  const result = await pool.query(
    `SELECT * FROM refunds WHERE rental_id = $1 ORDER BY created_at DESC`,
    [rentalId]
  );
  return result.rows;
};
