import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Eye, Trash2, AlertCircle, QrCode, ChevronDown, ChevronUp, Scan as QrScan, Star, Gift } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useBusiness } from '../context/BusinessContext';
import { useUserRole } from '../hooks/useUserRole';
import { useLanguage } from '../context/LanguageContext';

interface WheelProject {
  id: string;
  name: string;
  description: string | null;
  prizes: Array<{ label: string }>;
  created_at: string;
  business_id?: string;
  business_name?: string;
}

interface ProjectStats {
  totalScans: number;
  totalReviews: number;
  redeemedPrizes: number;
  loading: boolean;
  error: string | null;
}

export const projectsOverviewTranslations = {
  en: {
    page_title_admin: 'All Wheel Projects',
    page_title_user: 'My Wheel Projects',
    create_button: 'Create New Wheel',
    error_loading: 'Failed to delete project. Please try again.',
    empty_title: 'No projects yet',
    empty_subtitle: 'Create your first wheel project to start collecting reviews!',
    empty_button: 'Create Your First Wheel',
    preview_button: 'Preview',
    edit_button: 'Edit',
    qr_button_title: 'Get QR Code',
    stats_toggle: 'Statistics',
    stats_scans: 'Total Scans',
    stats_reviews: 'Reviews',
    stats_redeemed: 'Prizes Redeemed',
    error_stats: 'Failed to load statistics',
    prizes_count: 'prizes',
    created_text: 'Created'
  },
  hu: {
    page_title_admin: 'Összes Projekt',
    page_title_user: 'Saját Projektek',
    create_button: 'Új Kerék Létrehozása',
    error_loading: 'A projekt törlése sikertelen. Próbáld újra.',
    empty_title: 'Még nincs projekted létrehozva',
    empty_subtitle: 'Hozd létre az első kereked, hogy elkezdhess értékeléseket gyűjteni!',
    empty_button: 'Hozd létre az első szerencsekereked',
    preview_button: 'Előnézet',
    edit_button: 'Szerkesztés',
    qr_button_title: 'QR kód lekérése',
    stats_toggle: 'Statisztikák',
    stats_scans: 'Összes szkennelés',
    stats_reviews: 'Értékelések',
    stats_redeemed: 'Beváltott nyeremények',
    error_stats: 'A statisztikák betöltése sikertelen',
    prizes_count: 'nyeremény',
    created_text: 'Létrehozva'
  }
};

export default function ProjectsOverviewPage() {
  const { selectedBusinessId } = useBusiness();
  const role = useUserRole();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<WheelProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedStats, setExpandedStats] = useState<Record<string, boolean>>({});
  const [projectStats, setProjectStats] = useState<Record<string, ProjectStats>>({});
  const { language } = useLanguage();

  const t = projectsOverviewTranslations[language];

  // Update to depend on both selectedBusinessId and role
  useEffect(() => {
    if (role !== null) {
      if (role === 'admin' || selectedBusinessId) {
        loadProjects();
      } else {
        navigate('/profile');
      }
    }
  }, [selectedBusinessId, navigate, role]);

  const loadProjects = async () => {
    try {
      if (role !== 'admin' && !selectedBusinessId) {
        throw new Error('No business selected');
      }

      let query = supabase
        .from('wheel_projects')
        .select(role === 'admin' ? 
          'id, name, description, prizes, created_at, business_id, business_profiles!inner(business_name)' : 
          '*');
      
      if (role !== 'admin') {
        query = query.eq('business_id', selectedBusinessId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedProjects = data?.map((project: Record<string, any>) => {
        if (role === 'admin' && 'business_profiles' in project) {
          return {
            ...project,
            business_name: project.business_profiles.business_name,
            business_profiles: undefined
          };
        }
        return project;
      }) || [];
      
      setProjects(formattedProjects as WheelProject[]);
    } catch (err) {
      console.error('Error loading projects:', err);
      setError(err instanceof Error ? err.message : 'Error loading projects');
    } finally {
      setLoading(false);
    }
  };

  const loadProjectStats = async (projectId: string) => {
    if (projectStats[projectId]?.loading || projectStats[projectId]?.error) return;

    setProjectStats((prev: Record<string, ProjectStats>) => ({
      ...prev,
      [projectId]: {
        totalScans: 0,
        totalReviews: 0,
        redeemedPrizes: 0,
        loading: true,
        error: null
      }
    }));

    try {
      const { count: scansCount, error: scansError } = await supabase
        .from('review_clicks')
        .select('*', { count: 'exact', head: true })
        .eq('wheel_id', projectId);

      if (scansError) throw scansError;

      const { count: ratingsCount, error: ratingsError } = await supabase
        .from('review_ratings')
        .select('*', { count: 'exact', head: true })
        .eq('wheel_id', projectId);

      if (ratingsError) throw ratingsError;

      const { count: prizesCount, error: prizesError } = await supabase
        .from('reward_codes')
        .select('*', { count: 'exact', head: true })
        .eq('wheel_project_id', projectId)
        .eq('redeemed', true);

      if (prizesError) throw prizesError;

      setProjectStats((prev: Record<string, ProjectStats>) => ({
        ...prev,
        [projectId]: {
          totalScans: scansCount || 0,
          totalReviews: ratingsCount || 0,
          redeemedPrizes: prizesCount || 0,
          loading: false,
          error: null
        }
      }));
    } catch (err) {
      console.error('Error loading project stats:', err);
      setProjectStats((prev: Record<string, ProjectStats>) => ({
        ...prev,
        [projectId]: {
          ...prev[projectId],
          loading: false,
          error: t.error_stats
        }
      }));
    }
  };

  const handleDelete = async (projectId: string) => {
    try {
      setDeletingId(projectId);
      setError(null);

      const { error } = await supabase
        .from('wheel_projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      setProjects((prev: WheelProject[]) => prev.filter(p => p.id !== projectId));
      setError(null);
    } catch (err) {
      console.error('Error deleting project:', err);
      setError(t.error_loading);
    } finally {
      setDeletingId(null);
    }
  };

  const toggleStats = (projectId: string) => {
    setExpandedStats((prev: Record<string, boolean>) => {
      const newState = { ...prev, [projectId]: !prev[projectId] };
      if (newState[projectId]) {
        loadProjectStats(projectId);
      }
      return newState;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {role === 'admin' ? t.page_title_admin : t.page_title_user}
        </h1>
        <Link
          to="/wheels/create"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg
                   hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          {t.create_button}
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <PlusCircle className="w-12 h-12 text-gray-400 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t.empty_title}</h3>
          <p className="text-gray-600 mb-6">{t.empty_subtitle}</p>
          <Link
            to="/wheels/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg
                     hover:bg-blue-700 transition-colors"
          >
            {t.empty_button}
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {project.name}
                </h3>
                {role === 'admin' && project.business_name && (
                  <p className="text-blue-600 text-sm font-medium mb-2">
                    {project.business_name}
                  </p>
                )}
                {project.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <span>{project.prizes.length} {t.prizes_count}</span>
                  <span>•</span>
                  <span>
                    {t.created_text} {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Link
                    to={`/wheels/${project.id}`}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2
                             bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200
                             transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-1.5" />
                    {t.preview_button}
                  </Link>
                  <Link
                    to={`/wheels/${project.id}/edit`}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2
                             bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100
                             transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-1.5" />
                    {t.edit_button}
                  </Link>
                  <Link
                    to={`/wheels/${project.id}/qr`}
                    className="inline-flex items-center justify-center p-2
                             bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200
                             transition-colors"
                    title={t.qr_button_title}
                  >
                    <QrCode className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(project.id)}
                    disabled={deletingId === project.id}
                    className="inline-flex items-center justify-center p-2 text-gray-400
                             hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    {deletingId === project.id ? (
                      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div>
                  <button
                    onClick={() => toggleStats(project.id)}
                    className="w-full flex items-center justify-between px-3 py-2
                             bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span className="font-medium text-gray-700">{t.stats_toggle}</span>
                    {expandedStats[project.id] ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </button>

                  {expandedStats[project.id] && (
                    <div className="mt-2 space-y-2 p-3 bg-gray-50 rounded-lg">
                      {projectStats[project.id]?.loading ? (
                        <div className="flex justify-center py-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
                        </div>
                      ) : projectStats[project.id]?.error ? (
                        <div className="text-red-600 text-sm text-center py-2">
                          {projectStats[project.id].error}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <QrScan className="w-4 h-4 text-blue-500" />
                            <span className="text-gray-600">
                              {t.stats_scans}: <span className="font-semibold">{projectStats[project.id].totalScans}</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-gray-600">
                              {t.stats_reviews}: <span className="font-semibold">{projectStats[project.id].totalReviews}</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Gift className="w-4 h-4 text-purple-500" />
                            <span className="text-gray-600">
                              {t.stats_redeemed}: <span className="font-semibold">{projectStats[project.id].redeemedPrizes}</span>
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}