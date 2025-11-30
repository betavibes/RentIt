import { Request, Response } from 'express';
import { pool } from '../../config/database';

export const getOccasions = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM occasions ORDER BY name ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Get occasions error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createOccasion = async (req: Request, res: Response) => {
    try {
        const { name, slug, description } = req.body;

        const result = await pool.query(
            'INSERT INTO occasions (name, slug, description) VALUES ($1, $2, $3) RETURNING *',
            [name, slug, description]
        );

        res.status(201).json(result.rows[0]);
    } catch (error: any) {
        console.error('Create occasion error:', error);
        if (error.code === '23505') { // Unique violation
            return res.status(409).json({ message: 'Occasion with this slug already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateOccasion = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, slug, description } = req.body;

        const result = await pool.query(
            'UPDATE occasions SET name = $1, slug = $2, description = $3 WHERE id = $4 RETURNING *',
            [name, slug, description, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Occasion not found' });
        }

        res.json(result.rows[0]);
    } catch (error: any) {
        console.error('Update occasion error:', error);
        if (error.code === '23505') {
            return res.status(409).json({ message: 'Occasion with this slug already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteOccasion = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM occasions WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Occasion not found' });
        }

        res.json({ message: 'Occasion deleted' });
    } catch (error) {
        console.error('Delete occasion error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
