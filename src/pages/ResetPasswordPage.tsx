import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import PublicNavBar from '../components/PublicNavBar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

const resetPasswordTranslations = {
  en: {
    title: 'Reset Your Password',
    success: '✅ Password successfully updated. Redirecting to dashboard...',
    new_password: 'New Password',
    confirm_password: 'Confirm Password',
    mismatch: 'Passwords do not match',
    invalid_link: 'Invalid or expired link – please request a new reset email.',
    submit: 'Set New Password',
  },
  hu: {
    title: 'Új jelszó beállítása',
    success: '✅ A jelszó sikeresen frissítve. Átirányítás a fiókhoz...',
    new_password: 'Új jelszó',
    confirm_password: 'Új jelszó megerősítése',
    mismatch: 'A megadott jelszavak nem egyeznek',
    invalid_link: 'Érvénytelen vagy lejárt link – kérj új jelszó-visszaállító e-mailt.',
    submit: 'Jelszó beállítása',
  },
};

export default function ResetPasswordPage() {
  const nav = useNavigate();
  const { search } = useLocation();          //  ?token=…&email=…&type=recovery
  const [pwd, setPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(true);
  
  const { language } = useLanguage();
  const t = resetPasswordTranslations[language];

  // 1.  verifyOtp  →  létrejön a session
  useEffect(() => {
    const qs = new URLSearchParams(search);
    const token = qs.get('token');
    const email = qs.get('email');
    const type = qs.get('type');

    if (type === 'recovery' && token && email) {
      supabase.auth
        .verifyOtp({ email, token, type: 'recovery' })
        .then(({ error }) => error && setErr(error.message))
        .finally(() => setBusy(false));
    } else {
      setErr(t.invalid_link);
      setBusy(false);
    }
  }, [search, t.invalid_link]);

  // 2.  új jelszó mentése
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pwd !== confirmPwd) {
      setErr(t.mismatch);
      return;
    }
    
    const { error } = await supabase.auth.updateUser({ password: pwd });
    if (error) { setErr(error.message); return; }
    setDone(true);
    setTimeout(() => nav('/dashboard'), 2500);
  };

  if (busy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavBar />
      <main className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center font-sans">
            {t.title}
          </h1>

          {done ? (
            <p className="text-green-600 text-center">
              {t.success}
            </p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  {t.new_password}
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">
                  {t.confirm_password}
                </label>
                <input
                  id="confirm"
                  type="password"
                  required
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {err && <p className="text-red-600 text-sm text-center">⚠️ {err}</p>}

              <button
                type="submit"
                className="w-full py-3 px-6 rounded-lg text-white font-semibold bg-[#4FC3F7] hover:brightness-110 transition"
              >
                {t.submit}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
