import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  X,
  Mail,
  MapPin,
  Phone,
  Truck,
  Shield,
  RotateCcw,
  Headphones,
  Leaf,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { FacebookIcon, InstagramIcon, YoutubeIcon, TwitterIcon } from '../ui/SocialIcons';

const footerLinks = {
  shop: [
    { name: 'All Products', href: '/shop' },
    { name: 'New Arrivals', href: '/shop?sort=newest' },
    { name: 'Best Sellers', href: '/shop?sort=popular' },
    { name: 'Categories', href: '/categories' },
    { name: 'Gift Cards', href: '/gift-cards' },
  ],
  support: [
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQs', href: '/faq' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns & Exchanges', href: '/returns' },
    { name: 'Track Order', href: '/track' },
  ],
  company: [
    { name: 'Our Story', href: '/about' },
    { name: 'Our Artisans', href: '/artisans' },
    { name: 'Sustainability', href: '/sustainability' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Accessibility', href: '/accessibility' },
  ],
};

const features = [
  { icon: Truck, title: 'Free Shipping', description: 'On orders over ₹2,000' },
  { icon: Shield, title: 'Secure Payment', description: '100% secure checkout' },
  { icon: RotateCcw, title: 'Easy Returns', description: '7-day return policy' },
  { icon: Headphones, title: 'Support 24/7', description: 'Dedicated support' },
];

const socialLinks = [
  { icon: FacebookIcon, href: 'https://facebook.com', label: 'Facebook' },
  { icon: InstagramIcon, href: 'https://instagram.com', label: 'Instagram' },
  { icon: TwitterIcon, href: 'https://x.com', label: 'Twitter' },
  { icon: YoutubeIcon, href: 'https://youtube.com', label: 'YouTube' },
];

const trustBadges = [
  { icon: Leaf, text: 'Eco-Friendly Materials' },
  { icon: Shield, text: 'Artisan Made' },
  { icon: RotateCcw, text: 'Sustainable Practices' },
  { icon: Leaf, text: 'Fair Trade' },
];

export function Footer() {
  return (
    <footer className="bg-olive-950 text-cream-50" role="contentinfo">
      {/* Trust Bar */}
      <div className="border-b border-olive-800">
        <div className="container-main py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 rounded-full bg-olive-800/50 flex items-center justify-center text-sabai-400">
                  <feature.icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-medium text-body-sm">{feature.title}</p>
                  <p className="text-olive-400 text-caption">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-main py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 xl:col-span-2"
          >
            <Link to="/" className="flex items-center gap-3 mb-6" aria-label="SabaiCraft Home">
              <img src="/Images/logo.png" alt="SabaiCraft" className="w-12 h-12" />
              <span className="font-display font-medium text-heading-lg text-cream-50">SabaiCraft</span>
            </Link>
            <p className="text-olive-300 text-body max-w-xs mb-6 leading-relaxed">
              Handcrafted treasures woven from sustainable Sabai grass. Empowering artisans,
              preserving heritage, and bringing natural elegance to your home.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4 mb-8">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-olive-800/50 flex items-center justify-center text-olive-300 hover:text-cream-50 hover:bg-olive-700 transition-all duration-fast"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <div className="max-w-xs">
              <h4 className="font-medium text-body-sm text-cream-50 mb-3">Stay Connected</h4>
              <p className="text-olive-400 text-caption mb-3">Subscribe for stories, launches & exclusive offers.</p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2.5 bg-olive-800/50 border border-olive-700 rounded-lg text-cream-50 placeholder-olive-400 text-sm focus:outline-none focus:border-sabai-500 focus:ring-2 focus:ring-sabai-500/20"
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-sabai-500 text-olive-950 font-medium rounded-lg hover:bg-sabai-400 transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </motion.div>

          {/* Shop Column */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            aria-label="Shop"
          >
            <h4 className="font-medium text-body-sm text-cream-50 uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-3" role="list">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-olive-300 hover:text-cream-50 transition-colors text-body-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>

          {/* Support Column */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            aria-label="Support"
          >
            <h4 className="font-medium text-body-sm text-cream-50 uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-3" role="list">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-olive-300 hover:text-cream-50 transition-colors text-body-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>

          {/* Company Column */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            aria-label="Company"
          >
            <h4 className="font-medium text-body-sm text-cream-50 uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3" role="list">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-olive-300 hover:text-cream-50 transition-colors text-body-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-olive-800">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {trustBadges.map((badge, index) => (
              <motion.div
                key={badge.text}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-2 text-olive-300 text-body-sm"
              >
                <badge.icon className="w-5 h-5 text-sabai-400" aria-hidden="true" />
                <span>{badge.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-olive-800 bg-olive-900/50">
        <div className="container-main py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-olive-400 text-caption text-center md:text-left">
              &copy; {new Date().getFullYear()} SabaiCraft. All rights reserved.
            </p>

            <div className="flex items-center gap-6 text-caption text-olive-400">
              <Link to="/privacy" className="hover:text-cream-50 transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-cream-50 transition-colors">Terms</Link>
              <Link to="/cookies" className="hover:text-cream-50 transition-colors">Cookies</Link>
              <Link to="/accessibility" className="hover:text-cream-50 transition-colors">Accessibility</Link>
            </div>

            <div className="flex items-center gap-4 text-caption text-olive-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                Varanasi, India
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                +91 88811 55518
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                contact@sabaicraft.com
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}