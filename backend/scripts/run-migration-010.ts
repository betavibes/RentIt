import { pool } from '../src/config/database';
import fs from 'fs';
import path from 'path';

async function runMigration() {
    try {
        const migrationPath = path.join(__dirname, '../migrations/010_add_product_status.sql');
        const sql = fs.readFileSync(migrationPath, 'utf8');

        console.log('Running migration: 010_add_product_status.sql');
        await pool.query(sql);
        console.log('✅ Migration completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await pool.end();
    }
}

runMigration();
