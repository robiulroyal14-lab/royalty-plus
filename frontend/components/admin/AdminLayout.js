import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  FiGrid, FiBox, FiFileText, FiBookOpen, FiCpu,
  FiMail, FiTag, FiImage, FiLogOut, FiMenu, FiX,
  FiShield, FiChevronRight
} from 'react-icons/fi';

const navItems = [
  { href: '/admin9591/dashboard', icon: FiGrid, label: 'Dashboard' },
  { href: '/admin9591/products', icon: FiBox, label: 'Products' },
  { href: '/admin9591/articles', icon: FiFileText, label: 'Articles' },
  { href: '/admin9591/research', icon: FiBookOpen, label: 'Research' },
  { href: '/admin9591/ai-projects', icon: FiCpu, label: 'AI Projects' },
  { href: '/admin9591/contacts', icon: FiMail, label: 'Contacts' },
  { href: '/admin9591/categories', icon: FiTag, label: 'Categories' },
  { href: '/admin9591/media', icon: FiImage, label: 'Media' },
];

export default function AdminLayout({ children, title = 'Dashboard' }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/admin9591');
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-royal-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-royal-600/30 border-t-royal-400 rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/admin9591');
  };

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full ${mobile ? '' : 'w-60 flex-shrink-0'}`}>
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-royal-600/30 border border-royal-500/30 flex items-center justify-center">
            <FiShield className="text-royal-400" size={16} />
          </div>
          <div>
            <span className="font-display text-sm font-semibold text-white">Admin Panel</span>
            <p className="text-royal-500 text-xs">Royalty Plus</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = router.pathname === href || router.pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${
                active
                  ? 'bg-royal-700/40 text-white border border-royal-600/30'
                  : 'text-silver-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={16} className={active ? 'text-royal-400' : 'text-silver-500 group-hover:text-silver-300'} />
              <span className="flex-1">{label}</span>
              {active && <FiChevronRight size={12} className="text-royal-500" />}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-royal-700/40 border border-royal-600/30 flex items-center justify-center">
            <span className="text-xs font-bold text-royal-300">{user.username[0].toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{user.username}</p>
            <p className="text-silver-600 text-xs capitalize">{user.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-silver-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm"
        >
          <FiLogOut size={14} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>{title} | Royalty Plus Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen bg-royal-950 flex">
        {/* Desktop sidebar */}
        <div className="hidden lg:flex flex-col admin-sidebar fixed left-0 top-0 bottom-0 w-60 z-40">
          <Sidebar />
        </div>

        {/* Mobile sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              />
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: 'spring', damping: 30 }}
                className="fixed left-0 top-0 bottom-0 w-64 admin-sidebar z-50 lg:hidden flex flex-col"
              >
                <div className="flex justify-end p-4">
                  <button onClick={() => setSidebarOpen(false)} className="text-silver-400 hover:text-white">
                    <FiX size={20} />
                  </button>
                </div>
                <Sidebar mobile />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
          {/* Top bar */}
          <header className="glass-dark border-b border-white/5 px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-silver-400 hover:text-white"
            >
              <FiMenu size={20} />
            </button>
            <h1 className="font-display text-xl font-medium text-white flex-1">{title}</h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-silver-500 text-xs hidden sm:block">System Online</span>
            </div>
          </header>

          <main className="flex-1 p-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </>
  );
}
