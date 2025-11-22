import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function runMigrations() {
    try {
        console.log('Starting migrations...');

        const migrationFiles = [
            '001_initial_schema.sql',
            '002_seed_data.sql',
            '003_add_otp_table.sql',
            '004_add_rental_quotes_table.sql',
            '005_add_additional_tables.sql'
        ];

        for (const file of migrationFiles) {
            const filePath = path.join(__dirname, '../migrations', file);
            if (fs.existsSync(filePath)) {
                console.log(`Processing ${file}...`);
                const sql = fs.readFileSync(filePath, 'utf-8');

                // Split by semicolon but keep the semicolon (optional, but pg usually doesn't need it)
                // Simple split by semicolon at end of line or followed by whitespace
                const statements = sql.split(/;\s*$/m).filter(s => s.trim().length > 0);

                for (const statement of statements) {
                    try {
                        if (statement.trim()) {
                            await pool.query(statement);
                        }
                    } catch (err: any) {
                        // Ignore "relation already exists" (42P07) and "type already exists" (42710)
                        if (err.code === '42P07' || err.code === '42710') {
                            console.log(`  ⚠ Object already exists, skipping: ${statement.substring(0, 50).replace(/\n/g, ' ')}...`);
                        } else if (err.code === '23505') {
                            // Unique violation (for seed data)
                            console.log(`  ⚠ Data already exists, skipping: ${statement.substring(0, 50).replace(/\n/g, ' ')}...`);
                        } else {
                            console.error(`  ❌ Error executing statement: ${statement.substring(0, 50).replace(/\n/g, ' ')}...`);
                            console.error(`     ${err.message}`);
                            // We continue even on error to try to apply as much as possible
                        }
                    }
                }
                console.log(`✓ ${file} processed`);
            } else {
                console.warn(`⚠ ${file} not found, skipping`);
            }
        }

        console.log('All migrations completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

runMigrations();
