# RentIt Database Schema

## Overview

RentIt uses PostgreSQL as its primary database. The schema is organized into logical modules to support all platform features.

## Database Setup

### Prerequisites
- PostgreSQL 12+
- Node.js 14+
- Environment variables configured in `.env`

### Initial Setup

1. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env and set DATABASE_URL
   ```

2. **Run Database Setup**
   ```bash
   npm run setup:db
   ```

   This will:
   - Create all tables
   - Create indexes for performance
   - Insert initial seed data

## Schema Overview

### 1. Users & Authentication Module

**Tables:**
- `roles` - User roles (admin, staff, customer)
- `permissions` - Fine-grained permissions
- `role_permissions` - Role-permission mapping
- `users` - User accounts with profile info

**Key Fields:**
- User authentication with bcryptjs hashing
- Role-based access control
- Profile information (gender, size, college)

### 2. Products & Inventory Module

**Tables:**
- `product_categories` - Dress categories
- `products` - Dress inventory
- `product_images` - Multiple images per product
- `product_conditions` - Track dress condition status

**Key Fields:**
- Price per day and security deposit
- Size range, color, material
- Status tracking (available, rented, laundry, damaged)
- Inventory count management

### 3. Rental & Order Management

**Tables:**
- `rentals` - Main rental records
- `rental_items` - Items in each rental

**Key Fields:**
- Rental date range with availability checking
- Pricing breakdown (rental, deposit, late fees, damage)
- Status tracking (pending, approved, active, completed)
- Return condition and damage tracking

### 4. Payment & Refund Module

**Tables:**
- `payments` - Payment transactions
- `security_deposits` - Deposit tracking
- `refunds` - Refund records

**Key Fields:**
- Multiple payment methods
- Payment status and transaction IDs
- Deposit refund status
- Refund reasons and tracking

### 5. Delivery & Returns

**Tables:**
- `pickup_requests` - Pickup scheduling
- `return_requests` - Return scheduling

**Key Fields:**
- Pickup/return dates and time slots
- Delivery partner assignment
- Address and contact information
- Condition reporting on return

### 6. Promotions & Discounts

**Tables:**
- `promo_codes` - Discount codes
- `promo_usage` - Usage tracking

**Key Fields:**
- Percentage or fixed amount discounts
- Usage limits and validity periods
- Minimum purchase requirements
- Category-specific discounts

### 7. CMS & Content Management

**Tables:**
- `cms_banners` - Homepage banners
- `cms_sections` - Page sections
- `cms_pages` - Editable pages
- `faqs` - FAQ management
- `email_templates` - Email content

**Key Fields:**
- Scheduling support for banners
- JSONB for flexible content storage
- Template variables for personalization

### 8. Platform Settings

**Tables:**
- `platform_settings` - Global configurations
- `email_templates` - Email templates

**Configurable:**
- Platform branding (logo, colors)
- Tax settings (GST %)
- Service charges
- Late fee rates
- Contact information

### 9. Audit & Analytics

**Tables:**
- `audit_logs` - Action tracking

**Tracks:**
- User actions
- Entity changes
- IP addresses
- Timestamps for analytics

## Indexes for Performance

Key indexes include:
- `idx_users_email` - Fast user lookups
- `idx_rentals_dates` - Range queries for availability
- `idx_products_status` - Filter available dresses
- `idx_payments_status` - Payment tracking
- `idx_audit_created` - Time-based queries

## Relationships

```
users (1) ──→ (many) rentals
users (1) ──→ (many) payments
users (1) ──→ (many) security_deposits
products (1) ──→ (many) rentals
products (1) ──→ (many) product_images
product_categories (1) ──→ (many) products
roles (1) ──→ (many) role_permissions
permissions (1) ──→ (many) role_permissions
rentals (1) ──→ (many) payments
promo_codes (1) ──→ (many) promo_usage
```

## Data Types

- `UUID` - Primary keys and foreign keys
- `VARCHAR` - Text fields with max length
- `TEXT` - Unlimited text
- `DECIMAL(10,2)` - Money/prices
- `DATE` - Date only
- `TIMESTAMP` - Date with time
- `JSONB` - Flexible JSON storage
- `BOOLEAN` - True/false values
- `INT` - Counters and quantities

## Common Queries

### Get available dresses
```sql
SELECT * FROM products WHERE status = 'available' AND inventory_count > 0;
```

### Check rental conflicts
```sql
SELECT * FROM rentals 
WHERE product_id = $1 
AND status IN ('pending', 'approved', 'active')
AND rental_start_date <= $2 
AND rental_end_date >= $3;
```

### User rental history
```sql
SELECT r.*, p.name FROM rentals r
JOIN products p ON r.product_id = p.id
WHERE r.user_id = $1
ORDER BY r.created_at DESC;
```

### Revenue reports
```sql
SELECT DATE(r.created_at), COUNT(*), SUM(r.total_price)
FROM rentals r
WHERE r.status = 'completed'
GROUP BY DATE(r.created_at)
ORDER BY DATE(r.created_at) DESC;
```

## Maintenance

### Backup Database
```bash
pg_dump $DATABASE_URL > backup.sql
```

### Restore Database
```bash
psql $DATABASE_URL < backup.sql
```

## Troubleshooting

### Connection Issues
- Verify DATABASE_URL in .env
- Check PostgreSQL server is running
- Ensure network connectivity

### Schema Errors
- Run `npm run setup:db` again
- Check migration files exist
- Review PostgreSQL logs
