import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Leaf, Heart, Sparkles, Award } from 'lucide-react';
import { cn } from '../../utils/cn';

const values = [
  {
    icon: Leaf,
    title: 'Sustainable Materials',
    description: 'We use 100% natural Sabai grass, a renewable resource that grows abundantly without pesticides or excessive water.',
  },
  {
    icon: Heart,
    title: 'Artisan Empowerment',
    description: 'Every purchase directly supports skilled artisans in rural communities, preserving traditional livelihoods.',
  },
  {
    icon: Sparkles,
    title: 'Timeless Craftsmanship',
    description: 'Each piece is handwoven using techniques passed down through generations, ensuring unmatched quality.',
  },
  {
    icon: Award,
    title: 'Fair Trade Practices',
    description: 'We ensure fair wages, safe working conditions, and respect for the cultural heritage of our artisans.',
  },
];

const storyContent = {
  title: 'Our Story',
  subtitle: 'Rooted in Tradition, Crafted for Tomorrow',
  paragraphs: [
    'In the heart of rural India, where Sabai grass grows wild and free, generations of artisans have woven their stories into every strand. What began as a humble craft for daily necessities has blossomed into an art form that celebrates sustainability, community, and timeless beauty.',
    'SabaiCraft was born from a simple belief: that the hands that create should be honored, the earth that provides should be protected, and the homes that receive should be enriched. We work directly with artisan communities, eliminating middlemen and ensuring that the value of their craft flows back to them.',
    'Every basket, mat, and accessory in our collection carries the fingerprint of its maker. The subtle variations in weave, the natural color shifts, the imperfections that make each piece unique — these are not flaws. They are the signature of human hands working in harmony with nature.',
  ],
};

export function StorySection() {
  return (
    <section className="section-lg" aria-labelledby="story-heading">
      <div className="container-main">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-100 text-sage-800 text-body-sm font-medium mb-4">
              <Leaf className="w-4 h-4" aria-hidden="true" />
              Our Story
            </div>

            <h2 id="story-heading" className="heading-1 text-balance">
              {storyContent.subtitle}
            </h2>

            <div className="space-y-4 text-olive-700">
              {storyContent.paragraphs.map((paragraph, index) => (
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="pt-4 border-t border-olive-200"
            >
              <a
                to="/about"
                className="inline-flex items-center gap-2 text-sage-600 hover:text-sage-700 font-medium text-body"
              >
                Read Our Full Story
                <motion.span
                  whileHover={{ x: 4 }}
                  className="transition-transform"
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Values Grid */}
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
                    <value.icon className="w-6 h-6" aria-hidden="true" />
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
  );
}