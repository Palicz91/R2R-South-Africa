export interface BusinessProfile {
  id?: string;
  user_id: string;
  business_name: string;
  logo_url?: string;
  banner_url?: string;
  google_review_link?: string;
  primary_color?: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
  business_type?: 'restaurant' | 'barber-shop' | 'beauty-salon' | 'spa' | 'hotel-guesthouse' | 'cafe' | 'other';
  business_type_other?: string;
  employee_range?: '1-10' | '11-50' | '51-100' | '100+';
  primary_goal?: 'reviews' | 'filter' | 'recurring' | 'all' | 'other';
  primary_goal_other?: string;
  hear_about_us?: 'linkedin' | 'google' | 'instagram' | 'referral';
  monthly_review_goal?: number;
  completed_onboarding: boolean;
  created_at?: string;
  updated_at?: string;
}