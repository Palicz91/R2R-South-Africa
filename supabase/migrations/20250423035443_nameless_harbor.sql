/*
  # Create reward codes table

  1. New Tables
    - `reward_codes`
      - `id` (uuid, primary key)
      - `user_email` (text)
      - `wheel_project_id` (uuid, references wheel_projects)
      - `prize` (text)
      - `code` (text, unique)
      - `redeemed` (boolean)
      - `created_at` (timestamptz)
      - `redeemed_at` (timestamptz)
      - `expires_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for:
      - Authenticated users can insert codes
      - Public can view and redeem their own codes
      - Business owners can view codes for their projects
*/

-- Create the reward_codes table
CREATE TABLE IF NOT EXISTS reward_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  wheel_project_id uuid REFERENCES wheel_projects(id) ON DELETE CASCADE,
  prize text NOT NULL,
  code text UNIQUE NOT NULL,
  redeemed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  redeemed_at timestamptz,
  expires_at timestamptz,
  CONSTRAINT valid_expiry CHECK (expires_at > created_at)
);

-- Enable Row Level Security
ALTER TABLE reward_codes ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert codes
CREATE POLICY "Authenticated users can insert codes"
  ON reward_codes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    wheel_project_id IN (
      SELECT id FROM wheel_projects
      WHERE user_id = auth.uid()
    )
  );

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