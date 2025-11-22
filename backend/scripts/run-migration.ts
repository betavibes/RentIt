import { pool } from '../src/config/database';
import fs from 'fs';
import path from 'path';

async function runMigration() {
    try {
        const migrationPath = path.join(__dirname, '../migrations/004_create_rentals_schema.sql');
        const sql = fs.readFileSync(migrationPath, 'utf8');

        console.log('Running migration: 004_create_rentals_schema.sql');
        await pool.query(sql);
        console.log('✅ Migration completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await pool.end();
    }
}

runMigration();
