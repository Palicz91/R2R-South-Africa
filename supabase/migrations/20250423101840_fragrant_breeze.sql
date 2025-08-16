/*
  # Fix reward_codes RLS policies

  1. Changes
    - Drop existing policies to avoid conflicts
    - Create new public insert policy
    - Update select and update policies
    - Ensure proper access control

  2. Security
    - Allow public to insert reward codes
    - Maintain secure viewing and redemption policies
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Authenticated users can insert codes" ON reward_codes;
DROP POLICY IF EXISTS "Public can view own codes" ON reward_codes;
DROP POLICY IF EXISTS "Business owners can view project codes" ON reward_codes;
DROP POLICY IF EXISTS "Public can redeem valid codes" ON reward_codes;

-- Enable RLS
ALTER TABLE reward_codes ENABLE ROW LEVEL SECURITY;

-- Allow public to insert codes
CREATE POLICY "Public can insert codes"
  ON reward_codes
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow public to view their own codes
CREATE POLICY "Public can view own codes"
  ON reward_codes
  FOR SELECT
  TO public
  USING (user_email = current_setting('request.jwt.claims')::json->>'email');

-- Allow business owners to view codes for their projects
CREATE POLICY "Business owners can view project codes"
  ON reward_codes
  FOR SELECT
  TO authenticated
  USING (
    wheel_project_id IN (
      SELECT id FROM wheel_projects
      WHERE user_id = auth.uid()
    )
  );

-- Allow public to redeem unredeemed and non-expired codes
CREATE POLICY "Public can redeem valid codes"
  ON reward_codes
  FOR UPDATE
  TO public
  USING (
    NOT redeemed 
    AND (expires_at IS NULL OR expires_at > now())
    AND user_email = current_setting('request.jwt.claims')::json->>'email'
  )
  WITH CHECK (
    NOT redeemed 
    AND (expires_at IS NULL OR expires_at > now())
  );