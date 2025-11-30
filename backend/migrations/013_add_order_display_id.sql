-- Migration: Add display_id to orders table
-- Description: Adds a user-friendly order ID format (MON-YYYY-XXXXX)

-- Add the column (initially nullable to allow backfill)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS display_id VARCHAR(20);

-- Backfill existing orders
WITH numbered_orders AS (
    SELECT id, created_at,
           ROW_NUMBER() OVER (PARTITION BY TO_CHAR(created_at, 'YYYY-MM') ORDER BY created_at) as rn
    FROM orders
)
UPDATE orders o
SET display_id = UPPER(TO_CHAR(o.created_at, 'MON-YYYY')) || '-' || LPAD(n.rn::text, 5, '0')
FROM numbered_orders n
WHERE o.id = n.id;

-- Make it required and unique
ALTER TABLE orders ALTER COLUMN display_id SET NOT NULL;
ALTER TABLE orders ADD CONSTRAINT uq_orders_display_id UNIQUE (display_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_display_id ON orders(display_id);
