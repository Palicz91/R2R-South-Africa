/*
  # Add expires_in_days field to wheel_projects

  1. Changes
    - Add expires_in_days column to wheel_projects table
      - Integer type
      - NOT NULL constraint
      - Default value of 30 days
      - CHECK constraint to ensure positive value

  2. Notes
    - Existing projects will default to 30 days expiry
    - No changes to RLS policies needed
*/

-- Add expires_in_days column with constraints
ALTER TABLE wheel_projects
ADD COLUMN expires_in_days integer NOT NULL DEFAULT 30
CHECK (expires_in_days > 0);

-- Update any existing records to have the default value
UPDATE wheel_projects
SET expires_in_days = 30
WHERE expires_in_days IS NULL;