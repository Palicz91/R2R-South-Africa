import { supabase } from './supabaseClient';
import { products } from '../stripe-config';

export async function createCheckoutSession(priceId: string, mode: 'subscription' | 'payment') {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        price_id: priceId,
        success_url: `${window.location.origin}/checkout/success`,
        cancel_url: `${window.location.origin}/checkout/cancel`,
        mode,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create checkout session');
    }

    const { url } = await response.json();
    if (!url) throw new Error('No checkout URL returned');

    window.location.href = url;
  } catch (err) {
    console.error('Error creating checkout session:', err);
    throw err;
  }
}

export async function getCurrentSubscription() {
  try {
    const { data, error } = await supabase
      .from('stripe_user_subscriptions')
      .select('*')
      .maybeSingle();

    if (error) throw error;

    if (!data) return null;

    // Find the product that matches the price_id
    const product = Object.values(products).find(p => p.priceId === data.price_id);

    return {
      ...data,
      productName: product?.name || 'Unknown Plan'
    };
  } catch (err) {
    console.error('Error fetching subscription:', err);
    return null;
  }
}

export async function getOrderHistory() {
  try {
    const { data, error } = await supabase
      .from('stripe_user_orders')
      .select('*')
      .order('order_date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching order history:', err);
    return [];
  }
}