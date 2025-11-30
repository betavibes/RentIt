import { pool } from '../src/config/database';

async function checkOrders() {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT id, created_at, display_id FROM orders ORDER BY created_at DESC LIMIT 5');
        console.log('Recent Orders:', result.rows);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

checkOrders();
