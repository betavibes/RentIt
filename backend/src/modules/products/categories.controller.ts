import { Request, Response } from 'express';
import { pool } from '../../config/database';

export const getCategories = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM categories ORDER BY name ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, slug, description, imageUrl } = req.body;

        const result = await pool.query(
            'INSERT INTO categories (name, slug, description, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, slug, description, imageUrl]
        );

        res.status(201).json(result.rows[0]);
    } catch (error: any) {
        console.error('Create category error:', error);
        if (error.code === '23505') { // Unique violation
            return res.status(409).json({ message: 'Category with this slug already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, slug, description, imageUrl } = req.body;

        const result = await pool.query(
            'UPDATE categories SET name = $1, slug = $2, description = $3, image_url = $4 WHERE id = $5 RETURNING *',
            [name, slug, description, imageUrl, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json(result.rows[0]);
    } catch (error: any) {
        console.error('Update category error:', error);
        if (error.code === '23505') {
            return res.status(409).json({ message: 'Category with this slug already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({ message: 'Category deleted' });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
