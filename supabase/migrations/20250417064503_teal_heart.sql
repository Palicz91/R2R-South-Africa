/*
  # Fix project deletion cascade

  1. Changes
    - Add CASCADE DELETE to foreign key constraints
    - Add missing delete policy for wheel_projects
    - Ensure proper cleanup of related records

  2. Security
    - Ensure only project owners can delete their projects
    - Automatically clean up related records through CASCADE
*/

-- Add CASCADE DELETE to flow_events foreign key
ALTER TABLE flow_events
DROP CONSTRAINT IF EXISTS flow_events_wheel_id_fkey,
ADD CONSTRAINT flow_events_wheel_id_fkey
  FOREIGN KEY (wheel_id)
  REFERENCES wheel_projects(id)
  ON DELETE CASCADE;

-- Add CASCADE DELETE to review_clicks foreign key
ALTER TABLE review_clicks
DROP CONSTRAINT IF EXISTS review_clicks_wheel_id_fkey,
ADD CONSTRAINT review_clicks_wheel_id_fkey
  FOREIGN KEY (wheel_id)
  REFERENCES wheel_projects(id)
  ON DELETE CASCADE;

-- Add CASCADE DELETE to prize_claims foreign key
ALTER TABLE prize_claims
DROP CONSTRAINT IF EXISTS prize_claims_review_click_id_fkey,
ADD CONSTRAINT prize_claims_review_click_id_fkey
  FOREIGN KEY (review_click_id)
  REFERENCES review_clicks(id)
  ON DELETE CASCADE;

-- Ensure delete policy exists for wheel_projects
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'wheel_projects' 
    AND policyname = 'Users can delete their own projects'
  ) THEN
    CREATE POLICY "Users can delete their own projects"
      ON wheel_projects
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;