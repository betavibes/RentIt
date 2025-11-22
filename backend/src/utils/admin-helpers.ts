import { pool } from '../config/database';

export const getDashboardStats = async () => {
  const [ordersResult, revenueResult, activeRentalsResult, refundAlertsResult, productsResult] =
    await Promise.all([
      pool.query(`SELECT COUNT(*) as count FROM rentals WHERE DATE(created_at) = CURRENT_DATE`),
      pool.query(
        `SELECT SUM(total_price) as total FROM rentals WHERE DATE(created_at) = CURRENT_DATE`
      ),
      pool.query(
        `SELECT COUNT(*) as count FROM rentals WHERE status IN ('active', 'confirmed')`
      ),
      pool.query(
        `SELECT COUNT(*) as count FROM refunds WHERE status = 'pending'`
      ),
      pool.query(`SELECT COUNT(*) as count FROM products WHERE status = 'available'`),
    ]);

  return {
    daily_orders: ordersResult.rows[0]?.count || 0,
    daily_revenue: revenueResult.rows[0]?.total || 0,
    active_rentals: activeRentalsResult.rows[0]?.count || 0,
    pending_refunds: refundAlertsResult.rows[0]?.count || 0,
    available_products: productsResult.rows[0]?.count || 0,
  };
};

export const getPopularProducts = async (limit: number = 10) => {
  const result = await pool.query(
    `SELECT p.id, p.name, p.price_per_day, COUNT(r.id) as rental_count
     FROM products p
     LEFT JOIN rentals r ON p.id = r.product_id
     GROUP BY p.id, p.name, p.price_per_day
     ORDER BY rental_count DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
};

export const getAllRentals = async (filters: {
  status?: string;
  user_id?: string;
  limit?: number;
  offset?: number;
}) => {
  const { status, user_id, limit = 50, offset = 0 } = filters;

  let query = `
    SELECT r.id, r.user_id, r.product_id, r.rental_start_date, r.rental_end_date,
           r.status, r.total_price, r.created_at,
           u.full_name, u.email, p.name as product_name
    FROM rentals r
    LEFT JOIN users u ON r.user_id = u.id
    LEFT JOIN products p ON r.product_id = p.id
    WHERE 1=1
  `;

  const params: any[] = [];
  let paramCount = 1;

  if (status) {
    query += ` AND r.status = $${paramCount}`;
    params.push(status);
    paramCount++;
  }

  if (user_id) {
    query += ` AND r.user_id = $${paramCount}`;
    params.push(user_id);
    paramCount++;
  }

  query += ` ORDER BY r.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
  params.push(limit, offset);

  const result = await pool.query(query, params);
  return result.rows;
};

export const getAllUsers = async (filters: {
  role?: string;
  is_active?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}) => {
  const { role, is_active, search, limit = 50, offset = 0 } = filters;

  let query = `
    SELECT u.id, u.email, u.phone, u.full_name, u.college, u.is_active,
           (SELECT name FROM roles WHERE id = u.role_id) as role, u.created_at
    FROM users u
    WHERE 1=1
  `;

  const params: any[] = [];
  let paramCount = 1;

  if (role) {
    query += ` AND (SELECT name FROM roles WHERE id = u.role_id) = $${paramCount}`;
    params.push(role);
    paramCount++;
  }

  if (is_active !== undefined) {
    query += ` AND u.is_active = $${paramCount}`;
    params.push(is_active);
    paramCount++;
  }

  if (search) {
    query += ` AND (u.email ILIKE $${paramCount} OR u.full_name ILIKE $${paramCount})`;
    params.push(`%${search}%`);
    paramCount++;
  }

  query += ` ORDER BY u.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
  params.push(limit, offset);

  const result = await pool.query(query, params);
  return result.rows;
};

export const getPendingRefunds = async (limit: number = 50) => {
  const result = await pool.query(
    `SELECT r.id, r.amount, r.reason, r.created_at,
            rent.user_id, u.full_name, u.email
     FROM refunds r
     LEFT JOIN rentals rent ON r.rental_id = rent.id
     LEFT JOIN users u ON rent.user_id = u.id
     WHERE r.status = 'pending'
     ORDER BY r.created_at ASC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
};

export const getRevenueAnalytics = async (days: number = 30) => {
  const result = await pool.query(
    `SELECT DATE(created_at) as date, COUNT(*) as order_count, SUM(total_price) as revenue
     FROM rentals
     WHERE created_at >= NOW() - INTERVAL '${days} days'
     GROUP BY DATE(created_at)
     ORDER BY date DESC`,
    []
  );
  return result.rows;
};

export const getInventoryStatus = async () => {
  const result = await pool.query(
    `SELECT 
      status, 
      COUNT(*) as count
     FROM products
     GROUP BY status`
  );
  return result.rows;
};

export const getUserStats = async () => {
  const [totalUsers, activeUsers, studentUsers] = await Promise.all([
    pool.query(`SELECT COUNT(*) as count FROM users`),
    pool.query(`SELECT COUNT(*) as count FROM users WHERE is_active = true`),
    pool.query(`SELECT COUNT(*) as count FROM users WHERE college IS NOT NULL`),
  ]);

  return {
    total_users: totalUsers.rows[0]?.count || 0,
    active_users: activeUsers.rows[0]?.count || 0,
    student_users: studentUsers.rows[0]?.count || 0,
  };
};

export const blockUser = async (userId: string) => {
  const result = await pool.query(
    `UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING *`,
    [userId]
  );
  return result.rows[0];
};

export const unblockUser = async (userId: string) => {
  const result = await pool.query(
    `UPDATE users SET is_active = true, updated_at = NOW() WHERE id = $1 RETURNING *`,
    [userId]
  );
  return result.rows[0];
};
