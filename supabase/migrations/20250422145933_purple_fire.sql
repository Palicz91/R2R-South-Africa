/*
  # Fix review clicks policies for public inserts

  1. Changes
    - Drop existing insert policies
    - Create new public insert policy with no restrictions
    - Ensure business owners can view their clicks
    
  2. Security
    - Allows unauthenticated users to insert review clicks
    - Maintains secure viewing access for business owners
*/

-- Drop existing insert policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can insert review clicks" ON public.review_clicks;
DROP POLICY IF EXISTS "Allow public review submissions" ON public.review_clicks;

-- Create new unrestricted insert policy
CREATE POLICY "Anyone can insert review clicks"
  ON public.review_clicks
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Ensure the select policy exists and is correct
DROP POLICY IF EXISTS "Business owners can view their clicks" ON public.review_clicks;

CREATE POLICY "Business owners can view their clicks"
  ON public.review_clicks
  FOR SELECT
  TO authenticated
  USING (
    business_id IN (
      SELECT id FROM public.business_profiles 
      WHERE user_id = auth.uid()
    )
  );