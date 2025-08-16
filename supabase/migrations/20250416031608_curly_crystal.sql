/*
  # Add rating and comment fields to review_clicks table

  1. Changes
    - Add rating column (integer, required) with default value
    - Add comment column (text, optional)

  2. Notes
    - Rating is required and should be between 1 and 5
    - Comment is optional
    - Existing rows will get a default rating of 5 (most positive)
    - No changes to existing RLS policies needed
*/

-- First add the columns with rating being nullable initially
ALTER TABLE review_clicks
ADD COLUMN rating integer,
ADD COLUMN comment text;

-- Update existing rows to have a default rating of 5 (most positive)
UPDATE review_clicks
SET rating = 5
WHERE rating IS NULL;

-- Now make the rating column required and add the check constraint
ALTER TABLE review_clicks
ALTER COLUMN rating SET NOT NULL,
ADD CONSTRAINT review_clicks_rating_check CHECK (rating >= 1 AND rating <= 5);