import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import { supabase } from '../lib/supabaseClient';
import { useBusiness } from '../context/BusinessContext';
import { useLanguage } from '../context/LanguageContext';

const onboardingTranslations = {
  en: {
    step1Title: "What type of business do you run?",
    businessName: "Business name",
    selectBusinessType: "Select business type...",
    specifyBusinessType: "Please specify",
    countryLabel: "Business country",
    suggested: "Suggested",

    step2Title: "How many employees do you have?",
    selectRange: "Select range",
    range1: "1–10 employees",
    range2: "11–50 employees",
    range3: "51–100 employees",
    range4: "100+ employees",

    step3Title: "What's your main goal?",
    selectGoal: "Select goal",
    goalReviews: "Get more reviews",
    goalFilter: "Filter negative feedback",
    goalRecurring: "Increase recurring customers",
    goalAll: "All of the above",
    goalOther: "Other",
    specifyGoal: "Please specify",

    step4Title: "Almost done!",
    hearAboutUs: "How did you hear about us?",
    selectOption: "Select option",
    channelLinkedIn: "LinkedIn",
    channelGoogle: "Google",
    channelInstagram: "Instagram",
    channelFacebook: "Facebook",
    channelNewsletter: "Newsletter",
    channelReferral: "Referral",
    monthlyGoalLabel: "Monthly review goal (optional)",
    monthlyGoalPlaceholder: "e.g., 50",

    progressLabel: "Step {current} of {total}",
    skip: "Skip for now",
    back: "Back",
    next: "Next",
    complete: "Complete Setup",
    saving: "Saving..."
  },

  hu: {
    step1Title: "Milyen típusú vállalkozást vezetsz?",
    businessName: "Vállalkozás neve",
    selectBusinessType: "Válaszd ki a vállalkozás típusát...",
    specifyBusinessType: "Add meg a típusát",
    countryLabel: "Ország",
    suggested: "Javasolt",

    step2Title: "Hány alkalmazottad van?",
    selectRange: "Válassz tartományt",
    range1: "1–10 fő",
    range2: "11–50 fő",
    range3: "51–100 fő",
    range4: "100+ fő",

    step3Title: "Mi a fő célod?",
    selectGoal: "Válassz célt",
    goalReviews: "Több értékelés gyűjtése",
    goalFilter: "Negatív visszajelzések kiszűrése",
    goalRecurring: "Visszatérő vásárlók számának növelése",
    goalAll: "Mindezek együtt",
    goalOther: "Egyéb",
    specifyGoal: "Írd le pontosan",

    step4Title: "Már csak egy lépés!",
    hearAboutUs: "Honnan hallottál rólunk?",
    selectOption: "Válassz egy lehetőséget",
    channelLinkedIn: "LinkedIn",
    channelGoogle: "Google",
    channelInstagram: "Instagram",
    channelFacebook: "Facebook",
    channelNewsletter: "Hírlevél",
    channelReferral: "Ajánlás",
    monthlyGoalLabel: "Havi értékelési cél (nem kötelező)",
    monthlyGoalPlaceholder: "pl. 50",

    progressLabel: "{current}. lépés / {total}",
    skip: "Kihagyom most",
    back: "Vissza",
    next: "Tovább",
    complete: "Beállítások mentése",
    saving: "Mentés..."
  }
};

const validationSchema = Yup.object().shape({
  business_name: Yup.string()
    .min(2, 'Business name must be at least 2 characters')
    .required('Business name is required'),
  business_type: Yup.string()
    .oneOf(['restaurant', 'barber-shop', 'beauty-salon', 'spa', 'hotel-guesthouse', 'cafe', 'other'])
    .required('Please select your business type'),
  business_type_other: Yup.string()
    .when('business_type', {
      is: 'other',
      then: () => Yup.string().min(3, 'Please describe your business type').required('Please describe your business type'),
    }),
  employee_range: Yup.string()
    .oneOf(['1-10', '11-50', '51-100', '100+'])
    .required('Please select your employee range'),
  primary_goal: Yup.string()
    .oneOf(['reviews', 'filter', 'recurring', 'all', 'other'])
    .required('Please select your primary goal'),
  primary_goal_other: Yup.string()
    .when('primary_goal', {
      is: (value: string) => value === 'other',
      then: () => Yup.string().min(3, 'Please describe your goal').required('Please describe your goal'),
      otherwise: () => Yup.string().notRequired(),
    }),
  hear_about_us: Yup.string()
    .oneOf(['linkedin', 'google', 'instagram', 'facebook', 'newsletter', 'referral'])
    .required('Please tell us how you heard about us'),
  monthly_review_goal: Yup.number()
    .min(1, 'Must be at least 1')
    .max(10000, 'Must be less than 10,000')
    .nullable(),
  country: Yup.object().nullable(),
});

export default function OnboardingWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const { setSelectedBusinessId } = useBusiness();
  const [suggestedCountry, setSuggestedCountry] = useState('');
  const [countryOptions, setCountryOptions] = useState<{value: string, label: string}[]>([]);
  const { language, setLanguage } = useLanguage();

  const t = onboardingTranslations[language];

  const initialValues = {
    business_name: '',
    business_type: '',
    business_type_other: '',
    employee_range: '',
    primary_goal: '',
    primary_goal_other: '',
    hear_about_us: '',
    monthly_review_goal: null as number | null,
    country: null as {value: string, label: string} | null,
  };

  // Load countries from REST Countries API
  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name,cca2')
      .then(res => res.json())
      .then(data => {
        const opts = data.map((c: any) => ({
          value: c.cca2,
          label: c.name.common
        })).sort((a: any, b: any) => a.label.localeCompare(b.label));
        setCountryOptions(opts);
      })
      .catch(() => {
        // Fallback to static list if API fails
        setCountryOptions([
          { value: 'HU', label: 'Hungary' },
          { value: 'DE', label: 'Germany' },
          { value: 'GB', label: 'United Kingdom' },
          { value: 'US', label: 'United States' },
          { value: 'ID', label: 'Indonesia' },
          { value: 'PH', label: 'Philippines' },
          { value: 'SG', label: 'Singapore' },
          { value: 'MY', label: 'Malaysia' }
        ]);
      });
  }, []);

  // Get business type options with translations
  const getBusinessTypeOptions = () => [
    { value: 'restaurant', label: language === 'hu' ? 'Étterem' : 'Restaurant' },
    { value: 'barber-shop', label: language === 'hu' ? 'Fodrászat' : 'Barbershop' },
    { value: 'beauty-salon', label: language === 'hu' ? 'Szépségszalon' : 'Beauty Salon' },
    { value: 'spa', label: language === 'hu' ? 'Spa' : 'Spa' },
    { value: 'hotel-guesthouse', label: language === 'hu' ? 'Hotel/Panzió' : 'Hotel/Guesthouse' },
    { value: 'cafe', label: language === 'hu' ? 'Kávézó' : 'Café' },
    { value: 'other', label: language === 'hu' ? 'Egyéb' : 'Other' },
  ];

  const handleSubmit = async (values: typeof initialValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) {
        navigate('/auth');
        return;
      }

      console.log("Submitted values:", values);
      
      // Clean values - cast monthly_review_goal to Number and extract country value
      const cleanValues = {
        ...values,
        monthly_review_goal: values.monthly_review_goal
          ? Number(values.monthly_review_goal)
          : null,
        country: values.country?.value || null,
      };

      // First check if a profile already exists
      const { data: profileList, error: profileFetchError } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('user_id', user.id);

      if (profileFetchError) throw profileFetchError;

      const existingProfile = profileList?.[0];
      
      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('business_profiles')
          .update({
            ...cleanValues,
            completed_onboarding: true,
          })
          .eq('id', existingProfile.id);
        
        if (updateError) throw updateError;
        setSelectedBusinessId(existingProfile.id);
      } else {
        // Create new profile and get the new ID
        const { data: newProfile, error: insertError } = await supabase
          .from('business_profiles')
          .insert({
            user_id: user.id,
            ...cleanValues,
            completed_onboarding: true,
          })
          .select()
          .single();
        
        if (insertError) throw insertError;
        if (!newProfile) throw new Error('Insert returned no row');
        
        setSelectedBusinessId(newProfile.id);
      }
      
      // Update user_metadata table
      await supabase
        .from('user_metadata')
        .upsert(
          { user_id: user.id, completed_onboarding: true },
          { onConflict: 'user_id' }
        );

      // NEW: ensure a role row exists with email
      await supabase
        .from('user_roles')
        .upsert(
          {
            user_id: user.id,
            role: 'user',
            email: user.email
            // created_at not needed, defaults to NOW()
          },
          { onConflict: 'user_id' }
        );

      navigate('/profile');
    } catch (err: any) {
      console.error('Error saving onboarding data:', err.message || err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = async () => {
    try {
      // Get the current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) {
        navigate('/auth');
        return;
      }

      // First check if a profile already exists
      const { data: profiles, error: fetchError } = await supabase
        .from('business_profiles')
        .select('id')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;

      if (profiles && profiles.length > 0) {
        // Update the first profile found
        const { error: updateError } = await supabase
          .from('business_profiles')
          .update({ completed_onboarding: true })
          .eq('id', profiles[0].id);

        if (updateError) throw updateError;
        setSelectedBusinessId(profiles[0].id);
      } else {
        // Create a minimal profile if none exists
        const { data: newProfile, error: insertError } = await supabase
          .from('business_profiles')
          .insert({
            user_id: user.id,
            business_name: 'My Business',
            completed_onboarding: true
          })
          .select()
          .single();

        if (insertError) throw insertError;
        setSelectedBusinessId(newProfile.id);
      }
      
      // Update user_metadata table
      await supabase
        .from('user_metadata')
        .upsert(
          { user_id: user.id, completed_onboarding: true },
          { onConflict: 'user_id' }
        );

      // NEW: ensure a role row exists with email
      await supabase
        .from('user_roles')
        .upsert(
          {
            user_id: user.id,
            role: 'user',
            email: user.email
            // created_at not needed, defaults to NOW()
          },
          { onConflict: 'user_id' }
        );

      // Navigate to dashboard after successful update
      navigate('/profile');
    } catch (err) {
      console.error('Error skipping onboarding:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%`, backgroundColor: '#4FC3F7' }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {t.progressLabel
                .replace("{current}", currentStep.toString())
                .replace("{total}", totalSteps.toString())}
            </p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, isSubmitting, setFieldValue }) => {
              
              // Geolocation with full country name suggestion
              useEffect(() => {
                if (countryOptions.length > 0) {
                  fetch('https://ipinfo.io/json')
                    .then(res => res.json())
                    .then(({ country: iso }) => {
                      const found = countryOptions.find(c => c.value === iso);
                      if (found) {
                        setSuggestedCountry(found.label);
                        if (!values.country) {
                          setFieldValue('country', found);
                        }
                      }
                    })
                    .catch(() => {
                      setSuggestedCountry('');
                    });
                }
              }, [countryOptions, setFieldValue, values.country]);

              // Auto-skip after 10 seconds on step 4
              useEffect(() => {
                if (currentStep === 4) {
                  const timeout = setTimeout(() => {
                    if (!isSubmitting) {
                      console.log('[Auto Skip] 8 másodperc után triggereljük a handleSkip-et');
                      handleSkip();
                    }
                  }, 10000); // 10 másodperc

                  return () => clearTimeout(timeout);
                }
              }, [currentStep, isSubmitting]);

              return (
                <Form className="space-y-6">
                  {/* Step 1: Business Type */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold text-gray-900">{t.step1Title}</h2>
                      
                      <div>
                        <input
                          type="text"
                          name="business_name"
                          placeholder={t.businessName}
                          value={values.business_name}
                          onChange={handleChange}
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.business_name && touched.business_name && (
                          <p className="mt-1 text-sm text-red-600">{errors.business_name}</p>
                        )}
                      </div>

                      <div>
                        <Select
                          name="business_type"
                          options={getBusinessTypeOptions()}
                          value={
                            values.business_type
                              ? getBusinessTypeOptions().find(opt => opt.value === values.business_type)
                              : null
                          }
                          onChange={(opt) => setFieldValue('business_type', opt?.value || '')}
                          placeholder={t.selectBusinessType}
                          isClearable
                          className="react-select-container"
                          classNamePrefix="react-select"
                        />
                        {errors.business_type && touched.business_type && (
                          <p className="mt-1 text-sm text-red-600">{errors.business_type}</p>
                        )}
                      </div>

                      {values.business_type === 'other' && (
                        <div>
                          <input
                            type="text"
                            name="business_type_other"
                            placeholder={t.specifyBusinessType}
                            value={values.business_type_other}
                            onChange={handleChange}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                          {errors.business_type_other && touched.business_type_other && (
                            <p className="mt-1 text-sm text-red-600">{errors.business_type_other}</p>
                          )}
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t.countryLabel}
                        </label>
                        <Select
                          name="country"
                          options={countryOptions}
                          value={values.country}
                          placeholder={t.selectBusinessType}
                          onChange={(opt) => setFieldValue('country', opt)}
                          isClearable
                          className="react-select-container"
                          classNamePrefix="react-select"
                        />
                        {suggestedCountry && !values.country && (
                          <p className="text-sm text-gray-500 mt-1">{t.suggested}: {suggestedCountry}</p>
                        )}
                        {errors.country && touched.country && (
                          <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Employee Range */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold text-gray-900">{t.step2Title}</h2>
                      <div>
                        <select
                          name="employee_range"
                          value={values.employee_range}
                          onChange={handleChange}
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">{t.selectRange}</option>
                          <option value="1-10">{t.range1}</option>
                          <option value="11-50">{t.range2}</option>
                          <option value="51-100">{t.range3}</option>
                          <option value="100+">{t.range4}</option>
                        </select>
                        {errors.employee_range && touched.employee_range && (
                          <p className="mt-1 text-sm text-red-600">{errors.employee_range}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Primary Goal */}
                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold text-gray-900">{t.step3Title}</h2>
                      <div>
                        <select
                          name="primary_goal"
                          value={values.primary_goal}
                          onChange={handleChange}
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">{t.selectGoal}</option>
                          <option value="reviews">{t.goalReviews}</option>
                          <option value="filter">{t.goalFilter}</option>
                          <option value="recurring">{t.goalRecurring}</option>
                          <option value="all">{t.goalAll}</option>
                          <option value="other">{t.goalOther}</option>
                        </select>
                        {errors.primary_goal && touched.primary_goal && (
                          <p className="mt-1 text-sm text-red-600">{errors.primary_goal}</p>
                        )}
                      </div>

                      {values.primary_goal === 'other' && (
                        <div>
                          <input
                            type="text"
                            name="primary_goal_other"
                            placeholder={t.specifyGoal}
                            value={values.primary_goal_other}
                            onChange={handleChange}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                          {errors.primary_goal_other && touched.primary_goal_other && (
                            <p className="mt-1 text-sm text-red-600">{errors.primary_goal_other}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 4: Final Questions */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.step4Title}</h2>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {t.hearAboutUs}
                            </label>
                            <select
                              name="hear_about_us"
                              value={values.hear_about_us}
                              onChange={handleChange}
                              className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">{t.selectOption}</option>
                              <option value="linkedin">{t.channelLinkedIn}</option>
                              <option value="google">{t.channelGoogle}</option>
                              <option value="instagram">{t.channelInstagram}</option>
                              <option value="facebook">{t.channelFacebook}</option>
                              <option value="newsletter">{t.channelNewsletter}</option>
                              <option value="referral">{t.channelReferral}</option>
                            </select>
                            {errors.hear_about_us && touched.hear_about_us && (
                              <p className="mt-1 text-sm text-red-600">{errors.hear_about_us}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {t.monthlyGoalLabel}
                            </label>
                            <input
                              type="number"
                              name="monthly_review_goal"
                              placeholder={t.monthlyGoalPlaceholder}
                              value={values.monthly_review_goal || ''}
                              onChange={handleChange}
                              className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.monthly_review_goal && touched.monthly_review_goal && (
                              <p className="mt-1 text-sm text-red-600">{errors.monthly_review_goal}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-6">
                    <button
                      type="button"
                      onClick={handleSkip}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      {t.skip}
                    </button>

                    <div className="space-x-3">
                      {currentStep > 1 && (
                        <button
                          type="button"
                          onClick={() => setCurrentStep(step => step - 1)}
                          className="px-4 py-2 rounded-lg text-gray-700 hover:text-black"
                          style={{
                            backgroundColor: '#E1F5FE',
                            border: '1px solid #B3E5FC',
                          }}
                        >
                          {t.back}
                        </button>
                      )}

                      {currentStep < totalSteps ? (
                        <button
                          type="button"
                          onClick={() => setCurrentStep(step => step + 1)}
                          className="px-4 py-2 rounded-lg text-white hover:brightness-110"
                          style={{
                            backgroundColor: '#4FC3F7',
                          }}
                        >
                          {t.next}
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-4 py-2 rounded-lg text-white"
                          style={{
                            backgroundColor: isSubmitting ? '#B3E5FC' : '#4FC3F7',
                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {isSubmitting ? t.saving : t.complete}
                        </button>
                      )}
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
}