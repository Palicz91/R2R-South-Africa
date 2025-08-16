/*
  # Create flow events tracking table

  1. New Tables
    - `flow_events`
      - `id` (uuid, primary key)
      - `wheel_id` (uuid, references wheel_projects)
      - `event` (text, constrained to valid event types)
      - `ts` (timestamp)
      - `prize_id` (uuid, nullable)
      - `metadata` (jsonb, nullable)

  2. Security
    - Enable RLS
    - Add policies for:
      - Business owners can view their events
      - Public can insert events
*/

-- Create the flow_events table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'flow_events') THEN
    CREATE TABLE flow_events (
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

    -- Enable RLS
    ALTER TABLE flow_events ENABLE ROW LEVEL SECURITY;

    -- Create policies
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

    CREATE POLICY "Public can insert flow events"
      ON flow_events
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;
END $$;