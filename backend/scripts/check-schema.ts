import { pool } from '../src/config/database';

async function checkSchema() {
    try {
        const res = await pool.query(
            `SELECT column_name, data_type 
             FROM information_schema.columns 
             WHERE table_name = 'categories'`
        );
        console.log('Categories Table Columns:', res.rows);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
}

checkSchema();
