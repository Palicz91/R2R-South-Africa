
export interface Product {
  priceId: string;
  name: string;
  description: string;
  mode: 'subscription' | 'payment';
}

export const products: Record<string, Product> = {
  'free': {
    priceId: 'price_1ROEuTErKaxQZLKAz6EhPfLh',
    name: 'Free Plan',
    description: '1 business, 50 reviews / month, Basic analytics & support',
    mode: 'subscription'
  },
  'solo': {
    priceId: 'price_1ROEwkErKaxQZLKA91xsvEfA',
    name: 'Solo Plan Monthly',
    description: '1 business, Up to 3 Active Wheel of Fortunes, Up to 200 reviews / month, QR code customization, Review page customization, Priority email support, Video onboarding',
    mode: 'subscription'
  },
  'solo_yearly': {
    priceId: 'price_1ROGVBErKaxQZLKA8DowJBka',
    name: 'Solo Plan Yearly',
    description: '1 business, Up to 3 Active Wheel of Fortunes, Up to 200 reviews / month, QR code customization, Review page customization, Priority email support, Video onboarding',
    mode: 'subscription'
  },
  'growth': {
    priceId: 'price_1ROEyGErKaxQZLKAtHM1Jlz7',
    name: 'Growth Plan Monthly',
    description: 'Everything in Solo Plan, Up to 3 businesses, Up to 15 Active Wheels, Up to 1000 reviews / month, Custom branding, Custom prize weighting',
    mode: 'subscription'
  },
  'growth_yearly': {
    priceId: 'price_1ROGW0ErKaxQZLKA9dqMyVIZ',
    name: 'Growth Plan Yearly',
    description: 'Everything in Solo Plan, Up to 3 businesses, Up to 15 Active Wheels, Up to 1000 reviews / month, Custom branding, Custom prize weighting',
    mode: 'subscription'
  },
  'unlimited': {
    priceId: 'price_1ROEzSErKaxQZLKAmealiirt',
    name: 'Unlimited Plan Monthly',
    description: 'Everything in Growth Plan+, Unlimited businesses & reviews, Unlimited Wheel of Fortunes, Priority support (chat + email), Feature-request fast-lane, Personalized onboarding',
    mode: 'subscription'
  },
  'unlimited_yearly': {
    priceId: 'price_1ROGX0ErKaxQZLKARjyhVksE',
    name: 'Unlimited Plan Yearly',
    description: 'Everything in Growth Plan+, Unlimited businesses & reviews, Unlimited Wheel of Fortunes, Priority support (chat + email), Feature-request fast-lane, Personalized onboarding',
    mode: 'subscription'
  }
};
