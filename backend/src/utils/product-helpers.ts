import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/database';

// ... existing code ...

export const createProductInDb = async (productData: any) => {
  const id = uuidv4();
  const {
    name, description, category_id, price_per_day, security_deposit,
    size_range, color, material, brand, inventory_count, status
  } = productData;

  // Map size_range to size column if needed, or use size if provided
  const size = size_range || productData.size;

  const result = await pool.query(
    `INSERT INTO products (
      id, name, description, category_id, price_per_day, security_deposit,
      size, color, material, brand, inventory_count, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *`,
    [
      id, name, description, category_id, price_per_day, security_deposit,
      size, color, material, brand, inventory_count, status || 'available'
    ]
  );
  return result.rows[0];
};

export const updateProductInDb = async (id: string, productData: any) => {
  const {
    name, description, category_id, price_per_day, security_deposit,
    size_range, color, material, brand, inventory_count, status
  } = productData;

  const size = size_range || productData.size;

  const result = await pool.query(
    `UPDATE products SET
      name = COALESCE($2, name),
      description = COALESCE($3, description),
      category_id = COALESCE($4, category_id),
      price_per_day = COALESCE($5, price_per_day),
      security_deposit = COALESCE($6, security_deposit),
      size = COALESCE($7, size),
      color = COALESCE($8, color),
      material = COALESCE($9, material),
      brand = COALESCE($10, brand),
      inventory_count = COALESCE($11, inventory_count),
      status = COALESCE($12, status),
      updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [
      id, name, description, category_id, price_per_day, security_deposit,
      size, color, material, brand, inventory_count, status
    ]
  );
  return result.rows[0];
};

export const deleteProductFromDb = async (id: string) => {
  // Soft delete
  const result = await pool.query(
    `UPDATE products SET status = 'deleted', updated_at = NOW() WHERE id = $1 RETURNING id`,
    [id]
  );
  return result.rows[0];
};


export const getProductCategories = async () => {
  const result = await pool.query(
    `SELECT id, name, description, slug, is_active FROM product_categories WHERE is_active = true ORDER BY name`
  );
  return result.rows;
};

export const getProducts = async (filters: {
  category_id?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  color?: string;
  size?: string;
  status?: string;
  limit?: number;
  offset?: number;
}) => {
  const { category_id, search, min_price, max_price, color, size, status, limit = 20, offset = 0 } = filters;

  let query = `
    SELECT DISTINCT
      p.id,
      p.category_id,
      c.name as category_name,
      p.name,
      p.description,
      p.price_per_day,
      p.security_deposit,
      p.color,
      p.size,
      p.status,
      COUNT(DISTINCT pi.id) as image_count,
      p.created_at
    FROM products p
    LEFT JOIN product_categories c ON p.category_id = c.id
    LEFT JOIN product_images pi ON p.id = pi.product_id
    WHERE p.status != 'deleted'
  `;

  const queryParams: any[] = [];
  let paramCount = 1;

  if (category_id) {
    query += ` AND p.category_id = $${paramCount}`;
    queryParams.push(category_id);
    paramCount++;
  }

  if (search) {
    query += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
    queryParams.push(`%${search}%`);
    paramCount++;
  }

  if (min_price !== undefined) {
    query += ` AND p.price_per_day >= $${paramCount}`;
    queryParams.push(min_price);
    paramCount++;
  }

  if (max_price !== undefined) {
    query += ` AND p.price_per_day <= $${paramCount}`;
    queryParams.push(max_price);
    paramCount++;
  }

  if (color) {
    query += ` AND p.color ILIKE $${paramCount}`;
    queryParams.push(`%${color}%`);
    paramCount++;
  }

  if (size) {
    query += ` AND p.size = $${paramCount}`;
    queryParams.push(size);
    paramCount++;
  }

  if (status && status !== 'all') {
    query += ` AND p.status = $${paramCount}`;
    queryParams.push(status);
    paramCount++;
  }

  query += ` GROUP BY p.id, p.category_id, c.name ORDER BY p.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
  queryParams.push(limit, offset);

  const result = await pool.query(query, queryParams);
  return result.rows;
};

export const getProductById = async (id: string) => {
  const result = await pool.query(
    `SELECT p.*, c.name as category_name
     FROM products p
     LEFT JOIN product_categories c ON p.category_id = c.id
     WHERE p.id = $1`,
    [id]
  );
  return result.rows[0];
};

export const getProductImages = async (productId: string) => {
  const result = await pool.query(
    `SELECT id, product_id, image_url, alt_text, is_primary, order_index
     FROM product_images WHERE product_id = $1 ORDER BY order_index`,
    [productId]
  );
  return result.rows;
};

export const getProductAvailability = async (
  productId: string,
  startDate: string,
  endDate: string
) => {
  const result = await pool.query(
    `SELECT 
      CASE WHEN COUNT(*) > 0 THEN false ELSE true END as available
     FROM rentals
     WHERE product_id = $1
     AND status IN ('active', 'pending', 'confirmed')
     AND (
       (rental_start_date <= $2 AND rental_end_date >= $3)
       OR (rental_start_date >= $2 AND rental_start_date <= $3)
       OR (rental_end_date >= $2 AND rental_end_date <= $3)
     )`,
    [productId, endDate, startDate]
  );
  return result.rows[0]?.available ?? true;
};

export const checkProductsAvailability = async (
  productId: string,
  startDate: Date,
  endDate: Date
) => {
  const result = await pool.query(
    `SELECT COUNT(*) as count FROM rentals
     WHERE product_id = $1
     AND status IN ('active', 'pending', 'confirmed')
     AND (
       (rental_start_date <= $3 AND rental_end_date >= $2)
       OR (rental_start_date >= $2 AND rental_start_date < $3)
     )`,
    [productId, startDate, endDate]
  );
  return result.rows[0].count === 0;
};

export const getAvailableProductsByCategory = async (
  categoryId: string,
  startDate: Date,
  endDate: Date,
  limit: number = 20
) => {
  const result = await pool.query(
    `SELECT p.id, p.name, p.price_per_day, p.security_deposit, p.color, p.size,
            (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as primary_image
     FROM products p
     WHERE p.category_id = $1
     AND p.status = 'available'
     AND p.id NOT IN (
       SELECT product_id FROM rentals
       WHERE status IN ('active', 'pending', 'confirmed')
       AND (
         (rental_start_date <= $3 AND rental_end_date >= $2)
         OR (rental_start_date >= $2 AND rental_start_date < $3)
       )
     )
     LIMIT $4`,
    [categoryId, startDate, endDate, limit]
  );
  return result.rows;
};
