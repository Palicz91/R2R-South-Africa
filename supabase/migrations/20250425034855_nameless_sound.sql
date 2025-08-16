/*
  # Add starred prize feature

  1. Changes
    - Update wheel_projects table to support starred prizes
    - Add validation to ensure only one prize can be starred
    - Add check constraint for prize structure

  2. Notes
    - Each project can have at most one starred prize
    - The prizes column is a JSONB array of objects
    - Each prize object must have a label, probability, and starred field
*/

-- First, create a function to validate the prizes array
CREATE OR REPLACE FUNCTION validate_prizes_array()
RETURNS trigger AS $$
BEGIN
  -- Check that prizes is an array
  IF NOT jsonb_typeof(NEW.prizes) = 'array' THEN
    RAISE EXCEPTION 'prizes must be an array';
  END IF;

  -- Check that each prize has required fields and only one is starred
  IF (
    SELECT count(*)
    FROM jsonb_array_elements(NEW.prizes) prize
    WHERE prize->>'starred' = 'true'
  ) > 1 THEN
    RAISE EXCEPTION 'only one prize can be starred';
  END IF;

  -- Validate prize structure
  IF EXISTS (
    SELECT *
    FROM jsonb_array_elements(NEW.prizes) prize
    WHERE NOT (
      prize ? 'label' AND
      prize ? 'probability' AND
      prize ? 'starred' AND
      jsonb_typeof(prize->'probability') = 'number' AND
      jsonb_typeof(prize->'starred') = 'boolean'
    )
  ) THEN
    RAISE EXCEPTION 'invalid prize structure';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create or replace the trigger
DROP TRIGGER IF EXISTS validate_prizes_trigger ON wheel_projects;
CREATE TRIGGER validate_prizes_trigger
  BEFORE INSERT OR UPDATE ON wheel_projects
  FOR EACH ROW
  EXECUTE FUNCTION validate_prizes_array();

-- Update existing records to include starred field
UPDATE wheel_projects
SET prizes = (
  SELECT jsonb_agg(
    prize || jsonb_build_object('starred', false)
  )
  FROM jsonb_array_elements(prizes) prize
)
WHERE NOT EXISTS (
  SELECT 1
  FROM jsonb_array_elements(prizes) p
  WHERE p ? 'starred'
);