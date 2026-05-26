import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiGithub, FiTwitter, FiLinkedin, FiYoutube, FiMail, FiPhone } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="relative bg-royal-950 border-t border-white/5 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-royal-600/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-royal-800/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-royal-700/40 border border-royal-600/30 flex items-center justify-center">
                <span className="font-display text-lg font-bold text-white">R</span>
              </div>
              <div>
                <span className="font-display text-lg font-semibold text-white">Royalty</span>
                <span className="font-display text-lg font-light text-royal-300 ml-1">Plus</span>
              </div>
            </div>
            <p className="text-silver-400 text-sm leading-relaxed mb-6">
              A premium technology brand pioneering AI, robotics, and innovation for a smarter future.
            </p>
            <div className="flex items-center gap-3">
              {[
                { Icon: FiGithub, href: '#' },
                { Icon: FiTwitter, href: '#' },
                { Icon: FiLinkedin, href: '#' },
                { Icon: FiYoutube, href: '#' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 glass rounded-lg flex items-center justify-center text-silver-400 hover:text-white hover:border-royal-600/40 transition-all hover:shadow-royal"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Navigation</h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Products', href: '/products' },
                { label: 'Research', href: '/research' },
                { label: 'Articles', href: '/articles' },
                { label: 'AI & Robotics', href: '/ai-robotics' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-silver-400 hover:text-royal-300 text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Company</h3>
            <ul className="space-y-3">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'Privacy Policy', href: '#' },
                { label: 'Terms of Service', href: '#' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-silver-400 hover:text-royal-300 text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-silver-400">
                <FiMail size={14} className="text-royal-400 flex-shrink-0" />
                <a href="mailto:info@royaltyplus.com" className="hover:text-white transition-colors">
                  info@royaltyplus.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-silver-400">
                <FiPhone size={14} className="text-royal-400 flex-shrink-0" />
                <a href="tel:+1234567890" className="hover:text-white transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-silver-500 text-xs">
            © {new Date().getFullYear()} Royalty Plus. All rights reserved.
          </p>
          <p className="text-silver-500 text-xs">
            Designed for the future · Built with precision
          </p>
        </div>
      </div>
    </footer>
  );
}
