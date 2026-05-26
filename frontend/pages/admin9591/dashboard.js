import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AdminLayout from '../../components/admin/AdminLayout';
import { dashboardAPI } from '../../lib/api';
import { FiBox, FiFileText, FiBookOpen, FiCpu, FiMail, FiTrendingUp, FiArrowRight, FiRefreshCw } from 'react-icons/fi';

function StatCard({ icon: Icon, label, value, sub, color, href, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Link href={href || '#'}>
        <div className="glass rounded-xl p-5 border border-white/5 hover:border-royal-600/30 transition-all group cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
              <Icon size={18} className="text-white" />
            </div>
            <FiArrowRight size={14} className="text-silver-600 group-hover:text-royal-400 group-hover:translate-x-1 transition-all" />
          </div>
          <div className="font-display text-3xl font-semibold text-white mb-1">{value ?? '—'}</div>
          <div className="text-silver-400 text-sm">{label}</div>
          {sub && <div className="text-silver-600 text-xs mt-1">{sub}</div>}
        </div>
      </Link>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data } = await dashboardAPI.getStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  return (
    <AdminLayout title="Dashboard">
      {/* Welcome */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-2xl font-medium text-white mb-1">Overview</h2>
          <p className="text-silver-500 text-sm">Manage your Royalty Plus content and monitor activity.</p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 glass px-4 py-2 rounded-xl text-silver-400 hover:text-white text-sm border border-white/5 hover:border-royal-600/30 transition-all"
        >
          <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="glass rounded-xl p-5 border border-white/5 h-28 skeleton" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          <StatCard icon={FiBox} label="Products" value={stats?.products?.total} sub={`${stats?.products?.active} active`} color="bg-blue-600/40" href="/admin9591/products" delay={0} />
          <StatCard icon={FiFileText} label="Articles" value={stats?.articles?.total} sub={`${stats?.articles?.published} published`} color="bg-indigo-600/40" href="/admin9591/articles" delay={0.05} />
          <StatCard icon={FiBookOpen} label="Research" value={stats?.research?.total} sub={`${stats?.research?.published} published`} color="bg-violet-600/40" href="/admin9591/research" delay={0.1} />
          <StatCard icon={FiCpu} label="AI Projects" value={stats?.aiProjects?.total} sub={`${stats?.aiProjects?.active} active`} color="bg-cyan-600/40" href="/admin9591/ai-projects" delay={0.15} />
          <StatCard icon={FiMail} label="Messages" value={stats?.contacts?.total} sub={`${stats?.contacts?.unread} unread`} color="bg-rose-600/40" href="/admin9591/contacts" delay={0.2} />
        </div>
      )}

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent messages */}
        <div className="glass rounded-xl border border-white/5 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <h3 className="text-white font-medium text-sm flex items-center gap-2">
              <FiMail size={14} className="text-rose-400" /> Recent Messages
            </h3>
            <Link href="/admin9591/contacts" className="text-royal-400 text-xs hover:text-royal-300">View all →</Link>
          </div>
          <div className="divide-y divide-white/5">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="px-5 py-3 flex gap-3">
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 skeleton rounded w-1/2" />
                    <div className="h-3 skeleton rounded w-3/4" />
                  </div>
                </div>
              ))
            ) : stats?.recent?.contacts?.length === 0 ? (
              <p className="px-5 py-8 text-center text-silver-600 text-sm">No messages yet</p>
            ) : (
              stats?.recent?.contacts?.map((c, i) => (
                <div key={i} className="px-5 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-royal-800/40 border border-royal-700/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-royal-400">{c.name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{c.name}</p>
                    <p className="text-silver-500 text-xs truncate">{c.subject || c.message?.slice(0, 40)}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 flex-shrink-0">new</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent articles */}
        <div className="glass rounded-xl border border-white/5 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <h3 className="text-white font-medium text-sm flex items-center gap-2">
              <FiTrendingUp size={14} className="text-royal-400" /> Recent Articles
            </h3>
            <Link href="/admin9591/articles" className="text-royal-400 text-xs hover:text-royal-300">View all →</Link>
          </div>
          <div className="divide-y divide-white/5">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="px-5 py-3 space-y-1.5">
                  <div className="h-3.5 skeleton rounded w-2/3" />
                  <div className="h-3 skeleton rounded w-1/3" />
                </div>
              ))
            ) : stats?.recent?.articles?.length === 0 ? (
              <p className="px-5 py-8 text-center text-silver-600 text-sm">No articles yet</p>
            ) : (
              stats?.recent?.articles?.map((a, i) => (
                <div key={i} className="px-5 py-3">
                  <p className="text-white text-sm font-medium truncate">{a.title}</p>
                  <div className="flex gap-3 mt-0.5 text-xs text-silver-500">
                    <span>{a.views || 0} views</span>
                    <span>{new Date(a.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6">
        <h3 className="text-silver-400 text-xs uppercase tracking-widest mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { label: '+ New Product', href: '/admin9591/products?action=new' },
            { label: '+ New Article', href: '/admin9591/articles?action=new' },
            { label: '+ New Research', href: '/admin9591/research?action=new' },
            { label: '+ New AI Project', href: '/admin9591/ai-projects?action=new' },
          ].map(({ label, href }) => (
            <Link key={href} href={href}
              className="btn-ghost text-white text-sm px-4 py-2 rounded-xl transition-all">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
