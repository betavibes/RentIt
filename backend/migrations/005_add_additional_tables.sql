CREATE TABLE IF NOT EXISTS damage_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rental_id UUID NOT NULL REFERENCES rentals(id) ON DELETE CASCADE,
  damage_type VARCHAR(100) NOT NULL,
  severity VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  estimated_cost DECIMAL(10, 2),
  approved_cost DECIMAL(10, 2),
  reported_by_user BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_damage_reports_rental ON damage_reports(rental_id);
CREATE INDEX idx_damage_reports_status ON damage_reports(status);

CREATE TABLE IF NOT EXISTS student_discounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  discount_percentage DECIMAL(5, 2) NOT NULL,
  reason VARCHAR(255),
  valid_until TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_student_discounts_user ON student_discounts(user_id);
CREATE INDEX idx_student_discounts_valid ON student_discounts(valid_until);

CREATE TABLE IF NOT EXISTS referral_codes (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  code VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referred_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  new_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reward_amount DECIMAL(10, 2) DEFAULT 500,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_referrals_referred_by ON referrals(referred_by_user_id);
CREATE INDEX idx_referrals_new_user ON referrals(new_user_id);

CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  transaction_type VARCHAR(50) NOT NULL,
  reference_id VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_wallet_transactions_user ON wallet_transactions(user_id);
CREATE INDEX idx_wallet_transactions_created ON wallet_transactions(created_at);

CREATE TABLE IF NOT EXISTS occasion_collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  theme_color VARCHAR(50),
  banner_image VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_occasion_collections_active ON occasion_collections(is_active);

CREATE TABLE IF NOT EXISTS occasion_collection_products (
  collection_id UUID NOT NULL REFERENCES occasion_collections(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (collection_id, product_id)
);

CREATE INDEX idx_occasion_collection_products_collection ON occasion_collection_products(collection_id);
CREATE INDEX idx_occasion_collection_products_product ON occasion_collection_products(product_id);
