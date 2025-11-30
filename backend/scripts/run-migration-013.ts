import { pool } from '../src/config/database';
import fs from 'fs';
import path from 'path';

async function runMigration() {
    const client = await pool.connect();
    try {
        console.log('Running migration 013...');

        const migrationPath = path.join(__dirname, '../migrations/013_add_order_display_id.sql');
        const migrationSql = fs.readFileSync(migrationPath, 'utf8');

        await client.query('BEGIN');
        await client.query(migrationSql);
        await client.query('COMMIT');

        console.log('Migration 013 completed successfully');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Migration failed:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

runMigration();
