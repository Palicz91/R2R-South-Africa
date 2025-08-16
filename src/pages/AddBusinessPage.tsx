import { useState, ChangeEvent } from 'react';
import { Building2, Image as ImageIcon, LinkIcon, Palette, MapPin, Phone, Mail, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import BusinessPreviewCard from '../components/BusinessPreviewCard';
import { v4 as uuidv4 } from 'uuid';
import { useBusiness } from '../context/BusinessContext';

interface BusinessProfile {
  id?: string;
  business_name: string;
  logo_url?: string;
  banner_url?: string;
  google_review_link: string;
  primary_color: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
}

export default function AddBusinessProfilePage() {
  const navigate = useNavigate();
  const { setSelectedBusinessId } = useBusiness();
  const [profile, setProfile] = useState<BusinessProfile>({
    business_name: '',
    google_review_link: '',
    primary_color: '#2563eb',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleImageUpload = async (
    event: ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'banner'
  ) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setSaving(true);
      setError(null);

      // Create a temporary ID for new business
      const tempId = uuidv4();
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}-${tempId}-${Date.now()}.${fileExt}`;
      
      // Upload file
      const { error: uploadError } = await supabase.storage
        .from('business-assets')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = await supabase.storage
        .from('business-assets')
        .getPublicUrl(fileName);

      if (!urlData?.publicUrl) {
        throw new Error('Failed to get public URL for uploaded file');
      }

      const updates = {
        ...(type === 'logo' ? { logo_url: urlData.publicUrl } : { banner_url: urlData.publicUrl }),
      };

      setProfile(prev => ({ ...prev, ...updates }));
      setSuccess('Image uploaded successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error uploading image');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const newBusinessId = uuidv4();

      const { error: insertError } = await supabase
        .from('business_profiles')
        .insert({
          ...profile,
          id: newBusinessId,
          user_id: user.id,
          completed_onboarding: true, // Set completed_onboarding to true by default
        });

      if (insertError) throw insertError;
      
      // Store the newly created business ID
      localStorage.setItem('selectedBusinessId', newBusinessId);
      setSelectedBusinessId(newBusinessId); // Update the context
      
      setSuccess('Business profile created successfully!');
      
      // Navigate to the business profile page after a short delay
      setTimeout(() => {
        navigate('/business-profile');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating business profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          {/* Form */}
          <div className="md:col-span-2">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Business Profile</h2>

              {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-4 bg-green-50 text-green-800 rounded-lg">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Required Fields Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Required Information</h3>
                  
                  {/* Business Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Business Name
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building2 className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        required
                        value={profile.business_name}
                        onChange={(e) =>
                          setProfile((prev) => ({ ...prev, business_name: e.target.value }))
                        }
                        className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm
                                 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Logo Image
                    </label>
                    <div className="mt-1 flex items-center gap-4">
                      {profile.logo_url && (
                        <img
                          src={profile.logo_url}
                          alt="Logo preview"
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      )}
                      <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300
                                      rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white
                                      hover:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500">
                        <ImageIcon className="h-5 w-5 mr-2 text-gray-400" />
                        Upload Logo
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'logo')}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Banner Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Banner Image
                    </label>
                    <div className="mt-1 flex items-center gap-4">
                      {profile.banner_url && (
                        <img
                          src={profile.banner_url}
                          alt="Banner preview"
                          className="h-12 w-24 rounded-lg object-cover"
                        />
                      )}
                      <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300
                                      rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white
                                      hover:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500">
                        <ImageIcon className="h-5 w-5 mr-2 text-gray-400" />
                        Upload Banner
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'banner')}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Google Review Link */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Google Review Link
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LinkIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="url"
                        required
                        value={profile.google_review_link}
                        onChange={(e) =>
                          setProfile((prev) => ({ ...prev, google_review_link: e.target.value }))
                        }
                        className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm
                                 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://g.page/r/..."
                      />
                    </div>
                  </div>

                  {/* Primary Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Primary Color
                    </label>
                    <div className="mt-1 flex items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Palette className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={profile.primary_color}
                          onChange={(e) =>
                            setProfile((prev) => ({ ...prev, primary_color: e.target.value }))
                          }
                          className="pl-10 block w-48 rounded-lg border-gray-300 shadow-sm
                                   focus:ring-blue-500 focus:border-blue-500"
                          placeholder="#2563eb"
                        />
                      </div>
                      <input
                        type="color"
                        value={profile.primary_color}
                        onChange={(e) =>
                          setProfile((prev) => ({ ...prev, primary_color: e.target.value }))
                        }
                        className="h-9 w-9 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Optional Fields Section */}
                <div className="pt-6 space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Contact Info & Description</h3>
                  
                  {/* Business Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Business Address (optional)
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={profile.address || ''}
                        onChange={(e) =>
                          setProfile((prev) => ({ ...prev, address: e.target.value }))
                        }
                        className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm
                                 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your business address"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number (optional)
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        value={profile.phone || ''}
                        onChange={(e) =>
                          setProfile((prev) => ({ ...prev, phone: e.target.value }))
                        }
                        className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm
                                 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Contact Email (optional)
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={profile.email || ''}
                        onChange={(e) =>
                          setProfile((prev) => ({ ...prev, email: e.target.value }))
                        }
                        className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm
                                 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="contact@yourbusiness.com"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Business Description (optional)
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <Info className="h-5 w-5 text-gray-400" />
                      </div>
                      <textarea
                        value={profile.description || ''}
                        onChange={(e) =>
                          setProfile((prev) => ({ ...prev, description: e.target.value }))
                        }
                        rows={4}
                        className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm
                                 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Tell customers about your business..."
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent
                             rounded-lg text-white font-medium ${
                               saving
                                 ? 'bg-blue-400 cursor-not-allowed'
                                 : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                             }`}
                >
                  {saving ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Create Business Profile'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-8 md:mt-0">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
            <div className="sticky top-8">
              <BusinessPreviewCard
                name={profile.business_name}
                logoUrl={profile.logo_url}
                bannerUrl={profile.banner_url}
                reviewLink={profile.google_review_link}
                primaryColor={profile.primary_color}
                address={profile.address}
                phone={profile.phone}
                email={profile.email}
                description={profile.description}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}