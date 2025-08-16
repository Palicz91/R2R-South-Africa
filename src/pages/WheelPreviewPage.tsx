import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Edit, ArrowLeft, Star, MapPin, Phone, Mail, Trophy } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import WheelOfFortune from '../components/WheelOfFortune';
import StarRating from '../components/StarRating';
import DisclaimerText from '../components/DisclaimerText';
import { useTranslation, type Language } from '../lib/translations';

interface WheelProject {
  id: string;
  name: string;
  description: string | null;
  prizes: Array<{
    label: string;
    probability: number;
    starred: boolean;
    coupon_code?: string; // Add this field
  }>;
  user_id: string;
  language: Language;
  disclaimer?: string;
  business_id: string;
  no_google_review?: boolean;
  qr_coupon_enabled?: boolean; // Add this field too
}

interface BusinessProfile {
  business_name: string;
  logo_url?: string;
  banner_url?: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
  primary_color: string;
}

export default function WheelPreviewPage() {
  const { id } = useParams();
  const [project, setProject] = useState<WheelProject | null>(null);
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const t = useTranslation(project?.language || 'en');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const { data: projectData, error: projectError } = await supabase
        .from('wheel_projects')
        .select('*')
        .eq('id', id)
        .single();

      if (projectError) throw projectError;
      if (!projectData) throw new Error('Project not found');

      setProject(projectData);

      // Use the business_id from the project data instead of localStorage
      if (!projectData.business_id) throw new Error('No business associated with this project');

      const { data: businessData, error: businessError } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('id', projectData.business_id) // Use the business_id from projectData
        .single();

      if (businessError) throw businessError;
      if (!businessData) throw new Error('Business profile not found');

      setBusiness(businessData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Error loading preview');
    } finally {
      setLoading(false);
    }
  };

  const formatProbability = (probability: number): string => {
    return `${Number(probability).toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !project || !business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Preview not available</h1>
          <p className="text-gray-600 mb-6">{error || 'Unable to load preview'}</p>
          <Link
            to="/wheels"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg
                     hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t.backToProjects || 'Back to Projects'}
          </Link>
        </div>
      </div>
    );
  }

  const defaultBanner = 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&auto=format&fit=crop&q=80';
  const defaultLogo = 'https://placehold.co/200x200?text=' + encodeURIComponent(business.business_name.charAt(0));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{project.name}</h1>
            <p className="text-gray-600">{t.previewOfGuests || 'Preview of what your guests will see'}</p>
          </div>
          <Link
            to={`/wheels/${project.id}/edit`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg
                     hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-5 h-5 mr-2" />
            {t.editProject || 'Edit Project'}
          </Link>
        </div>
      </div>

      {/* Guest Preview */}
      <div className="border-t border-gray-200">
        <div className="relative">
          {/* Banner with Logo */}
          <div className="relative aspect-[18/10] max-h-[600px] w-full">
            <div className="absolute inset-0">
              <img
                src={business.banner_url || defaultBanner}
                alt={`${business.business_name} banner`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60"></div>
            </div>

            <div className="absolute left-1/2 -bottom-16 -translate-x-1/2">
              <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-white shadow-xl bg-white p-2">
                <img
                  src={business.logo_url || defaultLogo}
                  alt={`${business.business_name} logo`}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto px-4">
            <div className="relative mt-24 bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="p-6">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
                  {business.business_name}
                </h2>

                {business.description && (
                  <p className="text-gray-600 text-center mb-6">{business.description}</p>
                )}

                {(business.address || business.phone || business.email) && (
                  <div className="space-y-2 mb-8 text-center">
                    {business.address && (
                      <div className="flex items-center justify-center gap-2 text-gray-600">
                        <MapPin className="w-5 h-5" />
                        <span>{business.address}</span>
                      </div>
                    )}
                    {business.phone && (
                      <div className="flex items-center justify-center gap-2 text-gray-600">
                        <Phone className="w-5 h-5" />
                        <span>{business.phone}</span>
                      </div>
                    )}
                    {business.email && (
                      <div className="flex items-center justify-center gap-2 text-gray-600">
                        <Mail className="w-5 h-5" />
                        <span>{business.email}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Csillagok és Google Review gomb csak akkor jelenik meg, ha a no_google_review nincs bekapcsolva */}
                {!project.no_google_review && (
                  <div className="flex flex-col items-center gap-2 mb-8">
                    <StarRating readonly size="lg" />
                    <span className="text-sm text-gray-500">{t.tapToRate}</span>
                  </div>
                )}

                {!project.no_google_review && (
                  <button
                    disabled
                    className="w-full py-4 px-6 rounded-xl text-white text-lg font-semibold
                             flex items-center justify-center gap-3
                             transform transition-all duration-200 shadow-lg
                             opacity-75 cursor-not-allowed"
                    style={{ backgroundColor: business.primary_color }}
                  >
                    <Trophy className="w-6 h-6" />
                    {t.leaveReview}
                  </button>
                )}

                <div className="mt-16 bg-white rounded-xl shadow-xl p-6 mb-8">
                  <WheelOfFortune 
                    prizes={project.prizes} 
                    wheelId={project.id} 
                    language={project.language} 
                  />

                  <div className="mt-16 border-t border-gray-100 pt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">{t.availablePrizes}</h4>
                    <div className="space-y-3">
                      {project.prizes.map((prize, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            {prize.starred && (
                              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                            )}
                            <span className="font-medium text-gray-900">
                              {prize.label}
                              {project.qr_coupon_enabled && prize.coupon_code && (
                                <span className="text-sm text-gray-500"> - {prize.coupon_code}</span>
                              )}
                            </span>
                          </div>
                          <span className="text-gray-600 tabular-nums">
                            {formatProbability(prize.probability)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {project.disclaimer && (
                  <div className="mt-6">
                    <DisclaimerText 
                      text={project.disclaimer} 
                      className="text-left whitespace-pre-line" // This added class will preserve line breaks
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
