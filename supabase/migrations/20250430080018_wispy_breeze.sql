/*
  # Add redirected_to_google column to review_clicks

  1. Changes
    - Add redirected_to_google boolean column with default false
    - Add to existing table without breaking current data

  2. Notes
    - Safe migration that won't affect existing records
    - All existing records will get default value of false
*/

ALTER TABLE review_clicks
ADD COLUMN redirected_to_google boolean DEFAULT false;