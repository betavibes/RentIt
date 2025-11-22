CREATE TABLE IF NOT EXISTS rental_quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  rental_start_date TIMESTAMP NOT NULL,
  rental_end_date TIMESTAMP NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  security_deposit DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rental_quotes_user ON rental_quotes(user_id);
CREATE INDEX idx_rental_quotes_product ON rental_quotes(product_id);
CREATE INDEX idx_rental_quotes_status ON rental_quotes(status);
