import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import AnimatedSection, { StaggerContainer, StaggerItem } from '../../components/ui/AnimatedSection';
import { FiAward, FiTarget, FiEye, FiUsers, FiZap, FiGlobe } from 'react-icons/fi';

const team = [
  { name: 'Rahman Al-Farabi', role: 'Founder & CEO', bio: 'Visionary technologist with 15+ years in AI research.' },
  { name: 'Dr. Aisha Noor', role: 'Chief AI Officer', bio: 'PhD in Machine Learning from MIT. Leads all AI initiatives.' },
  { name: 'Marcus Chen', role: 'Head of Robotics', bio: 'Pioneer in autonomous robotic systems and computer vision.' },
  { name: 'Priya Sharma', role: 'CTO', bio: 'Full-stack architect specializing in scalable AI platforms.' },
];

const milestones = [
  { year: '2019', label: 'Founded', desc: 'Royalty Plus established with a vision to democratize advanced AI.' },
  { year: '2020', label: 'First AI Product', desc: 'Launched our flagship computer vision platform.' },
  { year: '2022', label: 'Robotics Division', desc: 'Expanded into industrial robotics and automation.' },
  { year: '2024', label: 'Global Reach', desc: 'Operating across 20+ countries with 10K+ community members.' },
];

export default function AboutPage() {
  return (
    <Layout title="About Us" description="The story behind Royalty Plus - our mission, vision and team">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-royal-900/60 to-royal-950" />
        <div className="absolute inset-0 tech-grid opacity-20" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <AnimatedSection>
            <p className="text-royal-400 text-sm font-medium tracking-widest uppercase mb-4">Our Story</p>
            <h1 className="font-display text-5xl sm:text-7xl font-semibold text-white mb-6 leading-tight">
              Redefining What's <span className="gradient-text">Possible</span>
            </h1>
            <p className="text-silver-300 text-lg leading-relaxed max-w-2xl mx-auto">
              Royalty Plus was born from a belief that advanced technology should be accessible, purposeful, and transformative. We build at the frontier so the world can move forward.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: FiEye,
                label: 'Our Vision',
                text: 'A world where intelligent machines and humans collaborate seamlessly — amplifying creativity, solving global challenges, and unlocking new dimensions of possibility.',
              },
              {
                icon: FiTarget,
                label: 'Our Mission',
                text: 'To pioneer breakthrough AI, robotics, and automation technologies that create real-world impact — delivered with precision, integrity, and an obsession for excellence.',
              },
            ].map(({ icon: Icon, label, text }, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <div className="glass rounded-2xl p-8 h-full border border-white/5 glow-on-hover group">
                  <div className="w-12 h-12 rounded-xl bg-royal-800/40 border border-royal-700/30 flex items-center justify-center mb-5 group-hover:border-royal-500/40 transition-colors">
                    <Icon className="text-royal-400" size={22} />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-white mb-3">{label}</h3>
                  <p className="text-silver-400 leading-relaxed">{text}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-14">
            <h2 className="font-display text-4xl font-semibold text-white mb-3">Our Journey</h2>
            <p className="text-silver-400">Milestones that define who we are.</p>
          </AnimatedSection>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-royal-600/60 via-royal-700/30 to-transparent" />
            {milestones.map((m, i) => (
              <AnimatedSection key={i} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.1}>
                <div className={`flex items-center gap-8 mb-10 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <div className="glass rounded-xl p-5 border border-white/5 inline-block max-w-xs">
                      <p className="text-royal-400 text-xs font-medium tracking-widest uppercase mb-1">{m.label}</p>
                      <p className="text-silver-300 text-sm leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-royal-800 border-2 border-royal-500 flex items-center justify-center shadow-royal">
                      <span className="font-display text-xs font-bold text-royal-300">{m.year}</span>
                    </div>
                  </div>
                  <div className="flex-1" />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-14">
            <h2 className="font-display text-4xl font-semibold text-white mb-3">The Team</h2>
            <p className="text-silver-400">Brilliant minds building the future.</p>
          </AnimatedSection>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" stagger={0.1}>
            {team.map((member, i) => (
              <StaggerItem key={i}>
                <div className="glass rounded-2xl p-6 text-center border border-white/5 glow-on-hover group">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-royal-600/40 to-royal-800/40 border border-royal-500/30 flex items-center justify-center mx-auto mb-4 group-hover:border-royal-400/50 transition-colors">
                    <span className="font-display text-2xl font-bold text-royal-300">{member.name[0]}</span>
                  </div>
                  <h3 className="font-medium text-white mb-1 text-sm">{member.name}</h3>
                  <p className="text-royal-400 text-xs mb-3 tracking-wide">{member.role}</p>
                  <p className="text-silver-500 text-xs leading-relaxed">{member.bio}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-14">
            <h2 className="font-display text-4xl font-semibold text-white mb-3">Our Values</h2>
          </AnimatedSection>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-6" stagger={0.1}>
            {[
              { icon: FiZap, title: 'Innovation First', desc: 'We never stop pushing the boundaries of what technology can achieve.' },
              { icon: FiUsers, title: 'Human-Centric', desc: 'Every solution we build is designed to enhance human life and potential.' },
              { icon: FiGlobe, title: 'Global Impact', desc: 'We build for the world — not just for today, but for generations to come.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <StaggerItem key={i}>
                <div className="glass rounded-2xl p-7 text-center border border-white/5 group glow-on-hover">
                  <div className="w-12 h-12 rounded-xl bg-royal-800/40 border border-royal-700/30 flex items-center justify-center mx-auto mb-5 group-hover:border-royal-500/40 transition-colors">
                    <Icon className="text-royal-400" size={22} />
                  </div>
                  <h3 className="font-display text-xl font-medium text-white mb-2">{title}</h3>
                  <p className="text-silver-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </Layout>
  );
}
