const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function sendRewardEmail(
  email: string,
  prize: string,
  rewardCode: string,
  businessName: string,
  logoUrl: string,
  wheelId: string,
  language: string
) {
  try {
    // Validate parameters
    if (!email || !prize || !rewardCode || !wheelId) {
      throw new Error('Missing required parameters for sending email');
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/send-reward-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        email,
        prize,
        rewardCode,
        businessName: businessName || 'Our Business',
        logoUrl: logoUrl || '',
        wheelId,
        language,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const responseData = await response.json().catch(() => ({}));
    console.log('[EmailService] Email sent successfully:', responseData);
    return responseData;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown email service error';
    console.error('[EmailService] Error sending email:', errorMessage);
    throw new Error(errorMessage);
  }
}