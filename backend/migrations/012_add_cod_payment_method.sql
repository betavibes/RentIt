-- Migration: Add COD to Payment Methods
-- Add 'cod' (Cash on Delivery) to the allowed payment methods

ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_payment_method_check;
ALTER TABLE payments ADD CONSTRAINT payments_payment_method_check 
    CHECK (payment_method IN ('card', 'upi', 'wallet', 'cod'));
