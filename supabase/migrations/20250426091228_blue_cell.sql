/*
  # Add review ratings tracking

  1. New Tables
    - `review_ratings`
      - `id` (uuid, primary key)
      - `wheel_id` (uuid, references wheel_projects)
      - `rating` (integer)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for:
      - Public can insert ratings
      - Business owners can view their ratings
*/

CREATE TABLE IF NOT EXISTS review_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wheel_id uuid REFERENCES wheel_projects(id) ON DELETE CASCADE,
  rating integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5)
);

ALTER TABLE review_ratings ENABLE ROW LEVEL SECURITY;

-- Allow public to insert ratings
CREATE POLICY "Public can insert ratings"
  ON review_ratings
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow business owners to view their ratings
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