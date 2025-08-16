import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy,
  QrCode,
  Star,
  Gift,
  PlusCircle,
  Download,
  Boxes,
  ArrowRight,
  Clock,
  FileDown
} from 'lucide-react';
import { supabase, checkAuth } from '../lib/supabaseClient';
import { useBusiness } from '../context/BusinessContext';
import { useUserRole } from '../hooks/useUserRole';
import { useLanguage } from '../context/LanguageContext';
import AffiliatePage from '../pages/AffiliatePage';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import DeleteUserByEmail from '../components/DeleteUserByEmail';

const homeTranslations = {
  en: {
    dashboard_title: "Welcome to your dashboard 👋",
    dashboard_subtitle_admin: "Here's what's happening across all businesses",
    dashboard_subtitle_user: "Here's what's happening with your review campaigns",
    stats_projects: "Projects",
    stats_projects_desc: "Active campaigns",
    stats_scans: "Scans",
    stats_scans_desc: "Total QR scans",
    stats_reviews: "Reviews",
    stats_reviews_desc: "Google reviews",
    stats_rewards: "Rewards",
    stats_rewards_desc: "Prizes redeemed",
    quick_actions: "Quick Actions",
    new_project: "New Project",
    get_qr_codes: "Get QR Codes",
    view_projects: "View Projects",
    export_center: "Export Center",
    export_description: "Download a detailed CSV of your collected reward data, including email addresses, prizes, redemption status, and marketing opt-ins. Perfect for campaign tracking or newsletter list building.",
    project_database: "Project Database",
    tips_for_success: "Tips for Success",
    tip1: "Place QR codes in visible locations where customers can easily scan them",
    tip2: "Offer a mix of high-value and frequent-win prizes to maintain engagement",
    tip3: "Train your staff to encourage customers to participate in the review program",
    tip4: "Regularly update your prize wheel to keep the campaign fresh",
    show_affiliate: "Show Affiliate Registration",
    hide_affiliate: "Hide Affiliate Registration",
    admin_delete_user: "Delete ALL data by email",
    admin_delete_run: "Delete now",
    admin_delete_dry: "Dry run (no delete)",
    admin_delete_placeholder: "Email to wipe",
    admin_delete_confirm: "I understand this is irreversible",
    admin_delete_success: "Deletion finished",
    admin_delete_preview: "Preview (dry run) finished",
    admin_delete_error: "Error during deletion",
  },
  hu: {
    dashboard_title: "Üdv a vezérlőpultodon 👋",
    dashboard_subtitle_admin: "Így állnak a kampányok az összes üzletben",
    dashboard_subtitle_user: "Így teljesítenek a review kampányaid",
    stats_projects: "Kampányok",
    stats_projects_desc: "Aktív kampányok",
    stats_scans: "Scanek",
    stats_scans_desc: "Összes QR-kód beolvasás",
    stats_reviews: "Értékelések",
    stats_reviews_desc: "Google értékelések",
    stats_rewards: "Nyeremények",
    stats_rewards_desc: "Beváltott ajándékok",
    quick_actions: "Gyors műveletek",
    new_project: "Új kampány",
    get_qr_codes: "QR-kódok letöltése",
    view_projects: "Kampányok megtekintése",
    export_center: "Letöltési Központ",
    export_description: "Tölts le egy részletes CSV-t a kampányaid adataival: e-mail címek, nyeremények, státusz és email lista feliratkozások. Tökéletes hírlevél listához vagy statisztikához.",
    project_database: "Kampány adatbázis",
    tips_for_success: "Tippek",
    tip1: "Helyezd el a QR-kódokat jól látható helyeken, hogy könnyen beolvashatóak legyenek",
    tip2: "Keverd az értékes és gyakori nyereményeket, hogy fenntartsd az érdeklődést",
    tip3: "Tanítsd meg a csapatodnak, hogyan ösztönözzenek az értékelésre",
    tip4: "Frissítsd rendszeresen a nyereménykereket, hogy új élmény legyen mindig",
    show_affiliate: "Partner regisztráció megnyitása",
    hide_affiliate: "Partner regisztráció elrejtése",
    admin_delete_title: "Felhasználó teljes törlése e-mail alapján",
    admin_delete_placeholder: "Email cím",
    admin_delete_dry: "Dry run (nem töröl, csak számol)",
    admin_delete_confirm: "Tudom, hogy ez visszafordíthatatlan",
    admin_delete_run: "Törlés indítása",
    admin_delete_preview: "Előnézet (dry run)",
    admin_delete_result: "Eredmény",
  }
};

interface DashboardStats {
  activeProjects: number;
  totalScans: number;
  totalReviews: number;
  redeemedRewards: number;
}

interface RecentActivity {
  id: string;
  type: 'review' | 'redemption';
  businessName: string;
  createdAt: string;
  prize?: string;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { selectedBusinessId } = useBusiness();
  const role = useUserRole();
  const [showAffiliate, setShowAffiliate] = useState(false);
  const { language } = useLanguage();
  const [stats, setStats] = useState<DashboardStats>({
    activeProjects: 0,
    totalScans: 0,
    totalReviews: 0,
    redeemedRewards: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  const t = homeTranslations[language];

  useEffect(() => {
    console.log('[Dashboard] role:', role);
    console.log('[Dashboard] selectedBusinessId:', selectedBusinessId);
    if (role !== null) {
      if (role === 'admin') {
        console.log('[Dashboard] Role is admin → loading all data');
        loadUserAndData(null, role);
      } else if (selectedBusinessId) {
        console.log('[Dashboard] Role is user → loading business data');
        loadUserAndData(selectedBusinessId, role);
      } else {
        console.warn('[Dashboard] No business selected → redirecting to /profile');
        navigate('/profile');
      }
    }
  }, [selectedBusinessId, navigate, role]);

  const loadUserAndData = async (businessId: string | null, userRole: string) => {
    try {
      const user = await checkAuth();
      if (!user) {
        navigate('/auth');
        return;
      }

      console.log('Fetching data with role:', userRole, 'business ID:', businessId);
      
      let businessName = 'All Businesses';

      if (userRole !== 'admin' && businessId) {
        const { data: business, error: businessError } = await supabase
          .from('business_profiles')
          .select('id, business_name')
          .eq('id', businessId)
          .single();

        if (businessError || !business) {
          console.error('Error fetching business profile:', businessError);
          navigate('/profile');
          return;
        }
        
        businessName = business.business_name;
      }

      let projectsQuery = supabase.from('wheel_projects').select('*');
      
      if (userRole !== 'admin' && businessId) {
        projectsQuery = projectsQuery.eq('business_id', businessId);
      }
      
      const { data: projects, error: projectsError } = await projectsQuery;
      
      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
        throw projectsError;
      }

      let scansQuery = supabase
        .from('review_clicks')
        .select('id', { count: 'exact', head: true });
        
      if (userRole !== 'admin' && businessId) {
        scansQuery = scansQuery.eq('business_id', businessId);
      }
      
      const { count: scansCount, error: scansError } = await scansQuery;

      if (scansError) throw scansError;

      let reviewsQuery = supabase
        .from('review_clicks')
        .select('id', { count: 'exact', head: true })
        .not('rating', 'is', null);
      
      if (userRole !== 'admin' && businessId) {
        reviewsQuery = reviewsQuery.eq('business_id', businessId);
      }
      
      const { count: realReviewsCount, error: realReviewsError } = await reviewsQuery;

      if (realReviewsError) throw realReviewsError;

      let rewardsCount = 0;

      if (userRole === 'admin') {
        const { count, error: redeemedError } = await supabase
          .from('redeemed_qr_stats')
          .select('*', { count: 'exact', head: true })
          .eq('redeemed', true);

        if (redeemedError) throw redeemedError;
        rewardsCount = count || 0;
      } else if (businessId) {
        const { data: wheelIds, error: wheelError } = await supabase
          .from('wheel_projects')
          .select('id')
          .eq('business_id', businessId);

        if (wheelError) throw wheelError;

        if (wheelIds && wheelIds.length > 0) {
          const wheelIdArray = wheelIds.map(w => w.id);
          
          const { count, error: redeemedError } = await supabase
            .from('redeemed_qr_stats')
            .select('*', { count: 'exact', head: true })
            .eq('redeemed', true)
            .in('wheel_project_id', wheelIdArray);

          if (redeemedError) throw redeemedError;
          rewardsCount = count || 0;
        }
      }

      setStats({
        activeProjects: projects?.length || 0,
        totalScans: scansCount || 0,
        totalReviews: realReviewsCount || 0,
        redeemedRewards: rewardsCount,
      });

      let recentQuery = supabase
        .from('prize_claims')
        .select(`
          id,
          prize,
          sent_at,
          review_click_id,
          review_clicks!inner (
            business_id,
            business_profiles(business_name)
          )
        `)
        .order('sent_at', { ascending: false })
        .limit(5);
        
      if (userRole !== 'admin' && businessId) {
        recentQuery = recentQuery.eq('review_clicks.business_id', businessId);
      }
      
      const { data: recentData, error: recentError } = await recentQuery;

      if (recentError) throw recentError;

      if (recentData) {
        setRecentActivity(
          recentData.map(item => ({
            id: item.id,
            type: 'redemption',
            businessName: userRole === 'admin' && item.review_clicks?.business_profiles?.business_name 
              ? item.review_clicks.business_profiles.business_name
              : businessName,
            createdAt: item.sent_at,
            prize: item.prize
          }))
        );
      }
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      if (error instanceof Error && error.message === 'Not authenticated') {
        navigate('/auth');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!selectedBusinessId) return;

    const { data: reviews, error } = await supabase
      .from('review_clicks')
      .select('id, rating, review, created_at')
      .eq('business_id', selectedBusinessId);

    if (error) {
      console.error('Error fetching reviews:', error);
      return;
    }

    const csv = Papa.unparse(reviews);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `reviews_export_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleExportCSV = async () => {
    const user = await checkAuth();
    if (!user) {
      console.error('No user logged in');
      return;
    }

    const { data, error } = await supabase
      .from('reward_codes')
      .select(`
        wheel_name,
        user_email,
        prize,
        redeemed,
        redeemed_at,
        created_at,
        expires_at,
        marketing_opt_in,
        wheel_projects!inner(user_id)
      `)
      .eq('wheel_projects.user_id', user.id);

    if (error) {
      console.error('CSV export failed:', error);
      return;
    }

    const cleaned = (data || []).map(row => ({
      wheel_name: row.wheel_name,
      user_email: row.marketing_opt_in ? row.user_email : '',
      prize: row.prize,
      redeemed: row.redeemed,
      redeemed_at: row.redeemed_at,
      created_at: row.created_at,
      expires_at: row.expires_at,
      marketing_opt_in: row.marketing_opt_in ? 'yes' : 'no'
    }));

    const csv = Papa.unparse(cleaned);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'reward_codes_export.csv');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t.dashboard_title}
          </h1>
          <p className="mt-2 text-gray-600">
            {role === 'admin' ? t.dashboard_subtitle_admin : t.dashboard_subtitle_user}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <Trophy className="w-12 h-12 text-blue-500" />
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                {t.stats_projects}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mt-4">
              {stats.activeProjects}
            </h2>
            <p className="text-gray-600 mt-1">{t.stats_projects_desc}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <QrCode className="w-12 h-12 text-green-500" />
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">
                {t.stats_scans}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mt-4">
              {stats.totalScans}
            </h2>
            <p className="text-gray-600 mt-1">{t.stats_scans_desc}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <Star className="w-12 h-12 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-600 bg-yellow-50 px-2.5 py-0.5 rounded-full">
                {t.stats_reviews}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mt-4">
              {stats.totalReviews}
            </h2>
            <p className="text-gray-600 mt-1">{t.stats_reviews_desc}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <Gift className="w-12 h-12 text-purple-500" />
              <span className="text-sm font-medium text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full">
                {t.stats_rewards}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mt-4">
              {stats.redeemedRewards}
            </h2>
            <p className="text-gray-600 mt-1">{t.stats_rewards_desc}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t.quick_actions}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => navigate('/wheels/create')}
                  className="flex items-center justify-center gap-3 p-4 rounded-xl
                           bg-blue-50 hover:bg-blue-100 transition-colors group"
                >
                  <PlusCircle className="w-6 h-6 text-blue-600" />
                  <span className="font-medium text-blue-600">{t.new_project}</span>
                </button>

                <button
                  onClick={() => navigate('/wheels')}
                  className="flex items-center justify-center gap-3 p-4 rounded-xl
                           bg-purple-50 hover:bg-purple-100 transition-colors group"
                >
                  <Download className="w-6 h-6 text-purple-600" />
                  <span className="font-medium text-purple-600">{t.get_qr_codes}</span>
                </button>

                <button
                  onClick={() => navigate('/wheels')}
                  className="flex items-center justify-center gap-3 p-4 rounded-xl
                           bg-green-50 hover:bg-green-100 transition-colors group"
                >
                  <Boxes className="w-6 h-6 text-green-600" />
                  <span className="font-medium text-green-600">{t.view_projects}</span>
                </button>
              </div>
            </div>

            <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {t.export_center}
                </h2>
                <FileDown className="w-5 h-5 text-gray-400" />
              </div>

              <p className="text-gray-600 mb-4">
                {t.export_description}
              </p>

              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <FileDown className="w-5 h-5" />
                <span>{t.project_database}</span>
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
            <h2 className="text-xl font-semibold mb-4">{t.tips_for_success}</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p>{t.tip1}</p>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p>{t.tip2}</p>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p>{t.tip3}</p>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p>{t.tip4}</p>
              </li>
            </ul>
          </div>
        </div>

        {role === 'admin' && (
          <div className="mt-12 space-y-6">
            <button
              onClick={() => setShowAffiliate(!showAffiliate)}
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {showAffiliate ? t.hide_affiliate : t.show_affiliate}
            </button>

            {showAffiliate && <AffiliatePage />}

            <DeleteUserByEmail />
          </div>
        )}
      </div>
    </div>
  );
}