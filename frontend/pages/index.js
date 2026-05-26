import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import Layout from '../components/layout/Layout';
import ParticleBackground from '../components/ui/ParticleBackground';
import AnimatedSection, { StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { FiArrowRight, FiZap, FiCpu, FiGlobe, FiAward, FiTrendingUp, FiUsers } from 'react-icons/fi';

// Stats counter hook
function useCounter(end, duration = 2000, start = 0) {
  const [count, setCount] = useState(start);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * (end - start) + start));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, end, start, duration]);

  return [count, setActive];
}

function StatCard({ value, suffix, label, icon: Icon, delay }) {
  const [count, setActive] = useCounter(value);
  const { ref, inView } = require('react-intersection-observer').useInView({ threshold: 0.3, triggerOnce: true });

  useEffect(() => {
    if (inView) setActive(true);
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6 }}
      className="glass rounded-2xl p-6 text-center border border-royal-700/20 glow-on-hover group"
    >
      <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-royal-800/40 border border-royal-600/20 flex items-center justify-center group-hover:border-royal-500/40 transition-colors">
        <Icon className="text-royal-400 group-hover:text-royal-300 transition-colors" size={22} />
      </div>
      <div className="font-display text-4xl font-semibold gradient-text mb-1">
        {count}{suffix}
      </div>
      <div className="text-silver-400 text-sm">{label}</div>
    </motion.div>
  );
}

const features = [
  {
    icon: FiCpu,
    title: 'Advanced AI Systems',
    description: 'Cutting-edge artificial intelligence solutions that push the boundaries of what\'s possible.',
  },
  {
    icon: FiZap,
    title: 'Robotics Innovation',
    description: 'Next-generation robotic systems designed for precision, efficiency, and intelligent automation.',
  },
  {
    icon: FiGlobe,
    title: 'IoT Ecosystems',
    description: 'Interconnected device networks that transform how the world communicates and operates.',
  },
];

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <Layout title="Royalty Plus" description="Premium AI & Robotics Technology Brand">
      <ParticleBackground density={50} />

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden tech-grid">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-royal-950 via-royal-900/90 to-royal-800/50" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-royal-950 to-transparent z-10" />
        
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-royal-600/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-royal-500/8 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 text-center max-w-5xl mx-auto px-4"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 border border-royal-600/30"
          >
            <span className="w-2 h-2 bg-royal-400 rounded-full animate-pulse" />
            <span className="text-royal-300 text-sm font-medium tracking-wide">Next-Generation Technology</span>
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, type: 'spring' }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-royal-600/30 blur-2xl rounded-full scale-150" />
              <img
                src="/logo.png"
                alt="Royalty Plus"
                className="w-28 h-28 rounded-full relative z-10 ring-2 ring-royal-500/30 animate-float"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-28 h-28 rounded-full hidden items-center justify-center bg-gradient-to-br from-royal-600 to-royal-800 relative z-10 animate-float">
                <span className="font-display text-4xl font-bold text-white">R</span>
              </div>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <h1 className="font-display text-6xl sm:text-7xl md:text-8xl font-semibold text-white leading-tight mb-2">
              Royalty
            </h1>
            <h1 className="font-display text-6xl sm:text-7xl md:text-8xl font-light gradient-text leading-tight mb-6">
              Plus
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-silver-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Pioneering the future through advanced AI, cutting-edge robotics, and revolutionary technology solutions that redefine what's possible.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/ai-robotics"
              className="btn-royal inline-flex items-center gap-2 text-white font-medium px-8 py-3.5 rounded-full text-sm tracking-wide"
            >
              Explore AI & Robotics
              <FiArrowRight size={16} />
            </Link>
            <Link
              href="/products"
              className="btn-ghost inline-flex items-center gap-2 text-silver-200 font-medium px-8 py-3.5 rounded-full text-sm tracking-wide"
            >
              View Products
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
          <span className="text-silver-500 text-xs tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-silver-600/40 flex items-start justify-center p-1"
          >
            <div className="w-1 h-2 bg-royal-400 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard value={150} suffix="+" label="Projects Completed" icon={FiAward} delay={0} />
            <StatCard value={50} suffix="+" label="AI Solutions" icon={FiCpu} delay={0.1} />
            <StatCard value={25} suffix="+" label="Research Papers" icon={FiTrendingUp} delay={0.2} />
            <StatCard value={10} suffix="K+" label="Community Members" icon={FiUsers} delay={0.3} />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-royal-400 text-sm font-medium tracking-widest uppercase mb-3">What We Do</p>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-white mb-4">
              Innovation at Every Layer
            </h2>
            <p className="text-silver-400 max-w-xl mx-auto">
              From intelligent systems to advanced automation, we're building the technologies that will define the next decade.
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6" stagger={0.15}>
            {features.map((f, i) => (
              <StaggerItem key={i}>
                <div className="glass rounded-2xl p-8 h-full border border-white/5 glow-on-hover group transition-all duration-300 hover:border-royal-700/40">
                  <div className="w-14 h-14 rounded-2xl bg-royal-800/60 border border-royal-700/40 flex items-center justify-center mb-6 group-hover:border-royal-500/40 group-hover:bg-royal-700/40 transition-all">
                    <f.icon className="text-royal-400 group-hover:text-royal-300 transition-colors" size={26} />
                  </div>
                  <h3 className="font-display text-2xl font-medium text-white mb-3">{f.title}</h3>
                  <p className="text-silver-400 leading-relaxed text-sm">{f.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* AI & ROBOTICS PREVIEW */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-royal-950 via-royal-900/30 to-royal-950" />
        <div className="absolute inset-0 tech-grid opacity-30" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left">
              <p className="text-royal-400 text-sm font-medium tracking-widest uppercase mb-4">AI & Robotics</p>
              <h2 className="font-display text-4xl sm:text-5xl font-semibold text-white mb-6 leading-tight">
                Building the Machines of Tomorrow
              </h2>
              <p className="text-silver-300 leading-relaxed mb-8">
                Our AI and robotics division pushes the frontier of autonomous systems, machine learning, and computer vision to create intelligent machines that enhance human capability.
              </p>
              <Link
                href="/ai-robotics"
                className="btn-royal inline-flex items-center gap-2 text-white font-medium px-7 py-3 rounded-full text-sm"
              >
                Explore Projects <FiArrowRight size={16} />
              </Link>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Machine Learning', color: 'from-blue-600/20 to-blue-800/10' },
                  { label: 'Computer Vision', color: 'from-indigo-600/20 to-indigo-800/10' },
                  { label: 'IoT Systems', color: 'from-cyan-600/20 to-cyan-800/10' },
                  { label: 'Automation', color: 'from-royal-600/20 to-royal-800/10' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05, y: -4 }}
                    className={`bg-gradient-to-br ${item.color} glass rounded-xl p-5 border border-white/10 cursor-default`}
                  >
                    <div className="w-8 h-8 bg-royal-600/40 rounded-lg mb-3" />
                    <p className="text-white text-sm font-medium">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-white mb-4">
              Trusted by Innovators
            </h2>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6" stagger={0.1}>
            {[
              {
                quote: "Royalty Plus has completely transformed our approach to AI integration. Their solutions are unmatched.",
                name: "Dr. Sarah Chen",
                role: "CTO, TechVentures",
              },
              {
                quote: "The robotics solutions provided by Royalty Plus have increased our production efficiency by over 300%.",
                name: "Marcus Johnson",
                role: "Operations Director",
              },
              {
                quote: "Working with Royalty Plus feels like being 5 years ahead of everyone else in the industry.",
                name: "Aisha Rahman",
                role: "Head of Innovation",
              },
            ].map((t, i) => (
              <StaggerItem key={i}>
                <div className="glass rounded-2xl p-7 h-full border border-white/5 relative">
                  <div className="font-display text-5xl text-royal-600/40 leading-none mb-4">"</div>
                  <p className="text-silver-300 text-sm leading-relaxed mb-6">{t.quote}</p>
                  <div>
                    <p className="text-white font-medium text-sm">{t.name}</p>
                    <p className="text-silver-500 text-xs mt-0.5">{t.role}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AnimatedSection direction="scale">
            <div className="glass rounded-3xl p-12 border border-royal-700/30 glow-blue relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-royal-800/20 to-transparent" />
              <div className="relative z-10">
                <h2 className="font-display text-4xl sm:text-5xl font-semibold text-white mb-4">
                  Ready to Elevate Your Vision?
                </h2>
                <p className="text-silver-300 mb-8 max-w-xl mx-auto">
                  Join the future of technology. Let's build something extraordinary together.
                </p>
                <Link
                  href="/contact"
                  className="btn-royal inline-flex items-center gap-2 text-white font-medium px-8 py-4 rounded-full text-sm tracking-wide"
                >
                  Start a Project <FiArrowRight size={16} />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
