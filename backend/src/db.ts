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
      try {
        const seedSQL = fs.readFileSync(seedPath, 'utf-8');
        logger.info('Executing seed data...');
        await pool.query(seedSQL);
        logger.info('Seed data inserted successfully');
      } catch (err) {
        logger.error('Seed data execution failed:', err);
      }
    }

    const googleAuthMigrationPath = path.join(__dirname, '../migrations/003_add_google_id.sql');
    if (fs.existsSync(googleAuthMigrationPath)) {
      try {
        const googleAuthSQL = fs.readFileSync(googleAuthMigrationPath, 'utf-8');
        logger.info('Executing Google Auth migration...');
        await pool.query(googleAuthSQL);
        logger.info('Google Auth migration completed successfully');
      } catch (err) {
        logger.error('Google Auth migration failed:', err);
        // Don't throw, just log, so we can see if other things work
      }
    }

    const imageOrderMigrationPath = path.join(__dirname, '../migrations/006_add_image_order.sql');
    if (fs.existsSync(imageOrderMigrationPath)) {
      try {
        const imageOrderSQL = fs.readFileSync(imageOrderMigrationPath, 'utf-8');
        logger.info('Executing image order migration...');
        await pool.query(imageOrderSQL);
        logger.info('Image order migration completed successfully');
      } catch (err) {
        logger.error('Image order migration failed:', err);
      }
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
