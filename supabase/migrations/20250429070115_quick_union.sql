/*
  # Update QR code URLs to use new base URL

  1. Changes
    - Update QR code URLs in prize_claims table
    - Ensure all URLs use the new VITE_APP_URL base
    - Handle existing records safely

  2. Notes
    - Uses safe update approach
    - Maintains existing QR codes while updating URLs
*/

-- Function to update QR code URLs
CREATE OR REPLACE FUNCTION update_qr_urls() 
RETURNS void AS $$
DECLARE
  base_url text := current_setting('app.settings.frontend_url', true);
BEGIN
  -- Update prize_claims table QR code URLs
  UPDATE prize_claims
  SET qr_code_url = regexp_replace(
    qr_code_url,
    '^https?://[^/]+/qr/',
    base_url || '/qr/'
  )
  WHERE qr_code_url IS NOT NULL
  AND qr_code_url != '';

  -- Log the update
  INSERT INTO flow_events (
    wheel_id,
    event,
    metadata
  )
  SELECT DISTINCT
    pc.wheel_project_id,
    'qr_code_updated',
    jsonb_build_object(
      'old_url', qr_code_url,
      'new_base', base_url
    )
  FROM prize_claims pc
  WHERE pc.qr_code_url IS NOT NULL;
END;
$$ LANGUAGE plpgsql;