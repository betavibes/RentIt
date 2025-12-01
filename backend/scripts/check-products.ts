import { pool } from '../src/config/database';

async function checkProducts() {
    try {
        console.log('Checking products...');
        const res = await pool.query('SELECT id, name, status, created_at FROM products ORDER BY created_at DESC');
        console.log(`Found ${res.rows.length} products:`);
        res.rows.forEach(p => {
            console.log(`- ${p.name} (ID: ${p.id}, Status: ${p.status}, Created: ${p.created_at})`);
        });
    } catch (err) {
        console.error('Error checking products:', err);
    } finally {
        await pool.end();
    }
}

checkProducts();
