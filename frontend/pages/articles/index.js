import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import AnimatedSection, { StaggerContainer, StaggerItem } from '../../components/ui/AnimatedSection';
import { articlesAPI } from '../../lib/api';
import { FiClock, FiEye, FiArrowRight, FiSearch } from 'react-icons/fi';

function ArticleCard({ article, featured = false }) {
  return (
    <Link href={`/articles/${article.slug}`}>
      <motion.div
        whileHover={{ y: -6 }}
        className={`glass rounded-2xl overflow-hidden border border-white/5 glow-on-hover group cursor-pointer ${featured ? 'col-span-2 flex' : ''}`}
      >
        <div className={`relative bg-gradient-to-br from-royal-800/40 to-royal-950 overflow-hidden flex-shrink-0 ${featured ? 'w-1/2 h-auto' : 'h-52'}`}>
          {article.featuredImage ? (
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
            />
          ) : (
            <div className="w-full h-52 flex items-center justify-center">
              <span className="font-display text-5xl text-royal-700">R</span>
            </div>
          )}
        </div>
        <div className="p-6 flex flex-col justify-between">
          <div>
            {article.category && (
              <span className="text-royal-400 text-xs font-medium tracking-widest uppercase mb-3 block">
                {article.category?.name || 'Article'}
              </span>
            )}
            <h3 className={`font-display font-medium text-white mb-3 group-hover:text-royal-300 transition-colors leading-snug ${featured ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
              {article.title}
            </h3>
            <p className="text-silver-400 text-sm leading-relaxed line-clamp-3">{article.excerpt}</p>
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-silver-500">
            {article.readTime && (
              <span className="flex items-center gap-1"><FiClock size={11} /> {article.readTime} min read</span>
            )}
            {article.views > 0 && (
              <span className="flex items-center gap-1"><FiEye size={11} /> {article.views}</span>
            )}
            <span className="ml-auto flex items-center gap-1 text-royal-400 group-hover:text-royal-300 transition-colors">
              Read <FiArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await articlesAPI.getAll({ search, page, limit: 9 });
        setArticles(data.articles);
        setTotalPages(data.pages);
      } catch (err) {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [search, page]);

  return (
    <Layout title="Articles" description="Latest articles and insights from Royalty Plus">
      {/* Hero */}
      <section className="relative pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-royal-900/50 to-royal-950" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <AnimatedSection className="text-center">
            <p className="text-royal-400 text-sm font-medium tracking-widest uppercase mb-3">Knowledge Hub</p>
            <h1 className="font-display text-5xl sm:text-6xl font-semibold text-white mb-4">
              Articles & Insights
            </h1>
            <p className="text-silver-400 max-w-xl mx-auto">
              Deep dives into AI, technology, and innovation from the Royalty Plus team.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Search */}
      <section className="py-6 sticky top-16 z-30 glass-dark border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-silver-500" size={16} />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full input-dark rounded-xl pl-10 pr-4 py-2.5 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="glass rounded-2xl overflow-hidden border border-white/5">
                  <div className="h-52 skeleton" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 skeleton rounded w-3/4" />
                    <div className="h-4 skeleton rounded" />
                    <div className="h-4 skeleton rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <p className="text-center text-silver-400 py-20">No articles found.</p>
          ) : (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.08}>
              {articles.map((article) => (
                <StaggerItem key={article._id}>
                  <ArticleCard article={article} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                    page === p ? 'bg-royal-600 text-white' : 'glass text-silver-400 hover:text-white'
                  }`}>{p}</button>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
