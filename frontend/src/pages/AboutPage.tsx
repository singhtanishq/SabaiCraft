import { motion } from 'framer-motion';
import { Leaf, Heart, Sparkles, Award, Users, TreePine, Recycle, Hand } from 'lucide-react';
import { Card } from '@components/ui/Card';

const story = {
  title: 'Our Story',
  subtitle: 'Rooted in Tradition, Crafted for Tomorrow',
  paragraphs: [
    'In the heart of rural India, where Sabai grass grows wild and free, generations of artisans have woven their stories into every strand. What began as a humble craft for daily necessities has blossomed into an art form that celebrates sustainability, community, and timeless beauty.',
    'SabaiCraft was born from a simple belief: that the hands that create should be honored, the earth that provides should be protected, and the homes that receive should be enriched. We work directly with artisan communities, eliminating middlemen and ensuring that the value of their craft flows back to them.',
    'Every basket, mat, and accessory in our collection carries the fingerprint of its maker. The subtle variations in weave, the natural color shifts, the imperfections that make each piece unique — these are not flaws. They are the signature of human hands working in harmony with nature.',
  ],
};

const values = [
  {
    icon: Leaf,
    title: 'Sustainable Materials',
    description: 'We use 100% natural Sabai grass, a renewable resource that grows abundantly without pesticides or excessive water.',
  },
  {
    icon: Heart,
    title: 'Artisan Empowerment',
    description: 'Every purchase directly supports skilled artisans in rural communities, preserving traditional livelihoods and cultural heritage.',
  },
  {
    icon: Sparkles,
    title: 'Timeless Craftsmanship',
    description: 'Each piece is handwoven using techniques passed down through generations, ensuring unmatched quality and durability.',
  },
  {
    icon: Award,
    title: 'Fair Trade Practices',
    description: 'We ensure fair wages, safe working conditions, and respect for the cultural heritage of our artisans.',
  },
];

const impactStats = [
  { value: '500+', label: 'Artisans Supported' },
  { value: '50+', label: 'Villages Reached' },
  { value: '100%', label: 'Natural Materials' },
  { value: '0%', label: 'Plastic Packaging' },
];

const team = [
  { name: 'Priya Sharma', role: 'Founder & CEO', bio: 'Passionate about preserving traditional crafts and empowering rural artisans.' },
  { name: 'Rajesh Kumar', role: 'Head of Operations', bio: 'Ensures seamless delivery of artisan products to your doorstep.' },
  { name: 'Anita Desai', role: 'Design Lead', bio: 'Blends traditional techniques with contemporary aesthetics.' },
  { name: 'Vikram Singh', role: 'Community Manager', bio: 'Works directly with artisan communities to understand their needs.' },
];

export function AboutPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <section className="relative bg-olive-950 text-cream-50 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/Images/sabai mascot.png')] bg-center bg-cover opacity-[0.03]" />
        <div className="absolute inset-0 bg-gradient-to-br from-olive-950 via-olive-900 to-sage-800" />

        <div className="container-main relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
              <Leaf className="w-4 h-4 text-sabai-300" />
              <span className="text-body-sm font-medium">Our Story</span>
            </div>
            <h1 className="heading-display text-display-xl lg:text-display-lg mb-6 text-balance">
              {story.subtitle}
            </h1>
            <p className="body-lg text-olive-300 max-w-2xl mx-auto text-pretty">
              Discover the journey behind every handwoven treasure
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-lg">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="heading-1 text-balance">{story.title}</h2>
              <div className="space-y-4 text-olive-700">
                {story.paragraphs.map((paragraph, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="body-lg leading-relaxed"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                {values.map((value, index) => (
                  <motion.article
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.08 }}
                    className="card p-6 h-full"
                  >
                    <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center text-sage-600 mb-4">
                      <value.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-medium text-olive-950 text-heading-sm mb-2">
                      {value.title}
                    </h3>
                    <p className="text-olive-600 text-body-sm leading-relaxed">
                      {value.description}
                    </p>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="section-lg bg-olive-50/50">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-12 lg:mb-16"
          >
            <h2 className="heading-1 mb-4">Our Impact</h2>
            <p className="body-lg text-olive-600">Every purchase creates a ripple of positive change</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {impactStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                className="card p-8 text-center"
              >
                <div className="font-display font-medium text-olive-950 text-display-lg mb-2 text-sage-600">
                  {stat.value}
                </div>
                <p className="text-olive-600 text-body-sm font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-lg">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-12 lg:mb-16"
          >
            <h2 className="heading-1 mb-4">Meet Our Team</h2>
            <p className="body-lg text-olive-600">The people behind SabaiCraft</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.article
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                className="card p-6 text-center"
              >
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-sage-100 flex items-center justify-center">
                  <Users className="w-10 h-10 text-sage-600" />
                </div>
                <h3 className="font-display font-medium text-olive-950 text-heading-md">{member.name}</h3>
                <p className="text-sage-600 text-body-sm font-medium mb-2">{member.role}</p>
                <p className="text-olive-600 text-body-sm">{member.bio}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-lg bg-olive-50/50">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-12 lg:mb-16"
          >
            <h2 className="heading-1 mb-4">From Grass to Grace</h2>
            <p className="body-lg text-olive-600">The journey of every SabaiCraft treasure</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { icon: TreePine, step: 1, title: 'Harvest', desc: 'Sabai grass is sustainably harvested from wild grasslands during peak season.' },
              { icon: Recycle, step: 2, title: 'Process', desc: 'Grass is dried, split, and prepared using traditional methods without chemicals.' },
              { icon: Hand, step: 3, title: 'Weave', desc: 'Master artisans handweave each piece using techniques passed down generations.' },
              { icon: Sparkles, step: 4, title: 'Finish', desc: 'Each piece is quality-checked, finished, and packaged in plastic-free materials.' },
            ].map((step, index) => (
              <motion.article
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                className="card p-6 relative"
              >
                <div className="absolute -top-4 left-6 w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center text-sage-600 font-display font-medium text-heading-xl">
                  {step.step}
                </div>
                <div className="pt-8">
                  <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center text-sage-600 mb-4">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-medium text-olive-950 text-heading-md mb-2">{step.title}</h3>
                  <p className="text-olive-600 text-body-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-lg">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden bg-olive-950 text-cream-50 p-8 lg:p-16 text-center"
          >
            <div className="absolute inset-0 bg-[url('/Images/sabai mascot.png')] bg-center bg-cover opacity-[0.05]" />
            <div className="relative max-w-2xl mx-auto">
              <h2 className="heading-1 mb-4">Bring Home a Piece of Heritage</h2>
              <p className="body-lg text-olive-300 mb-8">
                Every purchase supports artisan communities and sustainable practices.
              </p>
              <a
                href="/shop"
                className="inline-flex items-center gap-2 px-8 py-4 bg-sabai-500 text-olive-950 font-medium rounded-xl hover:bg-sabai-400 transition-colors"
              >
                Shop Collection
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

import { ChevronRight } from 'lucide-react';