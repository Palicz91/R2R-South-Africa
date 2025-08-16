/*
  # Update flow events valid event types

  1. Changes
    - Update valid_event_type constraint to include all possible event types
    - Add new event type 'rating_collected'

  2. Notes
    - Ensures consistency between frontend and database validation
    - Maintains data integrity for event tracking
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
    'rating_too_low',
    'rating_collected'
  )
);