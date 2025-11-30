import { pool } from '../src/config/database';
import fs from 'fs';
import path from 'path';

async function runMigrations() {
    const migrationsDir = path.join(__dirname, '../migrations');
    let client; // Declare client outside try for finally block access

    try {
        const migrationFiles = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort(); // Sort alphabetically to ensure correct order

        if (migrationFiles.length === 0) {
            console.log('No migration files found.');
            return;
        }

        client = await pool.connect(); // Get a client from the pool

        for (const file of migrationFiles) {
            const migrationPath = path.join(migrationsDir, file);
            const sql = fs.readFileSync(migrationPath, 'utf8');

            console.log(`Running migration: ${file}`);
            await client.query(sql); // Use the client to run queries
            console.log(`✅ Migration ${file} completed successfully!`);
        }
        console.log('All migrations completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        if (client) {
            client.release(); // Release the client back to the pool
        }
        await pool.end(); // Close the pool
    }
}

runMigrations();
