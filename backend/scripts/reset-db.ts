import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function resetDatabase() {
    try {
        console.log('🗑️  Wiping database...');

        // Drop public schema and recreate it
        await pool.query('DROP SCHEMA public CASCADE;');
        await pool.query('CREATE SCHEMA public;');
        await pool.query('GRANT ALL ON SCHEMA public TO postgres;');
        await pool.query('GRANT ALL ON SCHEMA public TO public;');

        console.log('✅ Database wiped successfully.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to reset database:', error);
        process.exit(1);
    }
}

resetDatabase();
