/*
  # Update system_settings RLS policies

  1. Changes
    - Enable RLS on system_settings table
    - Add policy for public read access
    - Add policy for admin-only write access
    - Use subquery to check user role

  2. Security
    - Everyone can read settings
    - Only admins can update or insert settings
    - Uses user_roles table for role checks
*/

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