/*
  # Fix review ratings table and policies

  1. Changes
    - Drop existing policies to avoid conflicts
    - Create review_ratings table if it doesn't exist
    - Add fresh policies for public access and business owners
    
  2. Security
    - Enable RLS
    - Allow public to insert ratings
    - Allow business owners to view their ratings
    - Allow public to view all ratings for transparency
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can insert ratings" ON review_ratings;
DROP POLICY IF EXISTS "Business owners can view ratings" ON review_ratings;
DROP POLICY IF EXISTS "Public can view ratings" ON review_ratings;

-- Create the review_ratings table
CREATE TABLE IF NOT EXISTS review_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wheel_id uuid REFERENCES wheel_projects(id) ON DELETE CASCADE,
  rating integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5)
);

-- Enable RLS
ALTER TABLE review_ratings ENABLE ROW LEVEL SECURITY;

-- Create fresh policies
CREATE POLICY "Public can insert ratings"
  ON review_ratings
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Business owners can view ratings"
  ON review_ratings
  FOR SELECT
  TO authenticated
  USING (
    wheel_id IN (
      SELECT id FROM wheel_projects
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Public can view ratings"
  ON review_ratings
  FOR SELECT
  TO public
  USING (true);