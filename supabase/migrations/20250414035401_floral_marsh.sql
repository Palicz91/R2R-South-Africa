/*
  # Create prize claims tracking system

  1. New Tables
    - `prize_claims`
      - `id` (uuid, primary key)
      - `review_click_id` (uuid, references review_clicks)
      - `prize` (text)
      - `email` (text)
      - `qr_code_url` (text)
      - `redeemed` (boolean)
      - `sent_at` (timestamp)
      - `redeemed_at` (timestamp)
      - `expires_at` (timestamp)

  2. Security
    - Enable RLS on `prize_claims` table
    - Add policies for:
      - Business owners can view their claims
      - Public can redeem with valid code
*/

CREATE TABLE IF NOT EXISTS prize_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_click_id uuid REFERENCES review_clicks NOT NULL,
  prize text NOT NULL,
  email text NOT NULL,
  qr_code_url text NOT NULL,
  redeemed boolean DEFAULT false,
  sent_at timestamptz DEFAULT now(),
  redeemed_at timestamptz,
  expires_at timestamptz DEFAULT (now() + interval '30 days'),
  UNIQUE(review_click_id)
);

ALTER TABLE prize_claims ENABLE ROW LEVEL SECURITY;

-- Business owners can view claims for their reviews
CREATE POLICY "Business owners can view claims"
  ON prize_claims
  FOR SELECT
  TO authenticated
  USING (
    review_click_id IN (
      SELECT rc.id FROM review_clicks rc
      JOIN business_profiles bp ON rc.business_id = bp.id
      WHERE bp.user_id = auth.uid()
    )
  );

-- Anyone can redeem a valid claim
CREATE POLICY "Public can redeem claims"
  ON prize_claims
  FOR UPDATE
  TO public
  USING (NOT redeemed AND now() < expires_at)
  WITH CHECK (NOT redeemed AND now() < expires_at);