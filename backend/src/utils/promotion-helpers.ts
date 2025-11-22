import { pool } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export const createPromoCode = async (data: {
  code: string;
  description: string;
  discount_percentage?: number;
  discount_amount?: number;
  min_order_value?: number;
  max_usage_count?: number;
  valid_from: Date;
  valid_until: Date;
  is_active?: boolean;
  applicable_to?: 'all' | 'students' | 'specific_category';
  applicable_category_id?: string;
}) => {
  const id = uuidv4();
  const result = await pool.query(
    `INSERT INTO promo_codes (
      id, code, description, discount_percentage, discount_amount, min_order_value,
      max_usage_count, valid_from, valid_until, is_active, applicable_to, applicable_category_id, created_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
    RETURNING *`,
    [
      id,
      data.code.toUpperCase(),
      data.description,
      data.discount_percentage,
      data.discount_amount,
      data.min_order_value,
      data.max_usage_count,
      data.valid_from,
      data.valid_until,
      data.is_active ?? true,
      data.applicable_to || 'all',
      data.applicable_category_id,
    ]
  );
  return result.rows[0];
};

export const getPromoCode = async (code: string) => {
  const result = await pool.query(
    `SELECT * FROM promo_codes WHERE code = $1 AND is_active = true AND valid_until >= NOW()`,
    [code.toUpperCase()]
  );
  return result.rows[0];
};

export const validatePromoCode = async (
  code: string,
  orderValue: number,
  userId?: string,
  categoryId?: string
) => {
  const promoCode = await getPromoCode(code);

  if (!promoCode) {
    return { valid: false, error: 'Promo code not found or expired' };
  }

  if (orderValue < (promoCode.min_order_value || 0)) {
    return {
      valid: false,
      error: `Minimum order value of ${promoCode.min_order_value} required`,
    };
  }

  if (promoCode.max_usage_count) {
    const usageResult = await pool.query(
      `SELECT COUNT(*) as count FROM promo_usage WHERE promo_code_id = $1`,
      [promoCode.id]
    );

    if (usageResult.rows[0].count >= promoCode.max_usage_count) {
      return { valid: false, error: 'Promo code usage limit exceeded' };
    }
  }

  if (promoCode.applicable_to === 'students' && userId) {
    const userResult = await pool.query(`SELECT college FROM users WHERE id = $1`, [userId]);
    if (!userResult.rows[0]?.college) {
      return { valid: false, error: 'Promo code is only for students' };
    }
  }

  if (promoCode.applicable_to === 'specific_category' && categoryId) {
    if (promoCode.applicable_category_id !== categoryId) {
      return { valid: false, error: 'Promo code not applicable to this category' };
    }
  }

  const discount =
    (promoCode.discount_percentage ? (orderValue * promoCode.discount_percentage) / 100 : 0) +
    (promoCode.discount_amount || 0);

  return {
    valid: true,
    promoCode,
    discount,
    discountedPrice: Math.max(0, orderValue - discount),
  };
};

export const recordPromoUsage = async (promoCodeId: string, userId: string, rentalId: string) => {
  const id = uuidv4();
  const result = await pool.query(
    `INSERT INTO promo_usage (id, promo_code_id, user_id, rental_id, used_at)
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING *`,
    [id, promoCodeId, userId, rentalId]
  );
  return result.rows[0];
};

export const createStudentDiscount = async (data: {
  user_id: string;
  discount_percentage: number;
  reason: string;
  valid_until: Date;
}) => {
  const id = uuidv4();
  const result = await pool.query(
    `INSERT INTO student_discounts (id, user_id, discount_percentage, reason, valid_until, created_at)
     VALUES ($1, $2, $3, $4, $5, NOW())
     RETURNING *`,
    [id, data.user_id, data.discount_percentage, data.reason, data.valid_until]
  );
  return result.rows[0];
};

export const getStudentDiscount = async (userId: string) => {
  const result = await pool.query(
    `SELECT * FROM student_discounts 
     WHERE user_id = $1 AND valid_until >= NOW()
     ORDER BY created_at DESC LIMIT 1`,
    [userId]
  );
  return result.rows[0];
};

export const createReferralCode = async (userId: string) => {
  const code = `REF${userId.substring(0, 8).toUpperCase()}`;
  const result = await pool.query(
    `INSERT INTO referral_codes (user_id, code, created_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (user_id) DO UPDATE SET code = $2
     RETURNING *`,
    [userId, code]
  );
  return result.rows[0];
};

export const getReferralCode = async (userId: string) => {
  const result = await pool.query(
    `SELECT * FROM referral_codes WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0];
};

export const recordReferral = async (referredByUserId: string, newUserId: string) => {
  const id = uuidv4();
  const result = await pool.query(
    `INSERT INTO referrals (id, referred_by_user_id, new_user_id, reward_amount, created_at)
     VALUES ($1, $2, $3, 500, NOW())
     RETURNING *`,
    [id, referredByUserId, newUserId]
  );
  return result.rows[0];
};

export const getReferralStats = async (userId: string) => {
  const result = await pool.query(
    `SELECT 
      COUNT(*) as total_referrals,
      COALESCE(SUM(reward_amount), 0) as total_rewards
     FROM referrals WHERE referred_by_user_id = $1`,
    [userId]
  );
  return result.rows[0];
};

export const getOccasionCollections = async () => {
  const result = await pool.query(
    `SELECT id, name, description, theme_color, banner_image, is_active, created_at
     FROM occasion_collections WHERE is_active = true ORDER BY created_at DESC`
  );
  return result.rows;
};

export const getOccasionProducts = async (collectionId: string, limit: number = 20) => {
  const result = await pool.query(
    `SELECT DISTINCT p.id, p.name, p.price_per_day, p.security_deposit, p.color,
            (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as primary_image
     FROM products p
     JOIN occasion_collection_products ocp ON p.id = ocp.product_id
     WHERE ocp.collection_id = $1
     LIMIT $2`,
    [collectionId, limit]
  );
  return result.rows;
};
