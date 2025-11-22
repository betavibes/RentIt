INSERT INTO roles (name, description) VALUES
('admin', 'Administrator with full access'),
('staff', 'Staff member for operations'),
('customer', 'Regular customer user');

INSERT INTO permissions (name, module, description) VALUES
('create_user', 'users', 'Create new users'),
('edit_user', 'users', 'Edit user details'),
('delete_user', 'users', 'Delete users'),
('view_users', 'users', 'View all users'),
('create_product', 'products', 'Create new products'),
('edit_product', 'products', 'Edit product details'),
('delete_product', 'products', 'Delete products'),
('view_products', 'products', 'View all products'),
('manage_rentals', 'rentals', 'Manage rental requests'),
('view_rentals', 'rentals', 'View rental information'),
('manage_payments', 'payments', 'Manage payments'),
('view_analytics', 'analytics', 'View analytics'),
('manage_cms', 'cms', 'Manage CMS content'),
('manage_settings', 'settings', 'Manage platform settings');

INSERT INTO role_permissions (role_id, permission_id) 
SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'admin';

INSERT INTO role_permissions (role_id, permission_id) 
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'staff' AND p.module IN ('rentals', 'products', 'payments');

INSERT INTO platform_settings (platform_name, gst_percentage, service_charge_percentage, late_fee_per_day)
VALUES ('RentIt', 18.0, 5.0, 50.00);

INSERT INTO product_categories (name, slug, description, is_active) VALUES
('Wedding Dresses', 'wedding-dresses', 'Elegant wedding gowns', true),
('Party Dresses', 'party-dresses', 'Stylish party and casual wear', true),
('Casual Wear', 'casual-wear', 'Comfortable everyday dresses', true),
('Formal Dresses', 'formal-dresses', 'Professional and formal attire', true),
('Ethnic Wear', 'ethnic-wear', 'Traditional and ethnic clothing', true);

INSERT INTO products (category_id, name, description, price_per_day, security_deposit, size_range, color, material, status, inventory_count) 
SELECT id, 'Elegant White Gown', 'Beautiful white wedding dress', 150.00, 500.00, 'XS-L', 'White', 'Silk', 'available', 3
FROM product_categories WHERE slug = 'wedding-dresses'
UNION ALL
SELECT id, 'Black Party Dress', 'Chic black party dress', 80.00, 300.00, 'XS-M', 'Black', 'Polyester', 'available', 5
FROM product_categories WHERE slug = 'party-dresses'
UNION ALL
SELECT id, 'Red Silk Saree', 'Traditional red silk saree', 100.00, 400.00, 'One Size', 'Red', 'Silk', 'available', 4
FROM product_categories WHERE slug = 'ethnic-wear'
UNION ALL
SELECT id, 'Blue Casual Dress', 'Comfortable blue casual dress', 50.00, 200.00, 'XS-XL', 'Blue', 'Cotton', 'available', 8
FROM product_categories WHERE slug = 'casual-wear';

INSERT INTO faqs (question, answer, category, display_order, is_active) VALUES
('How long can I rent a dress?', 'You can rent dresses for 1-7 days. Extended rentals available upon request.', 'Rental', 1, true),
('What is the security deposit?', 'Security deposit varies by dress and is fully refundable if returned in good condition.', 'Payments', 2, true),
('Can I cancel my rental?', 'Yes, cancellations made 48 hours before pickup are fully refunded.', 'Rental', 3, true),
('How is delivery handled?', 'We offer free delivery within the city. Pickup and drop-off times are flexible.', 'Delivery', 4, true),
('What if the dress is damaged?', 'Minor wear is acceptable. Damage charges apply only for significant damage.', 'Returns', 5, true);

INSERT INTO cms_sections (section_name, section_title, section_content, is_active) VALUES
('hero_banner', 'Welcome to RentIt', '{"subtitle": "Rent beautiful dresses for every occasion", "cta_text": "Explore Now"}', true),
('featured_categories', 'Featured Categories', '{"show_count": 5, "display_type": "grid"}', true),
('testimonials', 'Customer Reviews', '{"show_count": 3, "display_type": "carousel"}', true);

INSERT INTO cms_banners (title, description, display_order, is_active) VALUES
('Summer Collection', 'Get 20% off on summer dresses', 1, true),
('Student Special', 'Flat 30% discount for college students', 2, true),
('Wedding Season', 'Premium wedding dresses starting from Rs. 150', 3, true);

INSERT INTO cms_pages (slug, title, content, meta_description, is_published) VALUES
('about', 'About RentIt', 'We are Indias leading dress rental platform...', 'About RentIt platform', true),
('terms', 'Terms and Conditions', 'Please read our terms carefully...', 'Terms & Conditions', true),
('privacy', 'Privacy Policy', 'Your privacy is important to us...', 'Privacy Policy', true),
('rental-policy', 'Rental Policy', 'Complete rental policy guidelines...', 'Rental Policy', true);
