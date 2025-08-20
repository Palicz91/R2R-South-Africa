-- Add Stripe integration columns to promo_codes table
ALTER TABLE promo_codes
ADD COLUMN IF NOT EXISTS stripe_coupon_id text,
ADD COLUMN IF NOT EXISTS stripe_promo_code_id text;

-- Rename discount_value to discount_percentage if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'promo_codes' AND column_name = 'discount_value'
  ) THEN
    ALTER TABLE promo_codes RENAME COLUMN discount_value TO discount_percentage;
  END IF;
END $$;

-- Add discount_percentage if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'promo_codes' AND column_name = 'discount_percentage'
  ) THEN
    ALTER TABLE promo_codes ADD COLUMN discount_percentage numeric;
  END IF;
END $$;

-- Add discount_amount for fixed amount discounts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'promo_codes' AND column_name = 'discount_amount'
  ) THEN
    ALTER TABLE promo_codes ADD COLUMN discount_amount numeric;
  END IF;
END $$;

-- Create index on code for faster lookups
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);