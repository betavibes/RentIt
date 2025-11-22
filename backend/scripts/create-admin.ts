import { pool } from '../src/config/database';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

async function createAdminUser() {
    try {
        // Check if admin exists
        const checkAdmin = await pool.query(
            "SELECT id, email, role FROM users WHERE email = 'admin@rentit.com'"
        );

        if (checkAdmin.rows.length > 0) {
            console.log('✅ Admin user already exists:');
            console.log('   Email: admin@rentit.com');
            console.log('   Role:', checkAdmin.rows[0].role);
            console.log('   Password: admin123');
            return;
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const result = await pool.query(
            `INSERT INTO users (id, email, password_hash, name, role) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, email, name, role`,
            [uuidv4(), 'admin@rentit.com', hashedPassword, 'Admin User', 'admin']
        );

        console.log('✅ Admin user created successfully!');
        console.log('   Email: admin@rentit.com');
        console.log('   Password: admin123');
        console.log('   Role:', result.rows[0].role);
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await pool.end();
    }
}

createAdminUser();
