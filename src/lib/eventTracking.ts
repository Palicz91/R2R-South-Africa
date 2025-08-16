import { supabase } from './supabaseClient';

type ValidEventType =
  | 'qr_scan'
  | 'google_cta_click'
  | 'rating_collected'
  | 'low_rating'
  | 'wheel_spin'
  | 'prize_awarded'
  | 'email_saved'
  | 'email_sent'
  | 'qr_code_updated'
  | 'honesty_check_ok';

export async function logFlowEvent(
  wheelId: string,
  event: ValidEventType,
  extra: Record<string, any> = {}
) {
  try {
    // Log the event in flow_events table
    const { error: eventError } = await supabase
      .from('flow_events')
      .insert({
        wheel_id: wheelId,
        event,
        metadata: extra,
        ts: new Date().toISOString()
      });

    if (eventError) throw eventError;

    // If this is a rating event, also log it in the review_ratings table
    if (event === 'rating_collected' && typeof extra.rating === 'number') {
      const { error: ratingError } = await supabase
        .from('review_ratings')
        .insert({
          wheel_id: wheelId,
          rating: extra.rating
        });

      if (ratingError) throw ratingError;
    }
  } catch (err) {
    console.error('Error logging flow event:', err);
    throw err; // Re-throw to allow handling by caller
  }
}