/*
  # Add delete policy for wheel projects

  1. Changes
    - Add RLS policy to allow users to delete their own wheel projects
    
  2. Security
    - Only allow deletion if user_id matches authenticated user
    - Ensures users can only delete their own projects
*/

CREATE POLICY "Users can delete their own projects"
  ON wheel_projects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);