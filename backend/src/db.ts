import pool from './config/database';
import fs from 'fs';
import path from 'path';
import logger from './utils/logger';

export async function initializeDatabase(): Promise<void> {
  try {
    logger.info('Starting database initialization...');

    const schemaPath = path.join(__dirname, '../migrations/001_initial_schema.sql');
    const seedPath = path.join(__dirname, '../migrations/002_seed_data.sql');

    if (!fs.existsSync(schemaPath)) {
      logger.error('Schema migration file not found:', schemaPath);
      return;
    }

    const schemaSQL = fs.readFileSync(schemaPath, 'utf-8');
    logger.info('Executing schema migration...');
    await pool.query(schemaSQL);
    logger.info('Schema migration completed successfully');

    if (fs.existsSync(seedPath)) {
      const seedSQL = fs.readFileSync(seedPath, 'utf-8');
      logger.info('Executing seed data...');
      await pool.query(seedSQL);
      logger.info('Seed data inserted successfully');
    }

    logger.info('Database initialization completed successfully');
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  }
}

export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const result = await pool.query('SELECT NOW()');
    logger.info('Database connection test successful:', result.rows[0]);
    return true;
  } catch (error) {
    logger.error('Database connection test failed:', error);
    return false;
  }
}

export default pool;
