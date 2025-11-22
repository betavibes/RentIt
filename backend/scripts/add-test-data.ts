import { pool } from '../src/config/database';

async function addTestData() {
    try {
        // Create category
        const catResult = await pool.query(
            `INSERT INTO categories (name, slug, description) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
       RETURNING *`,
            ['Evening Gowns', 'evening-gowns', 'Elegant evening gowns for special occasions']
        );
        console.log('✅ Category created:', catResult.rows[0].id);

        // Create product
        const prodResult = await pool.query(
            `INSERT INTO products (name, description, price, deposit, category_id, size, color, condition, is_featured) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
            ['Elegant Red Gown', 'Beautiful red evening gown perfect for special occasions', 500, 1000, catResult.rows[0].id, 'M', 'Red', 'available', true]
        );
        console.log('✅ Product created:', prodResult.rows[0].id);

        // Add product image
        await pool.query(
            `INSERT INTO product_images (product_id, url, is_primary) 
       VALUES ($1, $2, $3)`,
            [prodResult.rows[0].id, 'https://images.pexels.com/photos/1755428/pexels-photo-1755428.jpeg', true]
        );
        console.log('✅ Product image added');

        // Add more products
        const prod2 = await pool.query(
            `INSERT INTO products (name, description, price, deposit, category_id, size, color, condition) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
            ['Blue Cocktail Dress', 'Stunning blue cocktail dress', 400, 800, catResult.rows[0].id, 'S', 'Blue', 'available']
        );
        await pool.query(
            `INSERT INTO product_images (product_id, url, is_primary) 
       VALUES ($1, $2, $3)`,
            [prod2.rows[0].id, 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', true]
        );
        console.log('✅ Product 2 created');

        console.log('\n🎉 All test data added successfully!');
        await pool.end();
    } catch (error) {
        console.error('Error:', error);
        await pool.end();
    }
}

addTestData();
