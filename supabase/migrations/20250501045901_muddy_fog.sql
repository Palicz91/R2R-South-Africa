/*
  # Add disclaimer field to wheel_projects table

  1. Changes
    - Add optional disclaimer text field to wheel_projects table
    - Safe migration that won't affect existing records

  2. Notes
    - Field is nullable to maintain backward compatibility
    - No changes to RLS policies needed
*/

ALTER TABLE wheel_projects
ADD COLUMN IF NOT EXISTS disclaimer text;