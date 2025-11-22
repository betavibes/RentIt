import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function verifyState() {
    try {
        console.log('--- Verifying Database State ---');

        // 1. Check Roles
        const roles = await pool.query("SELECT * FROM roles WHERE name = 'admin'");
        console.log(`Admin Role Found: ${roles.rows.length > 0}`);
        if (roles.rows.length > 0) {
            console.log(`Role ID: ${roles.rows[0].id}`);
        } else {
            console.error('CRITICAL: Admin role does not exist!');
        }

        // 2. Check User
        const users = await pool.query("SELECT * FROM users WHERE email = 'admin@rentit.com'");
        console.log(`Admin User Found: ${users.rows.length > 0}`);

        if (users.rows.length > 0) {
            const user = users.rows[0];
            console.log(`User ID: ${user.id}`);
            console.log(`User Role ID: ${user.role_id}`);
            console.log(`User Active: ${user.is_active}`);

            // Verify password
            const isMatch = await bcryptjs.compare('Admin@123', user.password_hash);
            console.log(`Password 'Admin@123' matches hash: ${isMatch}`);
        } else {
            console.log('Admin user missing. Attempting to create...');

            if (roles.rows.length === 0) {
                console.log('Cannot create user: Admin role missing.');
                return;
            }

            const passwordHash = await bcryptjs.hash('Admin@123', 10);
            const userId = uuidv4();

            await pool.query(
                `INSERT INTO users (id, email, phone, full_name, password_hash, role_id, is_active, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW())`,
                [userId, 'admin@rentit.com', '9999999999', 'RentIt Admin', passwordHash, roles.rows[0].id]
            );
            console.log('Admin user created successfully.');
        }

    } catch (error) {
        console.error('Verification failed:', error);
    } finally {
        await pool.end();
    }
}

verifyState();
