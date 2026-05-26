import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';

export default function NotFound() {
  return (
    <Layout title="404 - Page Not Found">
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 tech-grid opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-royal-950 via-royal-900/20 to-royal-950" />
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="font-display text-[10rem] sm:text-[14rem] font-bold leading-none gradient-text opacity-20 select-none">
              404
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-4 -mt-8">
              Page Not Found
            </h1>
            <p className="text-silver-400 mb-8 max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <Link href="/" className="btn-royal inline-flex items-center gap-2 text-white font-medium px-8 py-3.5 rounded-full text-sm">
              Back to Home
            </Link>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
