import { Request, Response } from 'express';
import { pool } from '../../config/database';

// Get all settings
export const getAllSettings = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(
            'SELECT * FROM settings ORDER BY category, key'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Get all settings error:', error);
        res.status(500).json({ message: 'Failed to get settings' });
    }
};

// Get settings by category
export const getSettingsByCategory = async (req: Request, res: Response) => {
    try {
        const { category } = req.params;

        const result = await pool.query(
            'SELECT * FROM settings WHERE category = $1 ORDER BY key',
            [category]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Get settings by category error:', error);
        res.status(500).json({ message: 'Failed to get settings' });
    }
};

// Update a single setting
export const updateSetting = async (req: Request, res: Response) => {
    try {
        const { key } = req.params;
        const { value } = req.body;

        if (value === undefined) {
            return res.status(400).json({ message: 'Value is required' });
        }

        const result = await pool.query(
            'UPDATE settings SET value = $1 WHERE key = $2 RETURNING *',
            [value, key]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Setting not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update setting error:', error);
        res.status(500).json({ message: 'Failed to update setting' });
    }
};

// Bulk update settings
export const updateMultipleSettings = async (req: Request, res: Response) => {
    try {
        const { settings } = req.body;

        if (!Array.isArray(settings) || settings.length === 0) {
            return res.status(400).json({ message: 'Settings array is required' });
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            for (const setting of settings) {
                if (!setting.key || setting.value === undefined) {
                    throw new Error('Each setting must have key and value');
                }

                await client.query(
                    'UPDATE settings SET value = $1 WHERE key = $2',
                    [setting.value, setting.key]
                );
            }

            await client.query('COMMIT');

            // Fetch updated settings
            const result = await client.query('SELECT * FROM settings ORDER BY category, key');
            res.json(result.rows);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Bulk update settings error:', error);
        res.status(500).json({ message: 'Failed to update settings' });
    }
};
