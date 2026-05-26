import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/research', label: 'Research' },
  { href: '/articles', label: 'Articles' },
  { href: '/ai-robotics', label: 'AI & Robotics' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [router.pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass-dark shadow-glass py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-royal-600 rounded-full opacity-20 group-hover:opacity-40 transition-opacity blur-sm" />
              <img
                src="/logo.png"
                alt="Royalty Plus"
                className="w-10 h-10 rounded-full object-cover relative z-10 ring-1 ring-royal-600/40 group-hover:ring-royal-400/60 transition-all"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-10 h-10 hidden items-center justify-center bg-royal-700 rounded-full text-white font-display font-bold text-lg relative z-10">R</div>
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-xl font-semibold text-white tracking-wide">Royalty</span>
              <span className="font-display text-xl font-light text-royal-300 ml-1.5 tracking-wider">Plus</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-300 rounded-lg group ${
                  router.pathname === link.href || (link.href !== '/' && router.pathname.startsWith(link.href))
                    ? 'text-royal-300'
                    : 'text-silver-300 hover:text-white'
                }`}
              >
                {router.pathname === link.href || (link.href !== '/' && router.pathname.startsWith(link.href)) ? (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-royal-800/40 border border-royal-600/30 rounded-lg"
                  />
                ) : (
                  <span className="absolute inset-0 rounded-lg group-hover:bg-white/5 transition-colors" />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* CTA + Mobile */}
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center gap-2 btn-royal text-white text-sm font-medium px-5 py-2.5 rounded-full"
            >
              Get in Touch
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden glass p-2 rounded-lg text-white"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 left-4 right-4 z-40 glass-dark rounded-2xl p-6 lg:hidden"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      router.pathname === link.href
                        ? 'bg-royal-700/40 text-royal-300 border border-royal-600/30'
                        : 'text-silver-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
