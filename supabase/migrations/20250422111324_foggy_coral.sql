/*
  # Add minimum rating requirement field to wheel_projects

  1. Changes
    - Add min_rating_required column to wheel_projects table
      - Integer type
      - Default value of 4
      - NOT NULL constraint
      - CHECK constraint to ensure value is between 1 and 5

  2. Notes
    - Existing projects will default to requiring 4 stars
    - No changes to RLS policies needed as this is just an additional column
*/

ALTER TABLE wheel_projects
ADD COLUMN min_rating_required integer NOT NULL DEFAULT 4
CHECK (min_rating_required >= 1 AND min_rating_required <= 5);

-- Update any existing records to have the default value
UPDATE wheel_projects
SET min_rating_required = 4
WHERE min_rating_required IS NULL;