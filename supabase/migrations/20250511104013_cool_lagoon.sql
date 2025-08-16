/*
  # Create user roles table

  1. New Tables
    - `user_roles`
      - `user_id` (uuid, primary key, references auth.users)
      - `role` (text enum, values: 'admin', 'editor', 'user')

  2. Security
    - Enable RLS
    - Add policy for users to read their own role
*/

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  user_id uuid PRIMARY KEY REFERENCES auth.users,
  role text NOT NULL DEFAULT 'user'
    CHECK (role IN ('admin', 'editor', 'user'))
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own role
CREATE POLICY "Users can read own role"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert admin user
INSERT INTO user_roles (user_id, role)
VALUES ('629db476-fcc8-494d-b70f-971719bf3845', 'admin')
ON CONFLICT (user_id) DO UPDATE
SET role = 'admin';