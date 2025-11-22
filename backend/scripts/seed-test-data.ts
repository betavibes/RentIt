import { pool } from '../src/config/database';
import * as bcrypt from 'bcryptjs';

async function seedTestData() {
    try {
        console.log('🌱 Starting to seed test data...\n');

        // 1. Create Categories
        console.log('📁 Creating categories...');
        const categories = [
            { name: 'Evening Gowns', slug: 'evening-gowns', description: 'Elegant evening and formal gowns' },
            { name: 'Cocktail Dresses', slug: 'cocktail-dresses', description: 'Stylish cocktail and party dresses' },
            { name: 'Wedding Dresses', slug: 'wedding-dresses', description: 'Beautiful wedding and bridal gowns' },
            { name: 'Traditional Wear', slug: 'traditional-wear', description: 'Traditional and ethnic wear' }
        ];

        for (const cat of categories) {
            await pool.query(
                `INSERT INTO categories (name, slug, description) 
                 VALUES ($1, $2, $3) 
                 ON CONFLICT (slug) DO NOTHING`,
                [cat.name, cat.slug, cat.description]
            );
        }
        console.log('✅ Categories created\n');

        // Get category IDs
        const catResult = await pool.query('SELECT id, slug FROM categories');
        const categoryMap: Record<string, string> = {};
        catResult.rows.forEach(row => {
            categoryMap[row.slug] = row.id;
        });

        // 2. Create Products
        console.log('👗 Creating products...');
        const products = [
            {
                name: 'Royal Blue Evening Gown',
                description: 'Stunning royal blue evening gown with intricate beadwork',
                price: 2500,
                size: 'M',
                color: 'Blue',
                category: 'evening-gowns',
                stock: 3
            },
            {
                name: 'Red Carpet Dress',
                description: 'Glamorous red carpet dress perfect for special occasions',
                price: 3000,
                size: 'S',
                color: 'Red',
                category: 'evening-gowns',
                stock: 2
            },
            {
                name: 'Black Cocktail Dress',
                description: 'Classic black cocktail dress with modern silhouette',
                price: 1800,
                size: 'M',
                color: 'Black',
                category: 'cocktail-dresses',
                stock: 5
            },
            {
                name: 'Pink Party Dress',
                description: 'Flirty pink party dress with ruffles',
                price: 1500,
                size: 'S',
                color: 'Pink',
                category: 'cocktail-dresses',
                stock: 4
            },
            {
                name: 'White Bridal Gown',
                description: 'Elegant white bridal gown with lace details',
                price: 5000,
                size: 'M',
                color: 'White',
                category: 'wedding-dresses',
                stock: 2
            },
            {
                name: 'Golden Lehenga',
                description: 'Traditional golden lehenga with heavy embroidery',
                price: 4000,
                size: 'L',
                color: 'Gold',
                category: 'traditional-wear',
                stock: 3
            },
            {
                name: 'Green Saree',
                description: 'Beautiful green silk saree with golden border',
                price: 2000,
                size: 'Free Size',
                color: 'Green',
                category: 'traditional-wear',
                stock: 4
            },
            {
                name: 'Purple Evening Dress',
                description: 'Sophisticated purple evening dress',
                price: 2200,
                size: 'L',
                color: 'Purple',
                category: 'evening-gowns',
                stock: 3
            }
        ];

        const productIds: string[] = [];
        for (const prod of products) {
            const result = await pool.query(
                `INSERT INTO products (name, description, price, deposit, size, color, category_id, condition)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, 'available')
                 RETURNING id`,
                [prod.name, prod.description, prod.price, prod.price * 0.5, prod.size, prod.color, categoryMap[prod.category]]
            );
            productIds.push(result.rows[0].id);
        }
        console.log(`✅ Created ${products.length} products\n`);

        // 3. Create Test Customers
        console.log('👥 Creating test customers...');
        const hashedPassword = await bcrypt.hash('password123', 10);

        const customers = [
            { name: 'Priya Sharma', email: 'priya@example.com', phone: '9876543210' },
            { name: 'Anjali Patel', email: 'anjali@example.com', phone: '9876543211' },
            { name: 'Neha Gupta', email: 'neha@example.com', phone: '9876543212' }
        ];

        const customerIds: string[] = [];
        for (const cust of customers) {
            const result = await pool.query(
                `INSERT INTO users (name, email, password_hash, phone_number, role)
                 VALUES ($1, $2, $3, $4, 'customer')
                 ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
                 RETURNING id`,
                [cust.name, cust.email, hashedPassword, cust.phone]
            );
            customerIds.push(result.rows[0].id);
        }
        console.log(`✅ Created ${customers.length} test customers\n`);

        // 4. Create Test Orders
        console.log('📦 Creating test orders...');
        const orders = [
            {
                userId: customerIds[0],
                productId: productIds[0],
                status: 'completed',
                startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
                endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
                amount: 2500
            },
            {
                userId: customerIds[1],
                productId: productIds[2],
                status: 'confirmed',
                startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
                endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
                amount: 1800
            },
            {
                userId: customerIds[2],
                productId: productIds[4],
                status: 'pending',
                startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
                amount: 5000
            },
            {
                userId: customerIds[0],
                productId: productIds[3],
                status: 'completed',
                startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
                endDate: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000), // 17 days ago
                amount: 1500
            }
        ];

        for (const order of orders) {
            const depositAmount = order.amount * 0.5;

            // Create order
            const orderResult = await pool.query(
                `INSERT INTO orders (user_id, rental_start_date, rental_end_date, total_amount, deposit_amount, status)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING id`,
                [order.userId, order.startDate, order.endDate, order.amount, depositAmount, order.status]
            );
            const orderId = orderResult.rows[0].id;

            // Create order item
            await pool.query(
                `INSERT INTO order_items (order_id, product_id, quantity, daily_rate, deposit, subtotal)
                 VALUES ($1, $2, 1, $3, $4, $5)`,
                [orderId, order.productId, order.amount, depositAmount, order.amount]
            );

            // Create payment for completed orders
            if (order.status === 'completed') {
                await pool.query(
                    `INSERT INTO payments (order_id, amount, status, payment_method, transaction_id)
                     VALUES ($1, $2, 'completed', 'card', $3)`,
                    [orderId, order.amount, `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`]
                );
            }
        }
        console.log(`✅ Created ${orders.length} test orders\n`);

        console.log('🎉 Test data seeding completed successfully!\n');
        console.log('📊 Summary:');
        console.log(`   - ${categories.length} categories`);
        console.log(`   - ${products.length} products`);
        console.log(`   - ${customers.length} customers`);
        console.log(`   - ${orders.length} orders`);
        console.log('\n✅ You can now test the platform with realistic data!');

    } catch (error) {
        console.error('❌ Error seeding test data:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

seedTestData();
