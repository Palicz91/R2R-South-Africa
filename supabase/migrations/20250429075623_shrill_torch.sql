/*
  # Fix flow events valid event types

  1. Changes
    - Update valid_event_type constraint to include all needed event types
    - Add 'email_sent' to valid event types
    - Use array syntax for better performance

  2. Notes
    - Maintains existing event types
    - Ensures compatibility with email service events
*/

BEGIN;

-- Update the constraint to include all needed event types
ALTER TABLE flow_events
DROP CONSTRAINT IF EXISTS valid_event_type;

ALTER TABLE flow_events
ADD CONSTRAINT valid_event_type CHECK (
  event = ANY (ARRAY[
    'qr_scan',
    'google_cta_click',
    'rating_collected',
    'low_rating',
    'wheel_spin',
    'prize_awarded',
    'email_saved',
    'email_sent',
    'qr_code_updated',
    'honesty_check_ok'
  ]::text[])
);

COMMIT;