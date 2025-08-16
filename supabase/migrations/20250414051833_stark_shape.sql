/*
  # Add contact and location fields to business profiles

  1. Changes
    - Add new optional fields to business_profiles table:
      - address (text, nullable)
      - phone (text, nullable)
      - email (text, nullable)
      - description (text, nullable)

  2. Notes
    - All fields are optional
    - No changes to existing RLS policies needed
*/

DO $$ 
BEGIN
  -- Add address field if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'business_profiles' AND column_name = 'address'
  ) THEN
    ALTER TABLE business_profiles ADD COLUMN address text;
  END IF;

  -- Add phone field if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'business_profiles' AND column_name = 'phone'
  ) THEN
    ALTER TABLE business_profiles ADD COLUMN phone text;
  END IF;

  -- Add email field if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'business_profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE business_profiles ADD COLUMN email text;
  END IF;

  -- Add description field if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'business_profiles' AND column_name = 'description'
  ) THEN
    ALTER TABLE business_profiles ADD COLUMN description text;
  END IF;
END $$;