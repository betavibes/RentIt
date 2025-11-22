import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../../config/database';
import { v4 as uuidv4 } from 'uuid';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name, phone } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Email, password, and name are required' });
        }

        // Check if user exists
        const userCheck = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = await pool.query(
            'INSERT INTO users (id, email, password_hash, name, phone_number) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, role, phone_number, gender, size, college',
            [uuidv4(), email, hashedPassword, name, phone]
        );

        const user = newUser.rows[0];

        // Generate token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'default_secret',
            { expiresIn: '1d' }
        );

        res.status(201).json({
            token,
            user
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Check user
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'default_secret',
            { expiresIn: '1d' }
        );

        // Remove password from response
        delete user.password_hash;

        res.json({
            token,
            user
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMe = async (req: any, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            console.error('GetMe error: req.user is undefined or missing id', req.user);
            return res.status(401).json({ message: 'Authentication required' });
        }

        const userId = req.user.id;
        const result = await pool.query('SELECT id, email, name, role, phone_number, gender, size, college, created_at FROM users WHERE id = $1', [userId]);
        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('GetMe error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateProfile = async (req: any, res: Response) => {
    try {
        const userId = req.user.id;
        const { name, phone, gender, size, college } = req.body;

        const result = await pool.query(
            'UPDATE users SET name = COALESCE($1, name), phone_number = COALESCE($2, phone_number), gender = COALESCE($3, gender), size = COALESCE($4, size), college = COALESCE($5, college) WHERE id = $6 RETURNING id, email, name, role, phone_number, gender, size, college, created_at',
            [name, phone, gender, size, college, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
