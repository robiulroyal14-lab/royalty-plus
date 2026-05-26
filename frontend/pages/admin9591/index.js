import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiLock, FiUser, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace('/admin9591/dashboard');
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      toast.error('Please enter credentials');
      return;
    }
    setLoading(true);
    try {
      await login(form.username, form.password);
      toast.success('Welcome back!');
      router.push('/admin9591/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Access</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen bg-royal-950 flex items-center justify-center relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 tech-grid opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-royal-950 via-royal-900/30 to-royal-950" />
        
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-royal-700/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-royal-600/8 rounded-full blur-3xl" />

        {/* Scanning line animation */}
        <motion.div
          animate={{ y: ['0vh', '100vh'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-royal-500/30 to-transparent pointer-events-none"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-md px-4"
        >
          <div className="glass-dark rounded-3xl p-8 border border-white/8 shadow-glass">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 bg-royal-600/30 blur-xl rounded-full" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-royal-600/40 to-royal-800/60 border border-royal-500/30 flex items-center justify-center mx-auto">
                  <FiShield className="text-royal-300" size={28} />
                </div>
              </div>
              <h1 className="font-display text-3xl font-semibold text-white mb-1">
                Royalty Plus
              </h1>
              <p className="text-silver-500 text-sm">Admin Control Panel</p>
              
              {/* Security indicator */}
              <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 text-xs">Secure Connection</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-silver-400 text-xs uppercase tracking-widest mb-2">
                  Username
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-silver-600" size={15} />
                  <input
                    type="text"
                    value={form.username}
                    onChange={e => setForm({ ...form, username: e.target.value })}
                    placeholder="Enter username"
                    className="w-full input-dark rounded-xl pl-10 pr-4 py-3 text-sm"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-silver-400 text-xs uppercase tracking-widest mb-2">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-silver-600" size={15} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="Enter password"
                    className="w-full input-dark rounded-xl pl-10 pr-10 py-3 text-sm"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-silver-600 hover:text-silver-400 transition-colors"
                  >
                    {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-royal text-white font-medium py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Authenticating...</>
                ) : (
                  <><FiLock size={15} /> Access Dashboard</>
                )}
              </motion.button>
            </form>

            <p className="text-center text-silver-700 text-xs mt-6">
              Protected area — unauthorized access prohibited
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
