/*
  # Create business profiles table

  1. New Tables
    - `business_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `business_name` (text)
      - `logo_url` (text)
      - `banner_url` (text)
      - `google_review_link` (text)
      - `primary_color` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `business_profiles` table
    - Add policies for authenticated users to manage their own profiles
*/

CREATE TABLE IF NOT EXISTS business_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  business_name text NOT NULL,
  logo_url text,
  banner_url text,
  google_review_link text,
  primary_color text DEFAULT '#2563eb',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON business_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON business_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON business_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create storage bucket for business assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('business-assets', 'business-assets', true);

-- Allow authenticated users to upload files to the business-assets bucket
CREATE POLICY "Authenticated users can upload files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'business-assets' AND auth.uid() = owner);

-- Allow public access to view files
CREATE POLICY "Public can view files"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'business-assets');