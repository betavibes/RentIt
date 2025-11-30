-- Migration: Add order_number to product_images table
-- This allows products to have multiple images with specific ordering

-- Add order_number column
ALTER TABLE product_images 
ADD COLUMN order_number INTEGER DEFAULT 0;

-- Update existing records to have order numbers based on is_primary
-- Primary images get order 1, others get order 2
UPDATE product_images 
SET order_number = CASE 
    WHEN is_primary = true THEN 1 
    ELSE 2 
END;

-- Add NOT NULL constraint after setting default values
ALTER TABLE product_images 
ALTER COLUMN order_number SET NOT NULL;

-- Create index for faster ordering queries
CREATE INDEX idx_product_images_order ON product_images(product_id, order_number);

-- Add comment for documentation
COMMENT ON COLUMN product_images.order_number IS 'Display order of product images (1-4), where 1 is the primary image';
