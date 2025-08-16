/*
  # Create subscription triggers

  1. Triggers
    - Auto-create subscription for new users
    - Check limits before insert/update
    - Update usage metrics

  2. Security
    - Enforce subscription limits
    - Track usage automatically
*/

-- Trigger to create free subscription for new users
CREATE OR REPLACE FUNCTION create_initial_subscription()
RETURNS trigger AS $$
BEGIN
  INSERT INTO subscriptions (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_initial_subscription();

-- Trigger to check wheel limits before creation
CREATE OR REPLACE FUNCTION check_wheel_limits()
RETURNS trigger AS $$
BEGIN
  IF NOT check_subscription_limits(auth.uid(), 'wheels') THEN
    RAISE EXCEPTION 'Wheel limit exceeded for current plan';
  END IF;
  
  PERFORM increment_usage_counter(auth.uid(), 'wheels');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER enforce_wheel_limits
  BEFORE INSERT ON wheel_projects
  FOR EACH ROW
  EXECUTE FUNCTION check_wheel_limits();

-- Trigger to check business limits
CREATE OR REPLACE FUNCTION check_business_limits()
RETURNS trigger AS $$
BEGIN
  IF NOT check_subscription_limits(auth.uid(), 'businesses') THEN
    RAISE EXCEPTION 'Business limit exceeded for current plan';
  END IF;
  
  PERFORM increment_usage_counter(auth.uid(), 'businesses');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER enforce_business_limits
  BEFORE INSERT ON business_profiles
  FOR EACH ROW
  EXECUTE FUNCTION check_business_limits();

-- Trigger to increment review counter
CREATE OR REPLACE FUNCTION increment_review_counter()
RETURNS trigger AS $$
BEGIN
  IF NOT check_subscription_limits(auth.uid(), 'reviews') THEN
    RAISE EXCEPTION 'Review limit exceeded for current plan';
  END IF;
  
  PERFORM increment_usage_counter(auth.uid(), 'reviews');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER track_review_usage
  AFTER INSERT ON review_clicks
  FOR EACH ROW
  EXECUTE FUNCTION increment_review_counter();