import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { pool } from '../src/config/database';

async function runMigration() {
    try {
        console.log('Running migration: Add COD payment method...');

        const migrationPath = path.join(__dirname, '../migrations/012_add_cod_payment_method.sql');
        const sql = fs.readFileSync(migrationPath, 'utf8');

        await pool.query(sql);

        console.log('Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

runMigration();
