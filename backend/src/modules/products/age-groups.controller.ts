import { Request, Response } from 'express';
import { pool } from '../../config/database';

export const getAgeGroups = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM age_groups ORDER BY name ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Get age groups error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createAgeGroup = async (req: Request, res: Response) => {
    try {
        const { name, slug, description } = req.body;

        const result = await pool.query(
            'INSERT INTO age_groups (name, slug, description) VALUES ($1, $2, $3) RETURNING *',
            [name, slug, description]
        );

        res.status(201).json(result.rows[0]);
    } catch (error: any) {
        console.error('Create age group error:', error);
        if (error.code === '23505') { // Unique violation
            return res.status(409).json({ message: 'Age group with this slug already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateAgeGroup = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, slug, description } = req.body;

        const result = await pool.query(
            'UPDATE age_groups SET name = $1, slug = $2, description = $3 WHERE id = $4 RETURNING *',
            [name, slug, description, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Age group not found' });
        }

        res.json(result.rows[0]);
    } catch (error: any) {
        console.error('Update age group error:', error);
        if (error.code === '23505') {
            return res.status(409).json({ message: 'Age group with this slug already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteAgeGroup = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM age_groups WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Age group not found' });
        }

        res.json({ message: 'Age group deleted' });
    } catch (error) {
        console.error('Delete age group error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
