-- Create settings table for Module 8: Admin Settings
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Seed default settings
INSERT INTO settings (key, value, category, description) VALUES
('business_name', 'RentIt', 'business', 'Business name'),
('business_email', 'contact@rentit.com', 'business', 'Contact email'),
('business_phone', '+91 1234567890', 'business', 'Contact phone'),
('business_address', '123 Main St, Mumbai, India', 'business', 'Business address'),
('late_fee_percentage', '10', 'rental', 'Late fee percentage per day'),
('min_deposit_percentage', '20', 'rental', 'Minimum deposit percentage'),
('cancellation_hours', '24', 'rental', 'Cancellation allowed before hours'),
('currency', 'INR', 'system', 'Currency code'),
('timezone', 'Asia/Kolkata', 'system', 'Timezone'),
('date_format', 'DD/MM/YYYY', 'system', 'Date format')
ON CONFLICT (key) DO NOTHING;
