/*
  # Fix emails_sent table and policies

  1. Changes
    - Drop existing policies to avoid conflicts
    - Recreate table if it doesn't exist
    - Add fresh policies
    
  2. Security
    - Enable RLS
    - Business owners can view their sent emails
    - Service role can insert records
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Business owners can view sent emails" ON emails_sent;
DROP POLICY IF EXISTS "Service role can insert emails" ON emails_sent;

-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS emails_sent (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wheel_id uuid REFERENCES wheel_projects(id) ON DELETE CASCADE,
  email text NOT NULL,
  prize text NOT NULL,
  reward_code text NOT NULL,
  sent_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE emails_sent ENABLE ROW LEVEL SECURITY;

-- Create fresh policies
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

CREATE POLICY "Service role can insert emails"
  ON emails_sent
  FOR INSERT
  TO service_role
  WITH CHECK (true);