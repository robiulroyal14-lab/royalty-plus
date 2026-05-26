import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import AnimatedSection from '../../components/ui/AnimatedSection';
import { contactsAPI } from '../../lib/api';
import toast from 'react-hot-toast';
import { FiMail, FiPhone, FiMessageSquare, FiSend, FiLinkedin, FiGithub, FiTwitter, FiYoutube } from 'react-icons/fi';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill required fields');
      return;
    }
    setLoading(true);
    try {
      await contactsAPI.send(form);
      toast.success('Message sent! We\'ll get back to you soon.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Contact" description="Get in touch with Royalty Plus">
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-royal-900/60 to-royal-950" />
        <div className="absolute inset-0 tech-grid opacity-20" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <AnimatedSection>
            <p className="text-royal-400 text-sm font-medium tracking-widest uppercase mb-3">Get In Touch</p>
            <h1 className="font-display text-5xl sm:text-6xl font-semibold text-white mb-4">
              Let's Build Something <span className="gradient-text">Great</span>
            </h1>
            <p className="text-silver-400 max-w-xl mx-auto">
              Have a project, collaboration, or just want to connect? We'd love to hear from you.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Info */}
            <AnimatedSection direction="left" className="lg:col-span-2 space-y-6">
              {/* Contact cards */}
              {[
                { icon: FiMail, label: 'Email', value: 'info@royaltyplus.com', href: 'mailto:info@royaltyplus.com' },
                { icon: FiPhone, label: 'Phone', value: '+1 (234) 567-890', href: 'tel:+1234567890' },
                { icon: FiMessageSquare, label: 'WhatsApp', value: 'Chat with us', href: 'https://wa.me/1234567890' },
              ].map(({ icon: Icon, label, value, href }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 glass rounded-xl p-4 border border-white/5 hover:border-royal-600/30 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-royal-800/40 border border-royal-700/30 flex items-center justify-center group-hover:border-royal-500/40 transition-colors">
                    <Icon className="text-royal-400" size={18} />
                  </div>
                  <div>
                    <p className="text-silver-500 text-xs mb-0.5">{label}</p>
                    <p className="text-white text-sm font-medium">{value}</p>
                  </div>
                </motion.a>
              ))}

              {/* Social links */}
              <div className="glass rounded-xl p-5 border border-white/5">
                <p className="text-silver-500 text-xs uppercase tracking-widest mb-4">Follow Us</p>
                <div className="flex gap-3">
                  {[
                    { Icon: FiGithub, href: '#', color: 'hover:text-white' },
                    { Icon: FiTwitter, href: '#', color: 'hover:text-sky-400' },
                    { Icon: FiLinkedin, href: '#', color: 'hover:text-blue-400' },
                    { Icon: FiYoutube, href: '#', color: 'hover:text-red-400' },
                  ].map(({ Icon, href, color }, i) => (
                    <a
                      key={i}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 glass rounded-lg flex items-center justify-center text-silver-500 ${color} border border-white/5 hover:border-white/20 transition-all`}
                    >
                      <Icon size={16} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Map placeholder */}
              <div className="glass rounded-xl overflow-hidden border border-white/5 h-48 flex items-center justify-center relative">
                <div className="absolute inset-0 tech-grid opacity-30" />
                <div className="relative z-10 text-center">
                  <div className="w-8 h-8 bg-royal-600 rounded-full mx-auto mb-2 flex items-center justify-center animate-pulse">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                  <p className="text-silver-400 text-sm">Dhaka, Bangladesh</p>
                  <p className="text-silver-600 text-xs">Global Technology Hub</p>
                </div>
              </div>
            </AnimatedSection>

            {/* Form */}
            <AnimatedSection direction="right" delay={0.1} className="lg:col-span-3">
              <div className="glass rounded-2xl p-8 border border-white/5">
                <h2 className="font-display text-2xl font-medium text-white mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-silver-400 text-xs mb-1.5 uppercase tracking-wide">Name *</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Your full name"
                        className="w-full input-dark rounded-xl px-4 py-3 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-silver-400 text-xs mb-1.5 uppercase tracking-wide">Email *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full input-dark rounded-xl px-4 py-3 text-sm"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-silver-400 text-xs mb-1.5 uppercase tracking-wide">Phone</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        placeholder="+880 xxx xxx xxxx"
                        className="w-full input-dark rounded-xl px-4 py-3 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-silver-400 text-xs mb-1.5 uppercase tracking-wide">Subject</label>
                      <input
                        type="text"
                        value={form.subject}
                        onChange={e => setForm({ ...form, subject: e.target.value })}
                        placeholder="Project inquiry"
                        className="w-full input-dark rounded-xl px-4 py-3 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-silver-400 text-xs mb-1.5 uppercase tracking-wide">Message *</label>
                    <textarea
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us about your project or inquiry..."
                      rows={5}
                      className="w-full input-dark rounded-xl px-4 py-3 text-sm resize-none"
                      required
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full btn-royal text-white font-medium py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                    ) : (
                      <><FiSend size={16} /> Send Message</>
                    )}
                  </motion.button>
                </form>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </Layout>
  );
}
