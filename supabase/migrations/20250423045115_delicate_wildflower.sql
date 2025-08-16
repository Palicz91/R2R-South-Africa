/*
  # Create emails_sent tracking table

  1. New Tables
    - `emails_sent`
      - `id` (uuid, primary key)
      - `wheel_id` (uuid, references wheel_projects)
      - `email` (text)
      - `prize` (text)
      - `reward_code` (text)
      - `sent_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for:
      - Business owners can view emails sent for their wheels
      - Edge function can insert records
*/

CREATE TABLE IF NOT EXISTS emails_sent (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wheel_id uuid REFERENCES wheel_projects(id) ON DELETE CASCADE,
  email text NOT NULL,
  prize text NOT NULL,
  reward_code text NOT NULL,
  sent_at timestamptz DEFAULT now()
);

ALTER TABLE emails_sent ENABLE ROW LEVEL SECURITY;

-- Allow business owners to view emails sent for their wheels
CREATE POLICY "Business owners can view sent emails"
  ON emails_sent
  FOR SELECT
  TO authenticated
  USING (
    wheel_id IN (
      SELECT id FROM wheel_projects
      WHERE user_id = auth.uid()
    )
  );

-- Allow service role to insert records (for edge function)
CREATE POLICY "Service role can insert emails"
  ON emails_sent
  FOR INSERT
  TO service_role
  WITH CHECK (true);