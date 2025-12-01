import { Request, Response } from 'express';
import { pool } from '../../config/database';

// Get list of products with optional filters
export const getProducts = async (req: Request, res: Response) => {
    try {
        const { category, minPrice, maxPrice, size, color, search, sort, status, occasion, ageGroup } = req.query;
        let query = `
      SELECT p.*, c.name as "categoryName", o.name as "occasionName", ag.name as "ageGroupName",
      COALESCE(
        (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1),
        p.image_url
      ) as "imageUrl"
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN occasions o ON p.occasion_id = o.id
      LEFT JOIN age_groups ag ON p.age_group_id = ag.id
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
        if (status) {
            query += ` AND p.status = $${paramIndex}`;
            params.push(status);
            paramIndex++;
        }
        if (occasion) {
            query += ` AND o.slug = $${paramIndex}`;
            params.push(occasion);
            paramIndex++;
        }
        if (ageGroup) {
            query += ` AND ag.slug = $${paramIndex}`;
            params.push(ageGroup);
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
        console.log('Executing product query:', query);
        console.log('Query params:', params);
        const result = await pool.query(query, params);
        // Prepend backend base URL to imageUrl if it's a relative path
        const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
        const rows = result.rows.map(row => {
            const product = {
                ...row,
                categoryId: row.category_id,
                occasionId: row.occasion_id,
                ageGroupId: row.age_group_id,
                isFeatured: row.is_featured,
                createdAt: row.created_at,
                updatedAt: row.updated_at
            };
            if (product.imageUrl && !product.imageUrl.startsWith('http')) {
                product.imageUrl = `${baseUrl}${product.imageUrl}`;
            }
            return product;
        });
        res.json(rows);
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
            `SELECT p.*, c.name as "categoryName", o.name as "occasionName", ag.name as "ageGroupName",
             COALESCE(
                (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1),
                p.image_url
             ) as "imageUrl"
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.id
             LEFT JOIN occasions o ON p.occasion_id = o.id
             LEFT JOIN age_groups ag ON p.age_group_id = ag.id
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
        const product = {
            ...productResult.rows[0],
            categoryId: productResult.rows[0].category_id,
            occasionId: productResult.rows[0].occasion_id,
            ageGroupId: productResult.rows[0].age_group_id,
            isFeatured: productResult.rows[0].is_featured,
            createdAt: productResult.rows[0].created_at,
            updatedAt: productResult.rows[0].updated_at,
            images: imagesResult.rows
        };
        res.json(product);
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, price, deposit, categoryId, size, color, images, occasionId, ageGroupId } = req.body;
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const productResult = await client.query(
                'INSERT INTO products (name, description, price, deposit, category_id, size, color, status, occasion_id, age_group_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
                [name, description, price, deposit, categoryId, size, color, req.body.status || 'active', occasionId, ageGroupId]
            );
            const product = productResult.rows[0];
            if (images && images.length > 0) {
                for (let i = 0; i < images.length; i++) {
                    const imageData = typeof images[i] === 'string' ? { url: images[i], orderNumber: i + 1 } : images[i];
                    await client.query(
                        'INSERT INTO product_images (product_id, url, is_primary, order_number) VALUES ($1, $2, $3, $4)',
                        [product.id, imageData.url, i === 0, imageData.orderNumber || (i + 1)]
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
        const { name, description, price, deposit, categoryId, size, color, images, occasionId, ageGroupId } = req.body;
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const updateResult = await client.query(
                'UPDATE products SET name = $1, description = $2, price = $3, deposit = $4, category_id = $5, size = $6, color = $7, status = $8, occasion_id = $9, age_group_id = $10 WHERE id = $11 RETURNING *',
                [name, description, price, deposit, categoryId, size, color, req.body.status || 'active', occasionId, ageGroupId, id]
            );
            if (updateResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ message: 'Product not found' });
            }
            if (images && images.length > 0) {
                await client.query('DELETE FROM product_images WHERE product_id = $1', [id]);
                for (let i = 0; i < images.length; i++) {
                    const imageData = typeof images[i] === 'string' ? { url: images[i], orderNumber: i + 1 } : images[i];
                    await client.query(
                        'INSERT INTO product_images (product_id, url, is_primary, order_number) VALUES ($1, $2, $3, $4)',
                        [id, imageData.url, i === 0, imageData.orderNumber || (i + 1)]
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
