import { useState, FormEvent, useEffect } from 'react';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Footer from '../components/Footer';
import PublicNavBar from '../components/PublicNavBar';
import CountryPicker, { DEFAULT_COUNTRY, Country } from '../components/CountryPicker';
import { parsePhoneNumberFromString, CountryCode, getExampleNumber } from 'libphonenumber-js';

type AuthMode = 'login' | 'register' | 'reset';

// ⬇️ Coupon validation constants and helper function
const VALID_COUPON = 'FOUNDERS30';
const cleanCoupon = (v: string) =>
  v.trim().toUpperCase().normalize('NFKC').replace(/[^A-Z0-9]/g, '');

const translations = {
  en: {
    welcome: 'Welcome back!',
    create: 'Create account',
    reset: 'Reset password',
    signIn: 'Sign in',
    signUp: 'Sign up',
    forgot: 'Forgot your password?',
    confirm: 'Confirm password',
    showPassword: 'Show password',
    trialNote: '✅ Signing up starts your 14-day free trial automatically.',
    placeholderEmail: 'you@example.com',
    placeholderPassword: '••••••••',
    emailLabel: 'Email address',
    passwordLabel: 'Password',
    confirmPasswordLabel: 'Confirm password',
    toggleToLogin: 'Log in',
    toggleToRegister: 'Sign up',
    repeatPasswordPlaceholder: 'Repeat your password',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    rememberPassword: "Remember your password?",
    phoneRequired: 'Phone number is required.',
    phoneRequiredShort: 'Please enter your phone number.',
    phoneInvalid: 'Please enter a valid phone number.',
  },
  hu: {
    welcome: 'Üdv újra itt!',
    create: 'Fiók létrehozása',
    reset: 'Jelszó visszaállítása',
    signIn: 'Bejelentkezés',
    signUp: 'Regisztrálok',
    forgot: 'Elfelejtetted a jelszavad?',
    confirm: 'Jelszó megerősítése',
    showPassword: 'Jelszó mutatása',
    trialNote: '✅ A regisztráció után automatikusan elindul a 14 napos ingyenes próbaidőszak.',
    placeholderEmail: 'te@pelda.hu',
    placeholderPassword: '••••••••',
    emailLabel: 'Email cím',
    passwordLabel: 'Jelszó',
    confirmPasswordLabel: 'Jelszó megerősítése',
    toggleToLogin: 'Bejelentkezés',
    toggleToRegister: 'Regisztráció',
    repeatPasswordPlaceholder: 'Ismételd meg a jelszavad',
    dontHaveAccount: "Nincs még fiókod?",
    alreadyHaveAccount: "Van már fiókod?",
    rememberPassword: "Emlékszel a jelszavadra?",
    phoneLabel: 'Telefonszám',
    phonePlaceholder: '+36 30 123 4567',
    phoneHelp: 'Kérjük, a terméket használó személy telefonszámát add meg – promócióval nem fogunk hívogatni, csak a gyorsabb technikai segítséghez szükséges.',
    phoneRequired: 'A telefonszám megadása kötelező a regisztrációhoz – promócióval nem fogunk hívogatni, csak a gyorsabb technikai segítséghez szükséges..',
    phoneRequiredShort: 'Kérjük, add meg a telefonszámod!',
    phoneInvalid: 'Érvénytelen telefonszám.',
  }
};

// Helper function for phone validation
function isValidLocal(country: Country, national: string) {
  const digits = national.replace(/[^\d]/g, '');
  if (!digits) return false;
  
  try {
    const phone = parsePhoneNumberFromString(digits, country.code as CountryCode);
    return phone?.isValid() ?? false;
  } catch {
    return false;
  }
}

// Helper function to get example placeholder for country
function getPlaceholderForCountry(country: Country): string {
  try {
    const example = getExampleNumber(country.code as CountryCode);
    if (example) {
      return example.formatNational();
    }
  } catch {
    // Fallback for specific countries
    switch (country.code) {
      case 'HU': return '30 123 4567';
      case 'US': 
      case 'CA': return '(555) 123-4567';
      case 'GB': return '07123 456789';
      case 'DE': return '030 12345678';
      case 'FR': return '01 23 45 67 89';
      default: return '123 456 789';
    }
  }
  return '123 456 789';
}

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();
  const t = translations[language];
  
  const defaultMode = searchParams.get('mode') as AuthMode | null;
  const redirect = searchParams.get('redirect');
  const [mode, setMode] = useState<AuthMode>(defaultMode || 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [localNumber, setLocalNumber] = useState(''); // digits after dial code
  const [phoneError, setPhoneError] = useState(false);
  const [couponCode, setCouponCode] = useState(''); // ⬅️ NEW COUPON STATE
  const [couponError, setCouponError] = useState<string | null>(null); // ⬅️ NEW COUPON ERROR STATE

  // Define consent text based on language
  const consentText = language === 'hu'
    ? {
        prefix: 'Elolvastam és elfogadom az ',
        privacy: 'Adatkezelési tájékoztatót',
        terms: 'ÁSZF-et',
        error: 'A regisztrációhoz el kell fogadnod a feltételeket.',
      }
    : {
        prefix: 'I\'ve read and agree to the ',
        privacy: 'Privacy Policy',
        terms: 'Terms & Conditions',
        error: 'To join us, you need to accept the terms.',
      };

  // Load coupon code from URL or localStorage
  useEffect(() => {
    const fromUrl = searchParams.get('coupon');
    if (fromUrl && !couponCode) {
      setCouponCode(fromUrl.toUpperCase());
    }
  }, [searchParams, couponCode]);

  // Handle redirect after successful auth
  useEffect(() => {
    const handleRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && redirect) {
        navigate(redirect);
      }
    };
    
    handleRedirect();
  }, [redirect, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // ⬇️ Use cleaned coupon validation
    const normalizedCoupon = cleanCoupon(couponCode);

    // Validate coupon for registration (fallback)
    if (mode === 'register') {
      if (normalizedCoupon && normalizedCoupon !== VALID_COUPON) {
        setCouponError(language === 'hu' ? 'Érvénytelen kuponkód.' : 'Invalid coupon code.');
        setLoading(false);
        return;
      } else {
        setCouponError(null);
      }
    }

    // Build full E.164 using proper parsing - only for Hungarian
    const fullPhone =
      language === 'hu'
        ? (
            parsePhoneNumberFromString(localNumber, country.code as CountryCode)
              ? parsePhoneNumberFromString(localNumber, country.code as CountryCode)!.number
              : `${country.dial}${localNumber.replace(/[^\d]/g, '')}`
          )
        : undefined;           // más nyelvnél ne is próbálkozzunk

    // Phone validation for registration - only for Hungarian
    if (mode === 'register' && language === 'hu' && !localNumber.trim()) {
      setPhoneError(true);
      setLoading(false);
      return;
    }

    // Enhanced phone validation using the helper function - only for Hungarian
    if (mode === 'register' && language === 'hu' && !isValidLocal(country, localNumber)) {
      setPhoneError(true);
      setLoading(false);
      return;
    }

    // Validate terms acceptance for registration
    if (mode === 'register' && !acceptedTerms) {
      setTermsError(true);
      setLoading(false);
      return;
    }

    try {
      let response;
      if (mode === 'login') {
        try {
          response = await supabase.auth.signInWithPassword({ email, password });
          console.log("Sign-in response:", response);
          if (response.error) throw response.error;
          
          // Navigate after successful login
          navigate(redirect || '/');
        } catch (loginError) {
          console.error("Login error:", loginError);
          throw loginError;
        }
      } else if (mode === 'register') {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }

        try {
          response = await supabase.auth.signUp({ email, password });
          console.log("Sign-up response:", response);
          if (response.error) throw response.error;

          try {
            const loginResponse = await supabase.auth.signInWithPassword({ email, password });
            console.log("Login after sign-up response:", loginResponse);
            if (loginResponse.error) throw loginResponse.error;

            // Track StartTrial event with Facebook Pixel
            if (window.fbq) {
              window.fbq('track', 'StartTrial');
            }

            // Call the edge function with the global language and phone
            const res = await fetch('https://bnumwujvaribzfexpmmc.supabase.co/functions/v1/create-initial-subscription', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${loginResponse.data.session.access_token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                language, 
                affiliate_ref: localStorage.getItem('affiliate_ref') || null,
                phone: language === 'hu' ? fullPhone : undefined,
                coupon_code: normalizedCoupon === VALID_COUPON ? normalizedCoupon : undefined, // ⬅️ USE CLEANED COUPON
              }),
            });

            const json = await res.json();
            console.log('[Edge Function response]', res.status, json);

            // Handle edge function errors
            if (!res.ok || json?.success === false) {
              throw new Error(json?.error || 'Trial initialization failed');
            }

            // Notify affiliate (csak ha van ref)
            const affiliateRef = localStorage.getItem('affiliate_ref');
            if (affiliateRef) {
              fetch(
                'https://bnumwujvaribzfexpmmc.supabase.co/functions/v1/notify-affiliate',
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },   // ← nincs Authorization
                  body: JSON.stringify({
                    affiliate_ref: affiliateRef,
                    new_user_email: email,
                  }),
                }
              ).catch((e) => console.warn('Notify-affiliate failed:', e));
            }

            navigate('/onboarding');
          } catch (autoLoginError) {
            console.error("Auto-login after registration error:", autoLoginError);
            throw new Error('Account created but automatic login failed. Please log in manually.');
          }
        } catch (registrationError) {
          console.error("Registration error:", registrationError);
          throw registrationError;
        }
      } else if (mode === 'reset') {
        try {
          response = await supabase.auth.resetPasswordForEmail(email);
          console.log("Password reset response:", response);
          if (response.error) throw response.error;
          
          setSuccess('If an account exists, you will receive a password reset email.');
          setMode('login');
        } catch (resetError) {
          console.error("Password reset error:", resetError);
          throw resetError;
        }
      }
    } catch (err) {
      console.error("Error during form submission:", err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      if (mode === 'reset') {
        setPassword('');
      }
    }
  };

  // ⬇️ Use cleaned coupon for 30-day display, but don't show 30 if there's an error
  const shows30 = !couponError && cleanCoupon(couponCode) === VALID_COUPON;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      <PublicNavBar />
      
      <div className="flex-grow flex items-center justify-center p-4 py-12 md:py-16">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Alexandria, sans-serif' }}>
              {mode === 'login' ? t.welcome : mode === 'register' ? t.create : t.reset}
            </h2>
            <p className="mt-2 text-sm text-gray-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {mode === 'login' ? (
                <>
                  {t.dontHaveAccount}{' '}
                  <button
                    onClick={() => setMode('register')}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {t.toggleToRegister}
                  </button>
                </>
              ) : mode === 'register' ? (
                <>
                  {t.alreadyHaveAccount}{' '}
                  <button
                    onClick={() => setMode('login')}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {t.toggleToLogin}
                  </button>
                </>
              ) : (
                <>
                  {t.rememberPassword}{' '}
                  <button
                    onClick={() => setMode('login')}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {t.toggleToLogin}
                  </button>
                </>
              )}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-800 p-4 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-800 p-4 rounded-lg">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {t.emailLabel}
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             placeholder-gray-400"
                    placeholder={t.placeholderEmail}
                  />
                </div>
              </div>

              {/* Phone field */}
              {language === 'hu' && mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t.phoneLabel}
                  </label>

                  <div className="flex items-center gap-2 mt-1">
                    <CountryPicker value={country} onChange={setCountry} />

                    <input
                      type="tel"
                      inputMode="tel"
                      pattern="[0-9+\-\(\) ]+"
                      value={localNumber}
                      onChange={(e) => {
                        setLocalNumber(e.target.value);
                        if (phoneError) setPhoneError(false);
                      }}
                      onBlur={() => {
                        if (localNumber.trim()) {
                          setPhoneError(!isValidLocal(country, localNumber));
                        }
                      }}
                      placeholder={getPlaceholderForCountry(country)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {phoneError && <p className="text-red-600 text-sm mt-1">{t.phoneInvalid}</p>}
                  <p className="text-xs text-gray-500 mt-1">{t.phoneHelp}</p>
                </div>
              )}

              {mode !== 'reset' && (
                <>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      {t.passwordLabel}
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               placeholder-gray-400"
                        placeholder={t.placeholderPassword}
                      />
                    </div>
                  </div>

                  {mode === 'register' && (
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        {t.confirmPasswordLabel}
                      </label>
                      <input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               placeholder-gray-400"
                        placeholder={t.repeatPasswordPlaceholder}
                      />
                    </div>
                  )}

                  <div className="flex items-center mt-2">
                    <input
                      id="showPassword"
                      type="checkbox"
                      className="mr-2"
                      checked={showPassword}
                      onChange={() => setShowPassword((prev) => !prev)}
                    />
                    <label htmlFor="showPassword" className="text-sm text-gray-600">
                      {t.showPassword}
                    </label>
                  </div>
                </>
              )}

              {/* ⬇️ Moved Coupon Code field after password fields */}
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {language === 'hu' ? 'Kuponkód (opcionális)' : 'Coupon code (optional)'}
                  </label>
                  <input
                    type="text"
                    autoComplete="off"
                    spellCheck={false}
                    inputMode="text"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase().trimStart());
                      if (couponError) setCouponError(null);
                    }}
                    onBlur={() => {
                      const cleaned = cleanCoupon(couponCode);
                      if (cleaned && cleaned !== VALID_COUPON) {
                        setCouponError(language === 'hu' ? 'Érvénytelen kuponkód.' : 'Invalid coupon code.');
                      } else {
                        setCouponError(null);
                      }
                    }}
                    onKeyDown={(e) => { 
                      if (e.key === ' ') e.preventDefault(); 
                    }}
                    aria-invalid={!!couponError}
                    aria-describedby="coupon-error"
                    placeholder={language === 'hu' ? 'Pl.: KUPON30' : 'e.g., COUPON30'}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {couponError && (
                    <p id="coupon-error" className="text-red-600 text-sm mt-1">{couponError}</p>
                  )}
                </div>
              )}
            </div>

            {mode === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setMode('reset')}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {t.forgot}
                </button>
              </div>
            )}

            {mode === 'register' && (
              <div className="mt-4 space-y-1 text-sm">
                <div className="flex items-start gap-2">
                  <input
                    id="terms-checkbox"
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => {
                      setAcceptedTerms(e.target.checked);
                      if (e.target.checked) setTermsError(false);
                    }}
                    className="mt-1"
                  />
                  <label htmlFor="terms-checkbox" className="text-gray-600">
                    {consentText.prefix}
                    <a href="/privacy" target="_blank" className="text-blue-600 hover:underline">{consentText.privacy}</a>
                    {' és '}
                    <a href="/terms" target="_blank" className="text-blue-600 hover:underline">{consentText.terms}</a>
                  </label>
                </div>
                {termsError && (
                  <p className="text-red-600 mt-1">{consentText.error}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !!couponError}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg
                       text-white font-medium ${
                         loading || couponError
                           ? 'bg-blue-400 cursor-not-allowed'
                           : 'bg-[#4FC3F7] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                       }`}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                mode === 'login' ? t.signIn : mode === 'register' ? t.create : t.reset
              )}
            </button>

            {mode === 'register' && (
              <p className="text-sm text-gray-500 text-center mt-3">
                {language === 'hu'
                  ? `✅ A regisztráció ${shows30 ? '30' : '14'} napos ingyenes próbaidőszakot indít.`
                  : `✅ Signing up starts a ${shows30 ? '30' : '14'}-day free trial.`}
              </p>
            )}
          </form>
        </div>
      </div>

      <div className="py-6 md:py-8">
        <Footer />
      </div>
    </div>
  );
}