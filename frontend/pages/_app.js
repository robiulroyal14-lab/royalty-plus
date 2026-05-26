import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

export default function App({ Component, pageProps, router }) {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(15, 23, 42, 0.95)',
            color: '#f1f5f9',
            border: '1px solid rgba(29, 78, 216, 0.3)',
            backdropFilter: 'blur(20px)',
            fontFamily: 'Outfit, sans-serif',
          },
          success: { iconTheme: { primary: '#1d4ed8', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={router.route}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Component {...pageProps} />
        </motion.div>
      </AnimatePresence>
    </AuthProvider>
  );
}
