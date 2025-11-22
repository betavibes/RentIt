import { pool } from '../src/config/database';
import * as bcrypt from 'bcryptjs';

async function seedIndependenceDay() {
    try {
        console.log('🇮🇳 Seeding Independence Day Collection...');

        // 1. Create or Get Category
        let categoryId;
        const categoryResult = await pool.query(
            `SELECT id FROM categories WHERE slug = 'independence-day'`
        );

        if (categoryResult.rows.length > 0) {
            categoryId = categoryResult.rows[0].id;
            console.log('✅ Category "Independence Day" already exists.');
        } else {
            const newCategory = await pool.query(
                `INSERT INTO categories (name, slug, description, image_url)
                 VALUES ($1, $2, $3, $4)
                 RETURNING id`,
                ['Independence Day', 'independence-day', 'Patriotic costumes for school functions and Independence Day celebrations.', 'https://placehold.co/800x400/png?text=Independence+Day']
            );
            categoryId = newCategory.rows[0].id;
            console.log('✅ Created category: Independence Day');
        }

        // 2. Products Data
        const products = [
            {
                name: 'Mahatma Gandhi Costume',
                description: 'Classic Mahatma Gandhi fancy dress for kids. Includes dhoti, shawl, and round glasses. Perfect for school competitions.',
                price: 499,
                deposit: 1000,
                size: 'S',
                color: 'White',
                image_url: '/placeholder.png'
            },
            {
                name: 'Bhagat Singh Costume',
                description: 'Inspiring Bhagat Singh costume for boys. Features a brown hat, shirt, and trousers. Bring out the patriot in your child.',
                price: 599,
                deposit: 1200,
                size: 'M',
                color: 'Brown',
                image_url: '/placeholder.png'
            },
            {
                name: 'Rani Laxmi Bai Costume',
                description: 'Brave Rani of Jhansi costume for girls. Includes traditional saree style drape, turban, and prop sword. Symbol of women power.',
                price: 699,
                deposit: 1500,
                size: 'M',
                color: 'Orange',
                image_url: '/placeholder.png'
            },
            {
                name: 'Subhash Chandra Bose Costume',
                description: 'Netaji Subhash Chandra Bose military uniform for kids. Includes shirt, pants, cap, and belt. Jai Hind!',
                price: 649,
                deposit: 1300,
                size: 'L',
                color: 'Green',
                image_url: '/placeholder.png'
            },
            {
                name: 'Jawaharlal Nehru Costume',
                description: 'Chacha Nehru costume with signature Nehru jacket, cap, and a red rose. Elegant and historical.',
                price: 549,
                deposit: 1100,
                size: 'S',
                color: 'White',
                image_url: '/placeholder.png'
            }
        ];

        // 3. Insert Products
        for (const prod of products) {
            // Check if product exists
            const prodCheck = await pool.query(
                `SELECT id FROM products WHERE name = $1`,
                [prod.name]
            );

            if (prodCheck.rows.length === 0) {
                await pool.query(
                    `INSERT INTO products (name, description, price, deposit, size, color, category_id, condition, image_url)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, 'available', $8)`,
                    [prod.name, prod.description, prod.price, prod.deposit, prod.size, prod.color, categoryId, prod.image_url]
                );
                console.log(`✅ Added product: ${prod.name}`);
            } else {
                console.log(`ℹ️ Product already exists: ${prod.name}`);
            }
        }

        console.log('🎉 Independence Day collection seeded successfully!');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
    } finally {
        await pool.end();
    }
}

seedIndependenceDay();
