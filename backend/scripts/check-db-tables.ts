import { pool } from '../src/config/database';

async function checkTables() {
    try {
        const res = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('occasions', 'age_groups', 'products');
        `);
        console.log('Tables found:', res.rows.map(r => r.table_name));

        const columns = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'products' 
            AND column_name IN ('occasion_id', 'age_group_id');
        `);
        console.log('Product columns found:', columns.rows.map(r => r.column_name));

    } catch (error) {
        console.error('Error checking tables:', error);
    } finally {
        await pool.end();
    }
}

checkTables();
