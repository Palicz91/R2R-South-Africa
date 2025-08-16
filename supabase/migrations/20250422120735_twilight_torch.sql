/*
  # Update flow_events valid_event_type constraint

  1. Changes
    - Update the check constraint to include all valid event types
    - Add support for new event types:
      - email_collected
      - low_rating_skip
      - rating_too_low

  2. Notes
    - Maintains existing event types
    - Adds new event types safely
*/

ALTER TABLE flow_events
DROP CONSTRAINT IF EXISTS valid_event_type;

ALTER TABLE flow_events
ADD CONSTRAINT valid_event_type CHECK (
  event IN (
    'qr_scan',
    'google_cta_click',
    'review_done_click',
    'honesty_check_ok',
    'wheel_spin',
    'prize_awarded',
    'email_collected',
    'low_rating_skip',
    'rating_too_low'
  )
);