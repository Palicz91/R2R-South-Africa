import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import Footer from '../components/Footer';
import Layout from '../components/Layout'; // ← hozzáadva

interface Article {
  id: string;
  title: string;
  content: string;
  cover_image: string;
  category: string;
  created_at: string;
}

const categories = {
  'getting-started': { name: 'Getting Started', color: 'bg-blue-100 text-blue-800' },
  'best-practices': { name: 'Best Practices', color: 'bg-green-100 text-green-800' },
  'case-studies': { name: 'Case Studies', color: 'bg-purple-100 text-purple-800' },
  'templates': { name: 'Templates', color: 'bg-yellow-100 text-yellow-800' },
};

export default function PlaybookArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadArticle();
  }, [slug]);

  const loadArticle = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('playbook_articles')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (fetchError) throw fetchError;
      if (!data) throw new Error('Article not found');

      setArticle(data);
    } catch (err) {
      console.error('Error loading article:', err);
      setError(err instanceof Error ? err.message : 'Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      </Layout>
    );
  }

  if (error || !article) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Article not found</h1>
            <p className="text-gray-600 mb-6">{error || 'The requested article could not be found.'}</p>
            <Link
              to="/playbook"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Playbook
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Article Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Link
              to="/playbook"
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back to Playbook
            </Link>
            <div className={`px-3 py-1 rounded-full text-sm font-medium 
                          ${categories[article.category as keyof typeof categories].color}`}>
              {categories[article.category as keyof typeof categories].name}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>
            <div className="flex items-center text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(article.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </motion.div>
        </div>
      </header>

      {/* Article Content */}
      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 py-12"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Cover Image */}
          <div className="rounded-xl overflow-hidden mb-12 shadow-lg">
            <img
              src={article.cover_image}
              alt={article.title}
              className="w-full h-[400px] object-cover"
            />
          </div>

          {/* Markdown Content */}
          <div className="prose prose-lg max-w-none">
            {article.content.split('\n').map((paragraph, index) => {
              if (paragraph.startsWith('#')) {
                const level = paragraph.match(/^#+/)?.[0].length || 1;
                const text = paragraph.replace(/^#+\s/, '');
                const Tag = `h${level}` as keyof JSX.IntrinsicElements;
                return <Tag key={index} className="font-bold">{text}</Tag>;
              }
              return <p key={index}>{paragraph}</p>;
            })}
          </div>
        </div>
      </motion.article>

      <Footer />
    </Layout>
  );
}
