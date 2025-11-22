import { pool } from '../src/config/database';

async function fixSchema() {
    try {
        console.log('🔧 Fixing schema...');
        await pool.query(`
            ALTER TABLE categories 
            ADD COLUMN IF NOT EXISTS image_url TEXT;
        `);
        console.log('✅ Added image_url column to categories table.');

        // Also check products table for image_url just in case
        await pool.query(`
            ALTER TABLE products 
            ADD COLUMN IF NOT EXISTS image_url TEXT;
        `);
        console.log('✅ Added image_url column to products table (if missing).');

    } catch (error) {
        console.error('❌ Fix failed:', error);
    } finally {
        await pool.end();
    }
}

fixSchema();
