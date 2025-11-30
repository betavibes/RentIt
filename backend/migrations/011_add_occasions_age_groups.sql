-- Create occasions table
CREATE TABLE IF NOT EXISTS occasions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create age_groups table
CREATE TABLE IF NOT EXISTS age_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign keys to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS occasion_id UUID REFERENCES occasions(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS age_group_id UUID REFERENCES age_groups(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_occasion_id ON products(occasion_id);
CREATE INDEX IF NOT EXISTS idx_products_age_group_id ON products(age_group_id);
