/*
  # Add language column to wheel_projects table

  1. Changes
    - Add language column with allowed values 'en' and 'hu'
    - Set default value to 'en'
    - Add check constraint to ensure valid values

  2. Notes
    - Safe migration that won't affect existing records
    - All existing records will get default value 'en'
*/

ALTER TABLE wheel_projects
ADD COLUMN language text NOT NULL DEFAULT 'en'
CHECK (language IN ('en', 'hu'));

-- Update any existing records to have the default value
UPDATE wheel_projects
SET language = 'en'
WHERE language IS NULL;