/*
  # Fix review_clicks RLS policies

  1. Changes
    - Drop existing policies to avoid conflicts
    - Create new unrestricted public insert policy
    - Ensure correct select policy for business owners
    - Enable RLS on the table

  2. Security
    - Allow anyone to insert review clicks
    - Only business owners can view their own clicks
*/

-- First ensure RLS is enabled
ALTER TABLE public.review_clicks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can insert review clicks" ON public.review_clicks;
DROP POLICY IF EXISTS "Allow public review submissions" ON public.review_clicks;
DROP POLICY IF EXISTS "Business owners can view their clicks" ON public.review_clicks;

-- Create new unrestricted insert policy
CREATE POLICY "Anyone can insert review clicks"
  ON public.review_clicks
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create select policy for business owners
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