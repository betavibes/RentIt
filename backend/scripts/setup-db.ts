import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { initializeDatabase, testDatabaseConnection } from '../src/db';
import Logger from '../src/utils/logger';

async function setupDatabase() {
  try {
    Logger.info('Testing database connection...');
    const connected = await testDatabaseConnection();

    if (!connected) {
      Logger.error('Could not connect to database. Please check your DATABASE_URL in .env');
      process.exit(1);
    }

    Logger.info('Database connection successful. Starting initialization...');
    await initializeDatabase();
    Logger.info('Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    Logger.error('Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
