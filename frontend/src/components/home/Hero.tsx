import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

export function Hero() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-heading">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-olive-50 via-cream-50 to-sage-50" />
        <div className="absolute inset-0 bg-[url('/Images/sabai mascot.png')] bg-center bg-cover opacity-[0.02]" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-olive-950/5 via-transparent to-sage-600/5" />
      </div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 rounded-full bg-sabai-300/20 blur-3xl"
        animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-sage-300/20 blur-3xl"
        animate={{ x: [0, -25, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-olive-300/10 blur-3xl"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />

      <div className="container-main relative py-20 lg:py-28 xl:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-olive-200 mb-8"
          >
            <Leaf className="w-4 h-4 text-sage-600" aria-hidden="true" />
            <span className="text-body-sm font-medium text-olive-700">Handcrafted • Sustainable • Artisan Made</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="heading-display text-display-xl lg:text-display-lg mb-6 text-balance"
          >
            Crafting Treasures,{' '}
            <span className="gradient-text">Connecting Hearts</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="body-lg text-olive-600 max-w-2xl mx-auto mb-10 text-pretty"
          >
            Discover handwoven Sabai grass treasures crafted by skilled artisans.
            Sustainable, beautiful, and built to last generations.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              asChild
              size="lg"
              variant="primary"
              className="group"
            >
              <Link to="/shop">
                Shop Collection
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
            >
              <Link to="/about">Our Story</Link>
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-12 text-body-sm text-olive-600"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sabai-500" aria-hidden="true" />
              <span>100% Natural</span>
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-sage-600" aria-hidden="true" />
              <span>Eco-Friendly</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-olive-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </span>
              <span>Artisan Crafted</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-sage-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </span>
              <span>Fast Shipping</span>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce-subtle"
          aria-hidden="true"
        >
          <svg className="w-6 h-6 text-olive-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}