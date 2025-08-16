import { useState, useMemo } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from "framer-motion";
import Select from 'react-select';
import Confetti from 'react-confetti';
import { 
  UserIcon, 
  EnvelopeIcon, 
  GlobeAltIcon, 
  LinkIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

// Email validation helper
const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Field component with error support
const Field = ({ label, children, error }) => (
  <div className="block text-left mb-4">
    <span className="block text-sm font-semibold mb-2">{label}</span>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

// Inline translations
const translations = {
  en: {
    partnerForm: {
      title: "Become a Founding Partner",
      fullName: "Full name",
      fullNamePlaceholder: "John Doe",
      email: "Email",
      emailPlaceholder: "you@example.com",
      country: "Country / region",
      countryPlaceholder: "Select your country",
      customCountryPlaceholder: "Type your country",
      link: "LinkedIn / website (optional)",
      linkPlaceholder: "https://linkedin.com/in/you",
      hasNetwork: "Do you have an existing network in the hospitality industry?",
      yes: "YES",
      no: "NO",
      pitch: "Why would you be a great partner?",
      pitchPlaceholder: "Pitch yourself in max 300 characters (minimum 20)",
      submit: "Submit Application",
      cancel: "Cancel",
      sending: "Sending…",
      close: "Close",
      successTitle: "🎉 Thank you!",
      successDesc: "We'll get back within 24 hours.",
      yourData: "Your application details",
      errorGeneric: "Something went wrong. Please try again.",
      errorName: "Please enter your full name.",
      errorEmail: "Please enter a valid email.",
      errorCountry: "Please select a country.",
      errorCustomCountry: "Please type your country.",
      errorNote: "Minimum 20 characters required.",
      errorHasContacts: "Please select an option."
    }
  },
  hu: {
    partnerForm: {
      title: "Legyél alapító partner",
      fullName: "Teljes név",
      fullNamePlaceholder: "Kovács János",
      email: "Email",
      emailPlaceholder: "te@pelda.hu",
      country: "Ország / régió",
      countryPlaceholder: "Válaszd ki az országodat",
      customCountryPlaceholder: "Írd be az országodat",
      link: "LinkedIn / weboldal (opcionális)",
      linkPlaceholder: "https://linkedin.com/in/te",
      hasNetwork: "Van már kapcsolatrendszered a vendéglátóiparban?",
      yes: "IGEN",
      no: "NEM",
      pitch: "Miért lennél kiváló partner?",
      pitchPlaceholder: "Mutatkozz be maximum 300 karakterben (minimum 20)",
      submit: "Jelentkezés küldése",
      cancel: "Mégse",
      sending: "Küldés…",
      close: "Bezárás",
      successTitle: "🎉 Köszönjük!",
      successDesc: "24 órán belül visszajelzünk.",
      yourData: "A jelentkezésed adatai",
      errorGeneric: "Valami hiba történt. Kérjük próbáld újra.",
      errorName: "Kérjük add meg a teljes nevedet.",
      errorEmail: "Kérjük adj meg egy érvényes email címet.",
      errorCountry: "Kérjük válassz egy országot.",
      errorCustomCountry: "Kérjük írd be az országodat.",
      errorNote: "Minimum 20 karakter szükséges.",
      errorHasContacts: "Kérjük válassz egy opciót."
    }
  }
};

// Country options (A–Z) formatted for react-select
const countryOptions = [
  { value: "AR", label: "Argentina 🇦🇷" },
  { value: "AU", label: "Australia 🇦🇺" },
  { value: "BR", label: "Brazil 🇧🇷" },
  { value: "CA", label: "Canada 🇨🇦" },
  { value: "CH", label: "Switzerland 🇨🇭" },
  { value: "CL", label: "Chile 🇨🇱" },
  { value: "CO", label: "Colombia 🇨🇴" },
  { value: "DE", label: "Germany 🇩🇪" },
  { value: "ES", label: "Spain 🇪🇸" },
  { value: "FR", label: "France 🇫🇷" },
  { value: "GB", label: "United Kingdom 🇬🇧" },
  { value: "HR", label: "Croatia 🇭🇷" },
  { value: "HU", label: "Hungary 🇭🇺" },
  { value: "ID", label: "Indonesia 🇮🇩" },
  { value: "IL", label: "Israel 🇮🇱" },
  { value: "IT", label: "Italy 🇮🇹" },
  { value: "KW", label: "Kuwait 🇰🇼" },
  { value: "MY", label: "Malaysia 🇲🇾" },
  { value: "MX", label: "Mexico 🇲🇽" },
  { value: "NL", label: "Netherlands 🇳🇱" },
  { value: "PE", label: "Peru 🇵🇪" },
  { value: "PH", label: "Philippines 🇵🇭" },
  { value: "QA", label: "Qatar 🇶🇦" },
  { value: "SA", label: "Saudi Arabia 🇸🇦" },
  { value: "SG", label: "Singapore 🇸🇬" },
  { value: "TH", label: "Thailand 🇹🇭" },
  { value: "US", label: "United States 🇺🇸" },
  { value: "VN", label: "Vietnam 🇻🇳" },
  { value: "OTHER", label: "Other (type below)" }
];

const selectOptions = countryOptions.map(({ value, label }) => ({
  value,
  label: (
    <span className="flex items-center gap-2">
      <span>{label.split(' ').slice(-1)}</span> 
      {label.split(' ').slice(0, -1).join(' ')}
    </span>
  )
}));

export default function PartnerFormModal({ open, onClose }) {
  const { language } = useLanguage();
  
  // Use inline translations with fallback to English
  const t = translations[language] || translations.en;
  
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [customCountry, setCustomCountry] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", country: "", link: "", hasContacts: "", note: ""
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    country: false,
    hasContacts: false,
    note: false
  });

  const errors = useMemo(() => ({
    name: form.name.trim().length > 1 ? "" : t.partnerForm.errorName,
    email: emailRx.test(form.email) ? "" : t.partnerForm.errorEmail,
    country:
      form.country !== "OTHER"
        ? form.country ? "" : t.partnerForm.errorCountry
        : customCountry.trim().length > 1
        ? ""
        : t.partnerForm.errorCustomCountry,
    hasContacts: form.hasContacts ? "" : t.partnerForm.errorHasContacts,
    note: form.note.trim().length >= 20 ? "" : t.partnerForm.errorNote
  }), [form, customCountry, t]);

  const disabled = useMemo(() => {
    return loading || Object.values(errors).some(Boolean);
  }, [errors, loading]);

  const submit = async () => {
    // Mark all fields as touched to show all errors
    setTouched({
      name: true,
      email: true,
      country: true,
      hasContacts: true,
      note: true
    });

    if (disabled) return; // Don't submit if form is invalid

    setLoading(true);
    setError("");
    
    const payload = {
      ...form,
      country: form.country === "OTHER" ? customCountry.trim() : form.country
    };

    const { error } = await supabase.functions.invoke(
      "partner-application",
      { body: payload }
    );
    setLoading(false);
    if (error) {
      setError(t.partnerForm.errorGeneric);
    } else {
      setSent(true);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-white/10 backdrop-blur-lg ring-1 ring-white/20 p-4"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            className="relative w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl shadow-indigo-100 border-2 border-[#4FC3F7]/40 space-y-6 max-h-[90vh] overflow-y-auto"
            initial={{ y: 40, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            {sent ? (
              <>
                <div className="flex flex-col items-center text-center space-y-4 py-8">
                  <CheckCircleIcon className="w-16 h-16 text-green-500 shadow-lg rounded-full" />
                  <h3 className="text-3xl font-extrabold bg-gradient-to-r from-[#4FC3F7] to-indigo-500 bg-clip-text text-transparent">
                    {t.partnerForm.successTitle}
                  </h3>

                  <p className="text-gray-600 max-w-md">
                    {t.partnerForm.successDesc}
                  </p>

                  <div className="bg-gray-50 rounded-xl p-4 text-left w-full max-w-md shadow-inner border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {t.partnerForm.yourData}
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li><b>{t.partnerForm.fullName}:</b> {form.name}</li>
                      <li><b>{t.partnerForm.email}:</b> {form.email}</li>
                      <li><b>{t.partnerForm.country}:</b> {form.country}</li>
                    </ul>
                  </div>

                  <button
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-semibold hover:brightness-110 transition-all shadow-lg"
                    onClick={onClose}
                  >
                    {t.partnerForm.close}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-center bg-gradient-to-r from-[#4FC3F7] to-indigo-500 bg-clip-text text-transparent">
                  {t.partnerForm.title}
                </h3>

                <Field label={t.partnerForm.fullName} error={touched.name && errors.name}>
                  <div className={clsx(
                    "flex items-center border rounded-lg px-3 py-2 transition-all",
                    "focus-within:ring-2 focus-within:ring-[#4FC3F7] focus-within:shadow-md",
                    touched.name && errors.name ? "border-red-500" : "border-gray-300"
                  )}>
                    <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
                    <input
                      placeholder={t.partnerForm.fullNamePlaceholder}
                      className="flex-1 bg-transparent outline-none"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      onBlur={() => setTouched(t => ({ ...t, name: true }))}
                      required
                    />
                  </div>
                </Field>

                <Field label={t.partnerForm.email} error={touched.email && errors.email}>
                  <div className={clsx(
                    "flex items-center border rounded-lg px-3 py-2 transition-all",
                    "focus-within:ring-2 focus-within:ring-[#4FC3F7] focus-within:shadow-md",
                    touched.email && errors.email ? "border-red-500" : "border-gray-300"
                  )}>
                    <EnvelopeIcon className="w-4 h-4 mr-2 text-gray-400" />
                    <input
                      type="email"
                      placeholder={t.partnerForm.emailPlaceholder}
                      className="flex-1 bg-transparent outline-none"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      onBlur={() => setTouched(t => ({ ...t, email: true }))}
                      required
                    />
                  </div>
                </Field>

                <Field label={t.partnerForm.country} error={touched.country && errors.country}>
                  <div className="relative">
                    <GlobeAltIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400 z-10" />
                    <Select
                      options={selectOptions}
                      placeholder={t.partnerForm.countryPlaceholder}
                      value={selectOptions.find(opt => opt.value === form.country)}
                      onChange={(option) => setForm({ ...form, country: option?.value || "" })}
                      onBlur={() => setTouched(t => ({ ...t, country: true }))}
                      theme={theme => ({ 
                        ...theme, 
                        colors: { 
                          ...theme.colors, 
                          primary: '#4FC3F7',
                          primary25: '#4FC3F7/10'
                        } 
                      })}
                      styles={{
                        control: (base) => ({
                          ...base,
                          paddingLeft: '2rem',
                          border: touched.country && errors.country ? '1px solid #ef4444' : '1px solid #d1d5db',
                          '&:hover': {
                            border: touched.country && errors.country ? '1px solid #ef4444' : '1px solid #4FC3F7'
                          }
                        })
                      }}
                    />
                  </div>
                  {form.country === "OTHER" && (
                    <div className={clsx(
                      "flex items-center border rounded-lg px-3 py-2 mt-2 transition-all",
                      "focus-within:ring-2 focus-within:ring-[#4FC3F7] focus-within:shadow-md",
                      touched.country && errors.country ? "border-red-500" : "border-gray-300"
                    )}>
                      <input
                        placeholder={t.partnerForm.customCountryPlaceholder}
                        className="flex-1 bg-transparent outline-none"
                        value={customCountry}
                        onChange={e => setCustomCountry(e.target.value)}
                        onBlur={() => setTouched(t => ({ ...t, country: true }))}
                        required
                      />
                    </div>
                  )}
                </Field>

                <Field label={t.partnerForm.link}>
                  <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#4FC3F7] focus-within:shadow-md transition-all">
                    <LinkIcon className="w-4 h-4 mr-2 text-gray-400" />
                    <input
                      type="url"
                      placeholder={t.partnerForm.linkPlaceholder}
                      className="flex-1 bg-transparent outline-none"
                      value={form.link}
                      onChange={e => setForm({ ...form, link: e.target.value })}
                    />
                  </div>
                </Field>

                <Field label={t.partnerForm.hasNetwork} error={touched.hasContacts && errors.hasContacts}>
                  <div className="flex gap-4">
                    {["yes", "no"].map(v => (
                      <label key={v} className={clsx(
                        "flex-1 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all text-center font-medium",
                        form.hasContacts === v 
                          ? "bg-[#4FC3F7] text-white border-[#4FC3F7] shadow-lg" 
                          : "bg-white text-gray-700 border-gray-300 hover:border-[#4FC3F7]/50"
                      )}>
                        <input
                          type="radio"
                          className="hidden"
                          name="hasContacts"
                          value={v}
                          checked={form.hasContacts === v}
                          onChange={() => setForm({ ...form, hasContacts: v })}
                          onBlur={() => setTouched(t => ({ ...t, hasContacts: true }))}
                          required
                        />
                        <span>{t.partnerForm[v]}</span>
                      </label>
                    ))}
                  </div>
                </Field>

                <Field label={t.partnerForm.pitch} error={touched.note && errors.note}>
                  <div className={clsx(
                    "border rounded-lg p-3 transition-all",
                    "focus-within:ring-2 focus-within:ring-[#4FC3F7] focus-within:shadow-md",
                    touched.note && errors.note ? "border-red-500" : "border-gray-300"
                  )}>
                    <textarea
                      className="w-full h-28 resize-none bg-transparent outline-none"
                      maxLength={300}
                      placeholder={t.partnerForm.pitchPlaceholder}
                      value={form.note}
                      onChange={e => setForm({ ...form, note: e.target.value })}
                      onBlur={() => setTouched(t => ({ ...t, note: true }))}
                      required
                    />
                    <div className="flex justify-end">
                      <span className={clsx(
                        "text-xs",
                        form.note.length > 290 ? "text-red-500" :
                        form.note.length > 260 ? "text-yellow-500" :
                        "text-gray-400"
                      )}>
                        {form.note.length}/300
                      </span>
                    </div>
                  </div>
                </Field>

                {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}

                <button
                  className={clsx(
                    "w-full py-3 rounded-xl text-white font-semibold transition-all",
                    "bg-gradient-to-r from-cyan-400 to-[#4FC3F7] bg-[length:200%_200%]",
                    !disabled && "hover:bg-[position:100%_0] hover:shadow-lg hover:scale-[1.02]",
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={disabled}
                  onClick={submit}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t.partnerForm.sending}
                    </span>
                  ) : (
                    t.partnerForm.submit
                  )}
                </button>

                <button
                  className="block mx-auto text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={onClose}
                >
                  {t.partnerForm.cancel}
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
