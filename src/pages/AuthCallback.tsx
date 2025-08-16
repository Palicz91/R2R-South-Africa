import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

interface PendingReview {
  wheelId: string;
  reviewLink: string;
  businessId: string;
  rating: number;
  comment?: string;
}

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from the URL
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session) throw new Error('No session available');

        // Get the pending review data
        const pendingReviewStr = localStorage.getItem('pendingReview');
        if (!pendingReviewStr) {
          console.warn('No pending review found');
          navigate('/');
          return;
        }

        const pendingReview = JSON.parse(pendingReviewStr) as PendingReview;
        localStorage.removeItem('pendingReview');

        if (!pendingReview.wheelId || !pendingReview.reviewLink || !pendingReview.businessId) {
          throw new Error('Invalid review data');
        }

        // Save the review click
        const { error: clickError } = await supabase
          .from('review_clicks')
          .insert({
            wheel_id: pendingReview.wheelId,
            business_id: pendingReview.businessId,
            email: session.user.email,
            rating: pendingReview.rating,
            comment: pendingReview.comment || null,
          });

        if (clickError) throw clickError;

        // Redirect to Google review page with return URL
        const returnUrl = new URL(window.location.origin);
        returnUrl.pathname = `/review/${pendingReview.wheelId}`;
        returnUrl.searchParams.set('completed', 'true');

        const reviewUrl = new URL(pendingReview.reviewLink);
        reviewUrl.searchParams.set('return_url', returnUrl.toString());

        window.location.href = reviewUrl.toString();
      } catch (err) {
        console.error('Error in auth callback:', err);
        navigate('/');
      }
    };

    handleCallback();
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4" />
        <p className="text-gray-600">Redirecting to Google Reviews...</p>
      </div>
    </div>
  );
}