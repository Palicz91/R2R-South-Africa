/*
  # Create subscription system tables

  1. New Tables
    - `subscriptions`
      - Core subscription data
      - Plan types and status
      - Trial period tracking
    - `usage_metrics`
      - Monthly usage tracking
      - Reviews, wheels, businesses counts
    - `plan_features`
      - Plan limits and capabilities
      - Reference data for each plan tier

  2. Security
    - Enable RLS
    - Policies for user data access
    - Link to auth.users
*/

-- Create enum types for plans and status
CREATE TYPE subscription_plan AS ENUM ('free', 'solo', 'growth', 'unlimited');
CREATE TYPE subscription_status AS ENUM ('trialing', 'active', 'past_due', 'canceled', 'incomplete');

-- Create subscriptions table
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  plan subscription_plan NOT NULL DEFAULT 'free',
  status subscription_status NOT NULL DEFAULT 'trialing',
  trial_start timestamptz DEFAULT now(),
  trial_end timestamptz DEFAULT (now() + interval '14 days'),
  current_period_start timestamptz DEFAULT now(),
  current_period_end timestamptz DEFAULT (now() + interval '1 month'),
  cancel_at_period_end boolean DEFAULT false,
  canceled_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create usage_metrics table
CREATE TABLE usage_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  month date NOT NULL,
  review_count integer DEFAULT 0,
  wheel_count integer DEFAULT 0,
  business_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, month)
);

-- Create plan_features table
CREATE TABLE plan_features (
  plan subscription_plan PRIMARY KEY,
  max_reviews_per_month integer NOT NULL,
  max_wheels integer NOT NULL,
  max_businesses integer NOT NULL,
  has_custom_branding boolean DEFAULT false,
  has_priority_support boolean DEFAULT false,
  has_custom_prizes boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_features ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own subscription"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own usage metrics"
  ON usage_metrics
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view plan features"
  ON plan_features
  FOR SELECT
  TO public
  USING (true);

-- Insert default plan features
INSERT INTO plan_features (
  plan,
  max_reviews_per_month,
  max_wheels,
  max_businesses,
  has_custom_branding,
  has_priority_support,
  has_custom_prizes
) VALUES
  ('free', 50, 1, 1, false, false, false),
  ('solo', 200, 3, 1, true, false, false),
  ('growth', 1000, 15, 3, true, true, true),
  ('unlimited', 999999, 999999, 999999, true, true, true);

-- Create function to reset monthly metrics
CREATE OR REPLACE FUNCTION reset_monthly_metrics()
RETURNS void AS $$
BEGIN
  INSERT INTO usage_metrics (user_id, month)
  SELECT DISTINCT
    user_id,
    date_trunc('month', now())::date
  FROM subscriptions
  ON CONFLICT (user_id, month) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create monthly reset trigger
CREATE OR REPLACE FUNCTION trigger_reset_monthly_metrics()
RETURNS trigger AS $$
BEGIN
  PERFORM reset_monthly_metrics();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER monthly_metrics_reset
  AFTER INSERT OR UPDATE ON subscriptions
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_reset_monthly_metrics();