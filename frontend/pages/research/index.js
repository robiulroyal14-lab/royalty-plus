import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import AnimatedSection, { StaggerContainer, StaggerItem } from '../../components/ui/AnimatedSection';
import { researchAPI } from '../../lib/api';
import { FiDownload, FiEye, FiFileText, FiSearch, FiExternalLink } from 'react-icons/fi';
import toast from 'react-hot-toast';

function ResearchCard({ item }) {
  const handleDownload = async () => {
    if (!item.pdfUrl) return;
    await researchAPI.trackDownload(item._id).catch(() => {});
    window.open(item.pdfUrl, '_blank');
    toast.success('Opening research paper...');
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="glass rounded-2xl p-6 border border-white/5 glow-on-hover group flex flex-col gap-4"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-royal-800/40 border border-royal-700/30 flex items-center justify-center flex-shrink-0 group-hover:border-royal-500/40 transition-colors">
          <FiFileText className="text-royal-400" size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg font-medium text-white mb-1 group-hover:text-royal-300 transition-colors leading-snug line-clamp-2">
            {item.title}
          </h3>
          {item.authors?.length > 0 && (
            <p className="text-silver-500 text-xs">{item.authors.join(', ')}</p>
          )}
        </div>
      </div>
      
      <p className="text-silver-400 text-sm leading-relaxed line-clamp-3">{item.abstract}</p>
      
      {item.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {item.tags.slice(0, 4).map((tag, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-royal-800/40 text-royal-400 border border-royal-700/30">
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex items-center gap-3 pt-2 border-t border-white/5">
        <span className="text-silver-600 text-xs flex items-center gap-1">
          <FiDownload size={11} /> {item.downloads || 0} downloads
        </span>
        <span className="text-silver-600 text-xs flex items-center gap-1">
          <FiEye size={11} /> {item.views || 0} views
        </span>
        <div className="ml-auto flex gap-2">
          {item.pdfUrl && (
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 btn-royal text-white text-xs px-3 py-1.5 rounded-lg"
            >
              <FiDownload size={12} /> Download PDF
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ResearchPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await researchAPI.getAll({ search, limit: 20 });
        setItems(data.research);
      } catch (err) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [search]);

  return (
    <Layout title="Research" description="Royalty Plus research papers and publications">
      <section className="relative pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-royal-900/50 to-royal-950" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <AnimatedSection className="text-center">
            <p className="text-royal-400 text-sm font-medium tracking-widest uppercase mb-3">Publications</p>
            <h1 className="font-display text-5xl sm:text-6xl font-semibold text-white mb-4">Research Hub</h1>
            <p className="text-silver-400 max-w-xl mx-auto">
              Peer-reviewed research papers, whitepapers, and technical publications from our innovation lab.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-6 sticky top-16 z-30 glass-dark border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-silver-500" size={16} />
            <input type="text" placeholder="Search research..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full input-dark rounded-xl pl-10 pr-4 py-2.5 text-sm" />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="glass rounded-2xl p-6 border border-white/5 space-y-3">
                  <div className="h-5 skeleton rounded w-3/4" />
                  <div className="h-4 skeleton rounded" />
                  <div className="h-4 skeleton rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-silver-400 py-20">No research papers found.</p>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6" stagger={0.08}>
              {items.map(item => (
                <StaggerItem key={item._id}>
                  <ResearchCard item={item} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>
    </Layout>
  );
}
