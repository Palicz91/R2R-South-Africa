import { Star, MapPin, Phone, Mail } from 'lucide-react';

interface BusinessPreviewCardProps {
  name: string;
  logoUrl?: string;
  bannerUrl?: string;
  reviewLink?: string; // ← now optional
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
}

export function BusinessPreviewCard({
  name,
  logoUrl,
  bannerUrl,
  reviewLink,
  address,
  phone,
  email,
  description,
}: BusinessPreviewCardProps) {
  const defaultBanner = 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&auto=format&fit=crop&q=80';
  const defaultLogo = 'https://placehold.co/200x200?text=' + encodeURIComponent(name.charAt(0));

  return (
    <div className="w-full max-w-2xl mx-auto overflow-hidden rounded-xl shadow-lg bg-white">
      <div className="relative">
        {/* Banner Image */}
        <div className="w-full aspect-[21/9] md:aspect-[18/10] max-h-[600px] overflow-hidden bg-gray-100 rounded-t-xl">
          <img
            src={bannerUrl || defaultBanner}
            alt={`${name} banner`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Logo */}
        <div className="absolute -bottom-12 left-6">
          <div className="w-24 h-24 rounded-xl overflow-hidden border-4 border-white shadow-lg">
            <img
              src={logoUrl || defaultLogo}
              alt={`${name} logo`}
              className="w-full h-full object-cover bg-white"
            />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stars */}
        <div className="flex items-center gap-1 mb-6 business-card-stars">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-5 h-5 fill-yellow-400 text-yellow-400"
            />
          ))}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 text-center">{name}</h2>

        {/* Description */}
        {description && (
          <p className="text-gray-700 text-center">{description}</p>
        )}

        {/* Address, email, phone */}
        <div className="text-sm text-gray-600 space-y-1 text-left">
          {address && <p><MapPin className="inline w-4 h-4 mr-1" /> {address}</p>}
          {phone && <p><Phone className="inline w-4 h-4 mr-1" /> {phone}</p>}
          {email && <p><Mail className="inline w-4 h-4 mr-1" /> {email}</p>}
        </div>

        {/* Leave a Review button - conditional rendering */}
        {reviewLink && (
          <a
            href={reviewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-3 px-4 rounded-lg font-medium text-white transition-transform hover:scale-105 business-card-review-button"
            style={{ backgroundColor: '#4FC3F7' }}
          >
            Leave a Review
          </a>
        )}
      </div>
    </div>
  );
}

export default BusinessPreviewCard