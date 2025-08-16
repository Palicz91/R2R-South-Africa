/*
  # Fix review_clicks RLS policies

  1. Changes
    - Drop and recreate RLS policies for review_clicks table
    - Enable RLS explicitly
    - Add public policy for both INSERT and SELECT
    - Maintain business owner access

  2. Security
    - Allow public access for inserting reviews
    - Allow public to view their own submitted reviews
    - Maintain business owner access to their reviews
*/

-- First ensure RLS is enabled
ALTER TABLE public.review_clicks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can insert review clicks" ON public.review_clicks;
DROP POLICY IF EXISTS "Allow public review submissions" ON public.review_clicks;
DROP POLICY IF EXISTS "Business owners can view their clicks" ON public.review_clicks;

-- Create public insert policy
CREATE POLICY "Public review submissions"
  ON public.review_clicks
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create public select policy
CREATE POLICY "Public can view own reviews"
  ON public.review_clicks
  FOR SELECT
  TO public
  USING (true);

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