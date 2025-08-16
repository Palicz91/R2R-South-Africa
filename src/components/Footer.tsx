import { Link } from 'react-router-dom';
import { Mail, Phone, Building2, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { FaLinkedin, FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa';

const footerTranslations = {
  en: {
    contact: "Contact Us",
    company: "Company",
    legal: "Legal",
    terms: "Terms & Conditions",
    privacy: "Privacy Policy",
    rights: "All rights reserved."
  },
  hu: {
    contact: "Kapcsolat",
    company: "Céginformációk",
    legal: "Jogi tudnivalók",
    terms: "ÁSZF",
    privacy: "Adatvédelmi Irányelvek",
    rights: "Minden jog fenntartva."
  }
};

export default function Footer() {
  const { language } = useLanguage();
  const t = footerTranslations[language];

  const instagramUrl = language === 'hu'
    ? 'https://www.instagram.com/reviewtorevenue_hungary/'
    : 'https://www.instagram.com/reviewtorevenue/';

  const youtubeUrl = 'https://www.youtube.com/@ReviewToRevenueIo';
  const showFacebook = language === 'hu';

  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t.contact}</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-1 flex-shrink-0" />
                <a href="mailto:hello@reviewtorevenue.io" className="hover:text-gray-900">
                  hello@reviewtorevenue.io
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-1 flex-shrink-0" />
                <a href="tel:+4915143369633" className="hover:text-gray-900">
                  +49 151 433 69 633
                </a>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex gap-4 mt-6 text-gray-600">
              <a
                href="https://www.linkedin.com/company/review-to-revenue-2"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900 text-xl"
              >
                <FaLinkedin />
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900 text-xl"
              >
                <FaInstagram />
              </a>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900 text-xl"
              >
                <FaYoutube />
              </a>
              {showFacebook && (
                <a
                  href="https://www.facebook.com/reviewtorevenue"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-900 text-xl"
                >
                  <FaFacebook />
                </a>
              )}
            </div>
          </div>

          {/* Company Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t.company}</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 mt-1 flex-shrink-0" />
                <div>Palicz Growth Solutions LP</div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <address className="not-italic">
                  2967 Dundas Street West,<br />
                  Suite 63, Toronto,<br />
                  Ontario, M6P1Z2, Canada
                </address>
              </div>
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t.legal}</h3>
            <div className="space-y-3">
              <Link
                to="/terms"
                className="block text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {t.terms}
              </Link>
              <Link
                to="/privacy"
                className="block text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {t.privacy}
              </Link>
              <p className="text-sm text-gray-500 mt-6">
                © {new Date().getFullYear()} Review to Revenue.<br />
                {t.rights}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
