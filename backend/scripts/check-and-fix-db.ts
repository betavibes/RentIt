import { pool } from '../src/config/database';
import fs from 'fs';
import path from 'path';

async function checkAndFixDatabase() {
    const client = await pool.connect();

    try {
        console.log('🔍 Checking database schema...\n');

        // Check if occasions table exists
        const occasionsCheck = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'occasions'
            );
        `);

        // Check if age_groups table exists
        const ageGroupsCheck = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'age_groups'
            );
        `);

        // Check if products table has the new columns
        const columnsCheck = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'products' 
            AND column_name IN ('occasion_id', 'age_group_id');
        `);

        const occasionsExists = occasionsCheck.rows[0].exists;
        const ageGroupsExists = ageGroupsCheck.rows[0].exists;
        const hasOccasionColumn = columnsCheck.rows.some(r => r.column_name === 'occasion_id');
        const hasAgeGroupColumn = columnsCheck.rows.some(r => r.column_name === 'age_group_id');

        console.log(`✓ Occasions table exists: ${occasionsExists}`);
        console.log(`✓ Age Groups table exists: ${ageGroupsExists}`);
        console.log(`✓ Products.occasion_id column exists: ${hasOccasionColumn}`);
        console.log(`✓ Products.age_group_id column exists: ${hasAgeGroupColumn}\n`);

        // If migration is needed, run it
        if (!occasionsExists || !ageGroupsExists || !hasOccasionColumn || !hasAgeGroupColumn) {
            console.log('⚠️  Missing schema elements detected. Running migration 011...\n');

            const migrationPath = path.join(__dirname, '../migrations/011_add_occasions_age_groups.sql');
            const sql = fs.readFileSync(migrationPath, 'utf8');

            await client.query(sql);
            console.log('✅ Migration 011 completed successfully!\n');
        } else {
            console.log('✅ All schema elements are present!\n');
        }

        // Check if we have any products
        const productsCount = await client.query('SELECT COUNT(*) FROM products');
        console.log(`📦 Total products in database: ${productsCount.rows[0].count}\n`);

        // Add some sample occasions and age groups if they don't exist
        const occasionsCount = await client.query('SELECT COUNT(*) FROM occasions');
        if (occasionsCount.rows[0].count === '0') {
            console.log('Adding sample occasions...');
            await client.query(`
                INSERT INTO occasions (name, slug, description) VALUES
                ('Wedding', 'wedding', 'Perfect for wedding ceremonies and receptions'),
                ('Birthday Party', 'birthday-party', 'Fun costumes for birthday celebrations'),
                ('Festival', 'festival', 'Traditional and festive attire'),
                ('School Event', 'school-event', 'Costumes for school plays and events'),
                ('Corporate Event', 'corporate-event', 'Professional attire for corporate functions')
                ON CONFLICT (slug) DO NOTHING;
            `);
            console.log('✅ Sample occasions added!\n');
        }

        const ageGroupsCount = await client.query('SELECT COUNT(*) FROM age_groups');
        if (ageGroupsCount.rows[0].count === '0') {
            console.log('Adding sample age groups...');
            await client.query(`
                INSERT INTO age_groups (name, slug, description) VALUES
                ('Kids (3-8 years)', 'kids-3-8', 'Costumes for young children'),
                ('Teens (9-15 years)', 'teens-9-15', 'Costumes for teenagers'),
                ('Adults (16+ years)', 'adults', 'Costumes for adults'),
                ('All Ages', 'all-ages', 'Suitable for all age groups')
                ON CONFLICT (slug) DO NOTHING;
            `);
            console.log('✅ Sample age groups added!\n');
        }

        console.log('🎉 Database check and fix completed successfully!');

    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

checkAndFixDatabase();
