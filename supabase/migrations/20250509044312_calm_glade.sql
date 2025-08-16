/*
  # Add onboarding fields to business_profiles table

  1. Changes
    - Add business_type and business_type_other columns
    - Add employee_range column
    - Add primary_goal and primary_goal_other columns
    - Add hear_about_us column
    - Add monthly_review_goal column
    - Add completed_onboarding column with default false

  2. Notes
    - All new fields are nullable except completed_onboarding
    - Add constraints to ensure valid values for enums
*/

-- Add new columns with constraints
ALTER TABLE business_profiles
ADD COLUMN business_type text CHECK (
  business_type IN (
    'restaurant',
    'barber-shop',
    'beauty-salon',
    'spa',
    'hotel-guesthouse',
    'cafe',
    'other'
  )
),
ADD COLUMN business_type_other text,
ADD COLUMN employee_range text CHECK (
  employee_range IN (
    '1-10',
    '11-50',
    '51-100',
    '100+'
  )
),
ADD COLUMN primary_goal text CHECK (
  primary_goal IN (
    'reviews',
    'filter',
    'recurring',
    'all',
    'other'
  )
),
ADD COLUMN primary_goal_other text,
ADD COLUMN hear_about_us text CHECK (
  hear_about_us IN (
    'linkedin',
    'google',
    'instagram',
    'referral'
  )
),
ADD COLUMN monthly_review_goal integer CHECK (monthly_review_goal > 0 AND monthly_review_goal <= 10000),
ADD COLUMN completed_onboarding boolean DEFAULT false;