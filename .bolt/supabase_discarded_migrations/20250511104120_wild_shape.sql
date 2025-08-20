/*
  # Create system settings table with admin-only write access

  1. New Tables
    - `system_settings`
      - `id` (uuid, primary key)
      - `key` (text, unique)
      - `value` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies:
      - Everyone can read settings
      - Only admins can modify settings
*/

-- Create the system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on system_settings table
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Everyone can read settings" ON system_settings;
DROP POLICY IF EXISTS "Only admins can modify settings" ON system_settings;

-- Create policy for public read access
CREATE POLICY "Everyone can read settings"
  ON system_settings
  FOR SELECT
  TO public
  USING (true);

-- Create policy for admin-only write access
CREATE POLICY "Only admins can modify settings"
  ON system_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );