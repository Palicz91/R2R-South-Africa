/*
  # Create playbook articles table and sample content

  1. New Tables
    - `playbook_articles`
      - `id` (uuid, primary key)
      - `slug` (text, unique)
      - `title` (text)
      - `description` (text)
      - `content` (text)
      - `cover_image` (text)
      - `category` (text, constrained)
      - `published` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policy for public to view published articles

  3. Sample Content
    - Add initial articles if they don't exist
*/

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Public can view published articles" ON playbook_articles;

-- Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS playbook_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  content text NOT NULL,
  cover_image text NOT NULL,
  category text NOT NULL,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_category CHECK (
    category = ANY (ARRAY[
      'getting-started',
      'best-practices',
      'case-studies',
      'templates',
      'integrations'
    ]::text[])
  )
);

-- Enable RLS
ALTER TABLE playbook_articles ENABLE ROW LEVEL SECURITY;

-- Create the policy
CREATE POLICY "Public can view published articles"
  ON playbook_articles
  FOR SELECT
  TO public
  USING (published = true);

-- Insert sample articles if they don't exist
DO $$
BEGIN
  -- Getting Started article
  IF NOT EXISTS (SELECT 1 FROM playbook_articles WHERE slug = 'getting-started-with-review-to-revenue') THEN
    INSERT INTO playbook_articles (
      slug,
      title,
      description,
      content,
      cover_image,
      category,
      published
    ) VALUES (
      'getting-started-with-review-to-revenue',
      'Getting Started with Review to Revenue',
      'Learn how to set up your first review collection campaign and start turning customer feedback into revenue.',
      '# Getting Started with Review to Revenue

## Welcome to Review to Revenue!

This guide will walk you through setting up your first review collection campaign using our innovative Wheel of Fortune system.

### 1. Set Up Your Business Profile

First, make sure your business profile is complete:
- Add your business name and logo
- Set your brand colors
- Add your Google Review link

### 2. Create Your First Wheel

The Wheel of Fortune is the heart of Review to Revenue. Here''s how to create one:
- Click "Create New Wheel" in your dashboard
- Add your prizes (we recommend 6-8 different options)
- Set prize probabilities
- Customize the appearance

### 3. Generate QR Codes

Once your wheel is ready:
- Go to the QR Code section
- Download your unique QR code
- Print and place it strategically in your business

### 4. Monitor Results

Track your success in the dashboard:
- View review statistics
- Monitor prize claims
- Analyze customer engagement

## Best Practices

- Place QR codes near exits or payment areas
- Train staff to encourage participation
- Regularly update prizes to maintain excitement
- Monitor and respond to all reviews promptly

## Need Help?

Contact our support team at hello@reviewtorevenue.io for assistance.',
      'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=1200&auto=format&fit=crop&q=80',
      'getting-started',
      true
    );
  END IF;

  -- Prize Wheel Engagement article
  IF NOT EXISTS (SELECT 1 FROM playbook_articles WHERE slug = 'maximizing-prize-wheel-engagement') THEN
    INSERT INTO playbook_articles (
      slug,
      title,
      description,
      content,
      cover_image,
      category,
      published
    ) VALUES (
      'maximizing-prize-wheel-engagement',
      'Maximizing Prize Wheel Engagement',
      'Learn proven strategies to optimize your prize wheel for maximum customer participation and review generation.',
      '# Maximizing Prize Wheel Engagement

## The Psychology of Rewards

Understanding how rewards motivate customers is key to maximizing engagement with your Review to Revenue wheel.

### Prize Selection Strategy

1. **Balance Prize Value**
   - Mix high-value and frequent-win prizes
   - Keep rewards relevant to your business
   - Consider seasonal variations

2. **Optimal Prize Distribution**
   - 50% small but valuable rewards
   - 30% medium-value prizes
   - 20% high-value special prizes

3. **Psychology of Winning**
   - Everyone loves instant gratification
   - Create a sense of exclusivity
   - Make redemption easy and immediate

## Implementation Tips

### Physical Placement

- Position QR codes at eye level
- Place near natural waiting areas
- Ensure good lighting for scanning
- Add clear, engaging instructions

### Staff Training

- Train staff to explain the process
- Create scripts for consistent messaging
- Set engagement goals
- Celebrate successful reviews

## Measuring Success

Track these key metrics:
- Scan to review conversion rate
- Prize claim rate
- Return customer percentage
- Review sentiment trends

## Advanced Strategies

1. **Limited Time Offers**
   - Run special wheel configurations
   - Create urgency with time-limited prizes
   - Promote special occasions

2. **Social Proof**
   - Display recent winners
   - Share success stories
   - Highlight best reviews

Remember: The key to success is continuous optimization based on your specific customer base and business type.',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
      'best-practices',
      true
    );
  END IF;
END $$;