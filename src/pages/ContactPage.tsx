import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail, User, ArrowLeft, Loader2, CheckCircle, AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import Footer from '../components/Footer';
import PublicNavBar from '../components/PublicNavBar';

const translations = {
  en: {
    backHome: 'Back to Home',
    contactUs: 'Contact Us',
    contactIntro: "Whether you have a question or just want to share feedback—we'd love to hear from you.",
    founderNote: 'Our exclusive partner will personally respond to your message.',
    successMsg: "Thank you! We'll get back to you within 24 hours.",
    errorFields: 'All fields are required',
    errorEmail: 'Please enter a valid email address',
    topic: 'Topic',
    topics: {
      general: 'General',
      sales: 'Sales Inquiry',
      support: 'Technical Support',
      billing: 'Billing',
      partnership: 'Partnership',
    },
    fullName: 'Full Name',
    email: 'Email Address',
    message: 'Message',
    messagePlaceholder: `Tell us more – for example, "I'd like to know more about your pricing for multi-location businesses."`,
    send: 'Send Message',
    sending: 'Sending...',
    fallback: 'Prefer email? Reach us at',
  }
};

export default function ContactPage() {
  const t = translations.en;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: '',
    topic: 'General',
  });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;

    setSending(true);
    setError(null);
    setSuccess(false);

    try {
      const { fullName, email, message, topic } = formData;

      if (!fullName.trim() || !email.trim() || !message.trim()) {
        throw new Error(t.errorFields);
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error(t.errorEmail);
      }

      const { error: submitError } = await supabase
        .from('contact_messages')
        .insert({
          full_name: fullName.trim(),
          email: email.trim(),
          message: message.trim(),
          topic: topic.trim()
        });

      if (submitError) throw submitError;

      await supabase.functions.invoke('notify-contact-form', {
        body: { record: formData },
      });

      setSuccess(true);
      setFormData({ fullName: '', email: '', message: '', topic: t.topics.general });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      <PublicNavBar />

      <div className="flex-1">
        <div className="max-w-xl mx-auto px-4 py-12">
          {/* Back Link */}
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backHome}
          </Link>

          {/* Contact Card */}
          <div className="bg-white rounded-xl p-8 shadow-lg filter drop-shadow-[0_0_8px_rgba(79,195,247,0.2)]">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Alexandria, sans-serif' }}>{t.contactUs}</h1>
              <p className="text-gray-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>{t.contactIntro}</p>
            </div>

            {/* Team trust element */}
            <div className="mb-6 flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
              <img
                src="https://bnumwujvaribzfexpmmc.supabase.co/storage/v1/object/public/website-materials/photos/greig.jpeg"
                alt="Greig"
                className="w-20 h-20 rounded-full object-cover"
              />
              <p className="text-sm text-gray-700">
                {t.founderNote}
              </p>
            </div>

            {success && (
              <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {t.successMsg}
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {/* Topic */}
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                  {t.topic}
                </label>
                <select
                  id="topic"
                  value={formData.topic}
                  onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4FC3F7]"
                >
                  <option value={t.topics.general}>{t.topics.general}</option>
                  <option value={t.topics.sales}>{t.topics.sales}</option>
                  <option value={t.topics.support}>{t.topics.support}</option>
                  <option value={t.topics.billing}>{t.topics.billing}</option>
                  <option value={t.topics.partnership}>{t.topics.partnership}</option>
                </select>
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  {t.fullName}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-[#4FC3F7] focus:border-transparent"
                    placeholder="e.g. John Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {t.email}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-[#4FC3F7] focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  {t.message}
                </label>
                <textarea
                  id="message"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-[#4FC3F7] focus:border-transparent"
                  placeholder={t.messagePlaceholder}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={sending}
                className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent
                         rounded-lg text-white font-medium ${
                           sending
                             ? 'bg-[#4FC3F7]/70 cursor-not-allowed'
                             : 'bg-[#4FC3F7] hover:bg-[#33BFFF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4FC3F7]'
                         }`}
              >
                {sending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t.sending}
                  </>
                ) : (
                  t.send
                )}
              </button>
            </form>

            {/* Direct email fallback */}
            <div className="mt-6 text-center text-sm text-gray-500">
              {t.fallback} <a href="mailto:greig@reviewtorevenue.io" className="text-blue-600 hover:underline">greig@reviewtorevenue.io</a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}