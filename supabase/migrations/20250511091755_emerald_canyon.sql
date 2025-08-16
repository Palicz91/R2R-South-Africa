/*
  # Create subscription helper functions

  1. Functions
    - check_subscription_limits
    - increment_usage_counter
    - get_current_usage

  2. Security
    - Functions run with SECURITY DEFINER
    - Safe parameter handling
*/

-- Function to check if user is within subscription limits
CREATE OR REPLACE FUNCTION check_subscription_limits(
  user_id uuid,
  metric text
)
RETURNS boolean AS $$
DECLARE
  current_plan subscription_plan;
  current_usage integer;
  plan_limit integer;
BEGIN
  -- Get user's current plan
  SELECT plan INTO current_plan
  FROM subscriptions
  WHERE subscriptions.user_id = check_subscription_limits.user_id;

  -- Get current usage for the metric
  SELECT
    CASE metric
      WHEN 'reviews' THEN review_count
      WHEN 'wheels' THEN wheel_count
      WHEN 'businesses' THEN business_count
    END INTO current_usage
  FROM usage_metrics
  WHERE usage_metrics.user_id = check_subscription_limits.user_id
  AND month = date_trunc('month', now())::date;

  -- Get plan limit for the metric
  SELECT
    CASE metric
      WHEN 'reviews' THEN max_reviews_per_month
      WHEN 'wheels' THEN max_wheels
      WHEN 'businesses' THEN max_businesses
    END INTO plan_limit
  FROM plan_features
  WHERE plan = current_plan;

  -- Return true if within limits
  RETURN COALESCE(current_usage, 0) < plan_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment usage counters
CREATE OR REPLACE FUNCTION increment_usage_counter(
  user_id uuid,
  metric text,
  amount integer DEFAULT 1
)
RETURNS void AS $$
BEGIN
  INSERT INTO usage_metrics (
    user_id,
    month,
    review_count,
    wheel_count,
    business_count
  )
  VALUES (
    user_id,
    date_trunc('month', now())::date,
    CASE WHEN metric = 'reviews' THEN amount ELSE 0 END,
    CASE WHEN metric = 'wheels' THEN amount ELSE 0 END,
    CASE WHEN metric = 'businesses' THEN amount ELSE 0 END
  )
  ON CONFLICT (user_id, month) DO UPDATE
  SET
    review_count = usage_metrics.review_count + 
      CASE WHEN metric = 'reviews' THEN amount ELSE 0 END,
    wheel_count = usage_metrics.wheel_count +
      CASE WHEN metric = 'wheels' THEN amount ELSE 0 END,
    business_count = usage_metrics.business_count +
      CASE WHEN metric = 'businesses' THEN amount ELSE 0 END,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current usage
CREATE OR REPLACE FUNCTION get_current_usage(user_id uuid)
RETURNS jsonb AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'reviews', COALESCE(review_count, 0),
    'wheels', COALESCE(wheel_count, 0),
    'businesses', COALESCE(business_count, 0)
  ) INTO result
  FROM usage_metrics
  WHERE usage_metrics.user_id = get_current_usage.user_id
  AND month = date_trunc('month', now())::date;

  RETURN COALESCE(result, jsonb_build_object(
    'reviews', 0,
    'wheels', 0,
    'businesses', 0
  ));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;