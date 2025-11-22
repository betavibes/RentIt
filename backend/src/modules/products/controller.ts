import { Request, Response } from 'express';
import { pool } from '../../config/database';

// Get list of products with optional filters
export const getProducts = async (req: Request, res: Response) => {
    try {
        const { category, minPrice, maxPrice, size, color, search, sort } = req.query;
        let query = `
      SELECT p.*, c.name as category_name,
      COALESCE(
        (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1),
        p.image_url
      ) as "imageUrl"
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
        const params: any[] = [];
        let paramIndex = 1;
        if (search && typeof search === 'string') {
            query += ` AND (LOWER(p.name) LIKE LOWER($${paramIndex}) OR LOWER(p.description) LIKE LOWER($${paramIndex}))`;
            params.push(`%${search}%`);
            paramIndex++;
        }
        if (category) {
            query += ` AND c.slug = $${paramIndex}`;
            params.push(category);
            paramIndex++;
        }
        if (minPrice) {
            query += ` AND p.price >= $${paramIndex}`;
            params.push(minPrice);
            paramIndex++;
        }
        if (maxPrice) {
            query += ` AND p.price <= $${paramIndex}`;
            params.push(maxPrice);
            paramIndex++;
        }
        if (size) {
            query += ` AND p.size = $${paramIndex}`;
            params.push(size);
            paramIndex++;
        }
        if (color) {
            query += ` AND LOWER(p.color) = LOWER($${paramIndex})`;
            params.push(color);
            paramIndex++;
        }
        switch (sort) {
            case 'price_asc':
                query += ' ORDER BY p.price ASC';
                break;
            case 'price_desc':
                query += ' ORDER BY p.price DESC';
                break;
            case 'newest':
                query += ' ORDER BY p.created_at DESC';
                break;
            case 'popular':
                query += ' ORDER BY p.created_at DESC';
                break;
            default:
                query += ' ORDER BY p.created_at DESC';
        }
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a single product by ID
export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const productResult = await pool.query(
            `SELECT p.*, c.name as category_name,
             COALESCE(
                (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1),
                p.image_url
             ) as "imageUrl"
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.id
             WHERE p.id = $1`,
            [id]
        );
        if (productResult.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const imagesResult = await pool.query(
            'SELECT * FROM product_images WHERE product_id = $1 ORDER BY is_primary DESC, created_at ASC',
            [id]
        );
        res.json({ ...productResult.rows[0], images: imagesResult.rows });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, price, deposit, categoryId, size, color, images } = req.body;
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const productResult = await client.query(
                'INSERT INTO products (name, description, price, deposit, category_id, size, color) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [name, description, price, deposit, categoryId, size, color]
            );
            const product = productResult.rows[0];
            if (images && images.length > 0) {
                for (let i = 0; i < images.length; i++) {
                    await client.query(
                        'INSERT INTO product_images (product_id, url, is_primary) VALUES ($1, $2, $3)',
                        [product.id, images[i], i === 0]
                    );
                }
            }
            await client.query('COMMIT');
            res.status(201).json(product);
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update product status (condition)
export const updateProductStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { condition } = req.body;
        const result = await pool.query(
            'UPDATE products SET condition = $1 WHERE id = $2 RETURNING *',
            [condition, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update product status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Full product update (including images)
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, price, deposit, categoryId, size, color, images } = req.body;
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const updateResult = await client.query(
                'UPDATE products SET name = $1, description = $2, price = $3, deposit = $4, category_id = $5, size = $6, color = $7 WHERE id = $8 RETURNING *',
                [name, description, price, deposit, categoryId, size, color, id]
            );
            if (updateResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ message: 'Product not found' });
            }
            if (images && images.length > 0) {
                await client.query('DELETE FROM product_images WHERE product_id = $1', [id]);
                for (let i = 0; i < images.length; i++) {
                    await client.query(
                        'INSERT INTO product_images (product_id, url, is_primary) VALUES ($1, $2, $3)',
                        [id, images[i], i === 0]
                    );
                }
            }
            await client.query('COMMIT');
            res.json(updateResult.rows[0]);
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
