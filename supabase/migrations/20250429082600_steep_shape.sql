/*
  # Create QR codes storage bucket and policies

  1. Changes
    - Create qr-codes storage bucket
    - Add public read access policy
    - Add service role write access policy

  2. Security
    - Allow public read access to QR codes
    - Only service role can upload QR codes
*/

-- Create the qr-codes bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
SELECT 'qr-codes', 'qr-codes', true
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'qr-codes'
);

-- Allow public read access to QR codes
CREATE POLICY "Public read access for QR codes"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'qr-codes');

-- Allow service role to upload QR codes
CREATE POLICY "Service role can upload QR codes"
ON storage.objects
FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'qr-codes');