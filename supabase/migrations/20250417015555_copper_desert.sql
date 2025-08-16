/*
  # Create flow events tracking table

  1. New Tables
    - `flow_events`
      - `id` (uuid, primary key)
      - `wheel_id` (uuid, references wheel_projects)
      - `event` (text) - Type of event
      - `ts` (timestamp) - When event occurred
      - `prize_id` (uuid, nullable) - For wheel_spin/prize_awarded events
      - `metadata` (jsonb, nullable) - Additional event data

  2. Security
    - Enable RLS
    - Add policies for business owners to view their events
*/

CREATE TABLE IF NOT EXISTS flow_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wheel_id uuid REFERENCES wheel_projects NOT NULL,
  event text NOT NULL,
  ts timestamptz DEFAULT now(),
  prize_id uuid,
  metadata jsonb,
  CONSTRAINT valid_event_type CHECK (
    event IN (
      'qr_scan',
      'google_cta_click',
      'review_done_click',
      'honesty_check_ok',
      'wheel_spin',
      'prize_awarded'
    )
  )
);

ALTER TABLE flow_events ENABLE ROW LEVEL SECURITY;

-- Business owners can view events for their wheels
CREATE POLICY "Business owners can view flow events"
  ON flow_events
  FOR SELECT
  TO authenticated
  USING (
    wheel_id IN (
      SELECT id FROM wheel_projects
      WHERE user_id = auth.uid()
    )
  );

-- Allow public to insert events
CREATE POLICY "Public can insert flow events"
  ON flow_events
  FOR INSERT
  TO public
  WITH CHECK (true);