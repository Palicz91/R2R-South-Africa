import { Link } from 'react-router-dom';
import { Mail, Phone, Building2, MapPin } from 'lucide-react';
import { FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa';

const footerTranslations = {
  en: {
    contact: "Contact Us",
    company: "Company",
    legal: "Legal",
    terms: "Terms & Conditions",
    privacy: "Privacy Policy",
    rights: "All rights reserved."
  }
};

export default function Footer() {
  const t = footerTranslations.en;
  const instagramUrl = 'https://www.instagram.com/reviewtorevenue/';
  const youtubeUrl = 'https://www.youtube.com/@ReviewToRevenueIo';

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
                <a href="mailto:greig@reviewtorevenue.io" className="hover:text-gray-900">
                  greig@reviewtorevenue.io
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-1 flex-shrink-0" />
                <a href="tel:+27633641780" className="hover:text-gray-900">
                  Greig – (+27) 0 63 364 1780
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
