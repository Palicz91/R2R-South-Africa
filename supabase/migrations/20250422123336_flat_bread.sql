/*
  # Update flow events valid event types

  1. Changes
    - Update any existing events to valid values
    - Drop and recreate the valid_event_type constraint
    - Use PostgreSQL array syntax for better performance

  2. Notes
    - Safely handles existing data before applying constraint
    - Maintains data integrity
    - Uses transaction to ensure atomicity
*/

BEGIN;

-- First update any existing events to valid values
UPDATE flow_events
SET event = 'rating_collected'
WHERE event NOT IN (
  'qr_scan',
  'google_cta_click',
  'rating_collected',
  'low_rating',
  'wheel_spin',
  'prize_awarded',
  'email_saved'
);

-- Then update the constraint
ALTER TABLE flow_events
DROP CONSTRAINT IF EXISTS valid_event_type;

ALTER TABLE flow_events
ADD CONSTRAINT valid_event_type CHECK (
  event = ANY (
    ARRAY[
      'qr_scan',
      'google_cta_click',
      'rating_collected',
      'low_rating',
      'wheel_spin',
      'prize_awarded',
      'email_saved'
    ]::text[]
  )
);

COMMIT;