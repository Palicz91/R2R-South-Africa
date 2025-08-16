-- Add qr_code_redeemed to valid event types
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
    'honesty_check_ok',
    'qr_code_redeemed'
  ]::text[])
);