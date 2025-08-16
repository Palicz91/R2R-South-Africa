/*
  # Create review clicks tracking table

  1. New Tables
    - `review_clicks`
      - `id` (uuid, primary key)
      - `wheel_id` (uuid, references wheel_projects)
      - `business_id` (uuid, references business_profiles)
      - `email` (text, optional - from OAuth)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `review_clicks` table
    - Add policies for:
      - Public insert access (for tracking clicks)
      - Business owners can view their own clicks
*/

CREATE TABLE IF NOT EXISTS review_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wheel_id uuid REFERENCES wheel_projects NOT NULL,
  business_id uuid REFERENCES business_profiles NOT NULL,
  email text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE review_clicks ENABLE ROW LEVEL SECURITY;

-- Allow public inserts for tracking clicks
CREATE POLICY "Anyone can insert review clicks"
  ON review_clicks
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Business owners can view their clicks
CREATE POLICY "Business owners can view their clicks"
  ON review_clicks
  FOR SELECT
  TO authenticated
  USING (
    business_id IN (
      SELECT id FROM business_profiles WHERE user_id = auth.uid()
    )
  );