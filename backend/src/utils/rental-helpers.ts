import { pool } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export const createRental = async (data: {
  user_id: string;
  product_id: string;
  rental_start_date: Date;
  rental_end_date: Date;
  total_price: number;
  security_deposit: number;
  late_fee?: number;
  damage_charges?: number;
  notes?: string;
}) => {
  const id = uuidv4();
  const result = await pool.query(
    `INSERT INTO rentals (
      id, user_id, product_id, rental_start_date, rental_end_date,
      status, total_price, security_deposit, late_fee, damage_charges, notes, created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, 'pending', $6, $7, $8, $9, $10, NOW(), NOW())
    RETURNING *`,
    [
      id,
      data.user_id,
      data.product_id,
      data.rental_start_date,
      data.rental_end_date,
      data.total_price,
      data.security_deposit,
      data.late_fee || 0,
      data.damage_charges || 0,
      data.notes || '',
    ]
  );
  return result.rows[0];
};

export const getRentalById = async (id: string) => {
  const result = await pool.query(
    `SELECT r.*, u.full_name, u.email, u.phone, p.name as product_name
     FROM rentals r
     LEFT JOIN users u ON r.user_id = u.id
     LEFT JOIN products p ON r.product_id = p.id
     WHERE r.id = $1`,
    [id]
  );
  return result.rows[0];
};

export const getUserRentals = async (userId: string, status?: string) => {
  let query = `
    SELECT r.*, p.name as product_name, p.price_per_day, p.security_deposit,
           (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as product_image
    FROM rentals r
    LEFT JOIN products p ON r.product_id = p.id
    WHERE r.user_id = $1
  `;
  
  const params: any[] = [userId];
  
  if (status) {
    query += ` AND r.status = $2`;
    params.push(status);
  }
  
  query += ` ORDER BY r.created_at DESC`;
  
  const result = await pool.query(query, params);
  return result.rows;
};

export const updateRentalStatus = async (rentalId: string, status: string) => {
  const result = await pool.query(
    `UPDATE rentals SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [status, rentalId]
  );
  return result.rows[0];
};

export const calculateRentalCost = async (
  productId: string,
  startDate: Date,
  endDate: Date
) => {
  const result = await pool.query(
    `SELECT 
      id, name, price_per_day, security_deposit,
      TRUNC(EXTRACT(DAY FROM $2::timestamp - $1::timestamp)) as rental_days
     FROM products WHERE id = $3`,
    [startDate, endDate, productId]
  );
  
  if (result.rows.length === 0) return null;
  
  const product = result.rows[0];
  const rentalDays = Math.max(1, product.rental_days || 0);
  const totalRent = product.price_per_day * rentalDays;
  
  return {
    product_id: productId,
    product_name: product.name,
    rental_days: rentalDays,
    price_per_day: product.price_per_day,
    total_rent: totalRent,
    security_deposit: product.security_deposit,
    total_amount: totalRent + product.security_deposit,
  };
};

export const createRentalQuote = async (data: {
  user_id: string;
  product_id: string;
  rental_start_date: Date;
  rental_end_date: Date;
  total_price: number;
  security_deposit: number;
  notes?: string;
}) => {
  const id = uuidv4();
  const result = await pool.query(
    `INSERT INTO rental_quotes (
      id, user_id, product_id, rental_start_date, rental_end_date,
      total_price, security_deposit, notes, status, created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', NOW(), NOW())
    RETURNING *`,
    [
      id,
      data.user_id,
      data.product_id,
      data.rental_start_date,
      data.rental_end_date,
      data.total_price,
      data.security_deposit,
      data.notes || '',
    ]
  );
  return result.rows[0];
};

export const getRentalQuotes = async (userId: string) => {
  const result = await pool.query(
    `SELECT rq.*, p.name as product_name
     FROM rental_quotes rq
     LEFT JOIN products p ON rq.product_id = p.id
     WHERE rq.user_id = $1
     ORDER BY rq.created_at DESC`,
    [userId]
  );
  return result.rows;
};

export const acceptQuote = async (quoteId: string) => {
  const result = await pool.query(
    `SELECT * FROM rental_quotes WHERE id = $1`,
    [quoteId]
  );
  
  if (result.rows.length === 0) return null;
  
  const quote = result.rows[0];
  
  return createRental({
    user_id: quote.user_id,
    product_id: quote.product_id,
    rental_start_date: quote.rental_start_date,
    rental_end_date: quote.rental_end_date,
    total_price: quote.total_price,
    security_deposit: quote.security_deposit,
    notes: quote.notes,
  });
};
