import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import ParticleBackground from '../../components/ui/ParticleBackground';
import AnimatedSection, { StaggerContainer, StaggerItem } from '../../components/ui/AnimatedSection';
import { aiProjectsAPI } from '../../lib/api';
import { FiGithub, FiYoutube, FiExternalLink, FiFileText, FiCpu, FiZap, FiEye, FiBox } from 'react-icons/fi';

const CATEGORIES = [
  { key: 'all', label: 'All Projects' },
  { key: 'ai', label: 'Artificial Intelligence' },
  { key: 'robotics', label: 'Robotics' },
  { key: 'machine-learning', label: 'Machine Learning' },
  { key: 'computer-vision', label: 'Computer Vision' },
  { key: 'iot', label: 'IoT' },
  { key: 'automation', label: 'Automation' },
  { key: 'nlp', label: 'NLP' },
];

function ProjectCard({ project }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-2xl overflow-hidden border border-white/5 group relative"
    >
      {/* Glow overlay on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-b from-royal-600/5 to-transparent" />
      
      {/* Media */}
      <div className="relative h-56 bg-gradient-to-br from-royal-800/40 to-royal-950 overflow-hidden">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center tech-grid">
            <div className="w-20 h-20 rounded-2xl bg-royal-700/30 border border-royal-500/20 flex items-center justify-center animate-pulse-slow">
              <FiCpu className="text-royal-400" size={32} />
            </div>
          </div>
        )}
        
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full glass border border-royal-500/30 text-royal-300 backdrop-blur-sm uppercase tracking-wide">
            {project.category}
          </span>
        </div>

        {/* Links overlay */}
        <div className="absolute inset-0 bg-royal-950/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 glass rounded-xl flex items-center justify-center text-white hover:text-royal-300 border border-white/20 hover:border-royal-500/50 transition-all"
              onClick={e => e.stopPropagation()}>
              <FiGithub size={18} />
            </a>
          )}
          {project.youtubeUrl && (
            <a href={project.youtubeUrl} target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 glass rounded-xl flex items-center justify-center text-white hover:text-red-400 border border-white/20 hover:border-red-500/50 transition-all"
              onClick={e => e.stopPropagation()}>
              <FiYoutube size={18} />
            </a>
          )}
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 glass rounded-xl flex items-center justify-center text-white hover:text-green-400 border border-white/20 hover:border-green-500/50 transition-all"
              onClick={e => e.stopPropagation()}>
              <FiExternalLink size={18} />
            </a>
          )}
          {project.researchPdfUrl && (
            <a href={project.researchPdfUrl} target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 glass rounded-xl flex items-center justify-center text-white hover:text-yellow-400 border border-white/20 hover:border-yellow-500/50 transition-all"
              onClick={e => e.stopPropagation()}>
              <FiFileText size={18} />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display text-xl font-medium text-white mb-2 group-hover:text-royal-300 transition-colors line-clamp-1">
          {project.title}
        </h3>
        <p className="text-silver-400 text-sm leading-relaxed mb-4 line-clamp-3">
          {project.shortDescription || project.description}
        </p>

        {/* Tags */}
        {project.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-royal-800/40 text-royal-400 border border-royal-700/30">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer links */}
        <div className="flex items-center gap-4 pt-3 border-t border-white/5 text-xs text-silver-500">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" 
              className="flex items-center gap-1 hover:text-white transition-colors">
              <FiGithub size={12} /> GitHub
            </a>
          )}
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-white transition-colors">
              <FiExternalLink size={12} /> Demo
            </a>
          )}
          {project.researchPdfUrl && (
            <a href={project.researchPdfUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-white transition-colors">
              <FiFileText size={12} /> Paper
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function AIRoboticsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = { limit: 50 };
      if (activeCategory !== 'all') params.category = activeCategory;
      if (search) params.search = search;
      const { data } = await aiProjectsAPI.getAll(params);
      setProjects(data.projects);
    } catch (err) {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, [activeCategory, search]);

  return (
    <Layout title="AI & Robotics" description="Explore Royalty Plus AI, Robotics, IoT and Machine Learning projects">
      <ParticleBackground density={40} />

      {/* HERO */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 tech-grid opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-royal-950/80 via-transparent to-royal-950" />
        
        {/* Animated lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.8, ease: 'linear' }}
              className="absolute h-px bg-gradient-to-r from-transparent via-royal-500/30 to-transparent w-1/3"
              style={{ top: `${20 + i * 15}%` }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6 border border-royal-600/30"
          >
            <FiCpu className="text-royal-400" size={14} />
            <span className="text-royal-300 text-xs font-medium tracking-widest uppercase">Innovation Lab</span>
            <FiZap className="text-royal-400" size={12} />
          </motion.div>

          <AnimatedSection>
            <h1 className="font-display text-5xl sm:text-7xl font-semibold text-white mb-6 leading-tight">
              AI &{' '}
              <span className="gradient-text">Robotics</span>
            </h1>
            <p className="text-silver-300 text-lg max-w-2xl mx-auto mb-10">
              Cutting-edge projects at the intersection of artificial intelligence, robotics, and emerging technologies. The future is being built here.
            </p>
          </AnimatedSection>

          {/* Stats bar */}
          <AnimatedSection delay={0.3}>
            <div className="inline-flex items-center gap-8 glass px-8 py-4 rounded-2xl border border-white/5">
              {[
                { label: 'AI Projects', value: '20+' },
                { label: 'Robotics', value: '15+' },
                { label: 'IoT Solutions', value: '10+' },
                { label: 'Research Papers', value: '25+' },
              ].map(({ label, value }, i) => (
                <div key={i} className="text-center">
                  <div className="font-display text-xl font-semibold gradient-text">{value}</div>
                  <div className="text-silver-500 text-xs">{label}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CATEGORY FILTER */}
      <section className="py-6 sticky top-16 z-30 glass-dark border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-medium tracking-wide transition-all ${
                  activeCategory === key
                    ? 'bg-royal-600 text-white shadow-royal'
                    : 'glass text-silver-400 hover:text-white border border-white/5 hover:border-royal-600/30'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS GRID */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="glass rounded-2xl overflow-hidden border border-white/5">
                  <div className="h-56 skeleton" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 skeleton rounded w-3/4" />
                    <div className="h-4 skeleton rounded" />
                    <div className="h-4 skeleton rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <FiBox className="mx-auto text-silver-600 mb-4" size={40} />
              <p className="text-silver-400">No projects found in this category.</p>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {projects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* INNOVATION LAB CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AnimatedSection direction="scale">
            <div className="glass rounded-3xl p-12 border border-royal-700/30 relative overflow-hidden">
              <div className="absolute inset-0 tech-grid opacity-20" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-royal-500/60 to-transparent" />
              <div className="relative z-10">
                <FiZap className="mx-auto text-royal-400 mb-6" size={36} />
                <h2 className="font-display text-4xl font-semibold text-white mb-4">
                  Have a Project in Mind?
                </h2>
                <p className="text-silver-300 mb-8">
                  Collaborate with us on cutting-edge AI and robotics research.
                </p>
                <Link
                  href="/contact"
                  className="btn-royal inline-flex items-center gap-2 text-white font-medium px-8 py-3.5 rounded-full text-sm"
                >
                  Start Collaboration
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
