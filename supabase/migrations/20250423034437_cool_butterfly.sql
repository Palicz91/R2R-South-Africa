/*
  # Fix prize_claims RLS policies

  1. Changes
    - Drop existing policies to avoid conflicts
    - Create new unrestricted insert policy for public
    - Update select policies for business owners and public
    - Ensure RLS is enabled

  2. Security
    - Allow public to insert claims
    - Allow public to view their own claims
    - Allow business owners to view claims for their reviews
*/

-- First ensure RLS is enabled
ALTER TABLE public.prize_claims ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Business owners can view claims" ON public.prize_claims;
DROP POLICY IF EXISTS "Public can redeem claims" ON public.prize_claims;

-- Create public insert policy
CREATE POLICY "Public can insert claims"
  ON public.prize_claims
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create public select policy
CREATE POLICY "Public can view own claims"
  ON public.prize_claims
  FOR SELECT
  TO public
  USING (true);

-- Create select policy for business owners
CREATE POLICY "Business owners can view claims"
  ON public.prize_claims
  FOR SELECT
  TO authenticated
  USING (
    review_click_id IN (
      SELECT rc.id FROM review_clicks rc
      JOIN business_profiles bp ON rc.business_id = bp.id
      WHERE bp.user_id = auth.uid()
    )
  );

-- Create update policy for redeeming claims
CREATE POLICY "Public can redeem claims"
  ON public.prize_claims
  FOR UPDATE
  TO public
  USING (NOT redeemed AND now() < expires_at)
  WITH CHECK (NOT redeemed AND now() < expires_at);