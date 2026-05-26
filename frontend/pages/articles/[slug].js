import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import AnimatedSection from '../../components/ui/AnimatedSection';
import { articlesAPI } from '../../lib/api';
import { FiClock, FiEye, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

export default function ArticleDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    articlesAPI.getOne(slug)
      .then(({ data }) => setArticle(data))
      .catch(() => router.replace('/articles'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <Layout title="Loading...">
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-royal-600/30 border-t-royal-400 rounded-full animate-spin" />
      </div>
    </Layout>
  );

  if (!article) return null;

  return (
    <Layout title={article.title} description={article.excerpt}>
      {/* Hero */}
      <section className="relative pt-28 pb-10">
        <div className="absolute inset-0 bg-gradient-to-b from-royal-900/50 to-royal-950" />
        {article.featuredImage && (
          <div className="absolute inset-0 overflow-hidden">
            <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover opacity-10" />
          </div>
        )}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
          <Link href="/articles" className="inline-flex items-center gap-2 text-silver-400 hover:text-white text-sm mb-6 transition-colors">
            <FiArrowLeft size={14} /> Back to Articles
          </Link>
          <AnimatedSection>
            {article.category && <span className="text-royal-400 text-xs uppercase tracking-widest font-medium block mb-3">{article.category?.name}</span>}
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-white mb-4 leading-tight">{article.title}</h1>
            {article.excerpt && <p className="text-silver-300 text-lg leading-relaxed mb-5">{article.excerpt}</p>}
            <div className="flex flex-wrap gap-4 text-sm text-silver-500 items-center">
              <span>{article.author}</span>
              {article.readTime && <span className="flex items-center gap-1"><FiClock size={13} /> {article.readTime} min</span>}
              <span className="flex items-center gap-1"><FiEye size={13} /> {article.views}</span>
              {article.publishedAt && <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured image */}
      {article.featuredImage && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-10">
          <AnimatedSection>
            <div className="rounded-2xl overflow-hidden border border-white/5">
              <img src={article.featuredImage} alt={article.title} className="w-full h-64 sm:h-80 object-cover" />
            </div>
          </AnimatedSection>
        </div>
      )}

      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        <AnimatedSection>
          <div
            className="prose prose-invert prose-blue max-w-none text-silver-200 leading-relaxed prose-headings:font-display prose-headings:text-white prose-a:text-royal-400 prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags */}
          {article.tags?.length > 0 && (
            <div className="mt-10 pt-6 border-t border-white/5">
              <p className="text-silver-500 text-xs uppercase tracking-widest mb-3">Tags</p>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, i) => (
                  <span key={i} className="text-xs px-3 py-1 rounded-full glass border border-white/10 text-silver-300">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </AnimatedSection>
      </article>
    </Layout>
  );
}
