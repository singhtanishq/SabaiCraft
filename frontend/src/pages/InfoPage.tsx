import { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';

interface InfoSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

interface InfoContent {
  title: string;
  intro: string;
  updated: string;
  sections: InfoSection[];
}

const INFO_PAGES: Record<string, InfoContent> = {
  privacy: {
    title: 'Privacy Policy',
    intro:
      'At SabaiCraft, your privacy matters. This policy explains what information we collect, how we use it, and the choices you have.',
    updated: 'Last updated: September 2026',
    sections: [
      {
        heading: 'Information We Collect',
        paragraphs: [
          'We collect the information you provide directly: your name, email address, phone number, and shipping address when you place an order or create an account. We also collect basic usage data (pages visited, device type) to improve the store experience.',
        ],
      },
      {
        heading: 'How We Use Your Information',
        bullets: [
          'Processing and fulfilling your orders',
          'Providing customer support and order updates',
          'Improving our products, website, and services',
          'Sending marketing emails — only with your consent',
        ],
      },
      {
        heading: 'Data Sharing',
        paragraphs: [
          'We never sell your personal data. We share information only with the service providers required to run the store — payment processors and shipping partners — and only the minimum data they need.',
        ],
      },
      {
        heading: 'Data Security & Retention',
        paragraphs: [
          'Passwords are stored using industry-standard hashing, and authentication uses secure HttpOnly cookies. We retain your data only as long as needed for order history, legal compliance, and accounting purposes.',
        ],
      },
      {
        heading: 'Your Rights',
        paragraphs: [
          `You may request access to, correction of, or deletion of your personal data at any time by emailing contact@sabaicraft.com. You can also opt out of marketing emails from the unsubscribe link in any message.`,
        ],
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    intro:
      'These terms govern your use of the SabaiCraft website and the purchase of our handcrafted products. By using the site, you agree to these terms.',
    updated: 'Last updated: September 2026',
    sections: [
      {
        heading: 'Products & Pricing',
        paragraphs: [
          'Every SabaiCraft product is handmade, so slight variations in size, colour, and texture are natural and not defects. All prices are listed in Indian Rupees and include 18% GST where applicable. Prices may change without notice; the price at the time of your order is the price you pay.',
        ],
      },
      {
        heading: 'Orders & Acceptance',
        paragraphs: [
          'Your order is an offer to buy. We accept it when we confirm the order by email. In the unlikely event of an pricing or stock error, we will contact you to confirm or cancel the affected item with a full refund.',
        ],
      },
      {
        heading: 'Intellectual Property',
        paragraphs: [
          'All content on this site — product photography, text, logos, and designs — belongs to SabaiCraft and our artisan partners. It may not be reproduced without written permission.',
        ],
      },
      {
        heading: 'Limitation of Liability',
        paragraphs: [
          'To the maximum extent permitted by law, SabaiCraft’s liability for any claim related to a purchase is limited to the amount you paid for the product in question.',
        ],
      },
      {
        heading: 'Governing Law',
        paragraphs: ['These terms are governed by the laws of India, with courts in Varanasi, Uttar Pradesh having exclusive jurisdiction.'],
      },
    ],
  },
  shipping: {
    title: 'Shipping Information',
    intro:
      'We pack every order carefully in eco-friendly materials and ship across India. Here is everything you need to know about delivery.',
    updated: 'Effective: September 2026',
    sections: [
      {
        heading: 'Shipping Rates & Speed',
        bullets: [
          'Standard shipping: ₹99 (5–7 business days) — FREE on orders over ₹2,000',
          'Orders are dispatched within 1–2 business days of confirmation',
          'Cash on Delivery is available across India',
        ],
      },
      {
        heading: 'Order Tracking',
        paragraphs: [
          'Once your order ships, you will receive a confirmation email with a tracking number. You can also view live status any time under My Orders.',
        ],
      },
      {
        heading: 'Packaging',
        paragraphs: [
          'We use plastic-free, biodegradable packaging made from recycled paper and natural fibres — in keeping with the spirit of the products inside.',
        ],
      },
      {
        heading: 'Undeliverable Packages',
        paragraphs: [
          'If a delivery fails after multiple attempts, the parcel returns to us. We will contact you to arrange a re-delivery; additional shipping charges may apply.',
        ],
      },
    ],
  },
  returns: {
    title: 'Returns & Exchanges',
    intro:
      'We want you to love your handcrafted pieces. If something is not right, we make returns and exchanges simple.',
    updated: 'Effective: September 2026',
    sections: [
      {
        heading: '7-Day Return Policy',
        paragraphs: [
          'You may return any unused, undamaged product in its original packaging within 7 days of delivery. Handmade variation in colour or texture is not considered a defect, but genuine quality issues are always covered.',
        ],
      },
      {
        heading: 'How to Start a Return',
        bullets: [
          'Email contact@sabaicraft.com with your order number and reason for return',
          'We arrange a reverse pickup or share a return shipping address',
          'Once received and inspected, refunds are issued to the original payment method within 5–7 business days (COD orders are refunded via bank transfer)',
        ],
      },
      {
        heading: 'Exchanges',
        paragraphs: [
          'For exchanges, simply place a return and a new order — or email us and we will help you swap the item directly, subject to stock availability.',
        ],
      },
      {
        heading: 'Non-Returnable Items',
        paragraphs: ['Items marked as final sale, and products damaged through misuse, cannot be returned.'],
      },
    ],
  },
  faq: {
    title: 'Frequently Asked Questions',
    intro: 'Quick answers about products, care, ordering, and shipping.',
    updated: '',
    sections: [
      {
        heading: 'What is Sabai grass?',
        paragraphs: [
          'Sabai grass (Eulaliopsis binata) is a durable natural fibre that grows wild in the grasslands of eastern India. It is sun-dried and handwoven by artisan communities — no plastics, no dyes needed for our natural range.',
        ],
      },
      {
        heading: 'How do I care for my Sabai products?',
        bullets: [
          'Wipe with a dry or slightly damp cloth',
          'Keep away from prolonged soaking and direct rain',
          'Store in a dry place; reshape gently if pressed',
        ],
      },
      {
        heading: 'Are the products really handmade?',
        paragraphs: [
          'Yes — every piece is woven by hand by artisan families in and around Varanasi. Your purchase directly supports fair wages and the continuation of this heritage craft.',
        ],
      },
      {
        heading: 'Do you ship outside India?',
        paragraphs: [
          'International shipping is coming soon. Join our newsletter to be notified when it launches.',
        ],
      },
      {
        heading: 'How can I contact support?',
        paragraphs: [
          'Email contact@sabaicraft.com or call +91 88811 55518 (Mon–Sat, 10am–6pm IST), or use the form on our Contact page.',
        ],
      },
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    intro: 'This policy explains how SabaiCraft uses cookies and similar storage on your device.',
    updated: 'Last updated: September 2026',
    sections: [
      {
        heading: 'Essential Cookies',
        paragraphs: [
          'We use a single essential authentication cookie so you can stay signed in securely. It is HttpOnly and cannot be read by scripts. We also use local storage to remember your cart and wishlist between visits — this never leaves your device unless you sign in.',
        ],
      },
      {
        heading: 'Analytics',
        paragraphs: [
          'If enabled, privacy-respecting analytics help us understand which pages and products are useful. We do not use advertising or cross-site tracking cookies.',
        ],
      },
      {
        heading: 'Managing Cookies',
        paragraphs: [
          'You can clear cookies and local storage any time from your browser settings. Signing out removes your session cookie.',
        ],
      },
    ],
  },
  accessibility: {
    title: 'Accessibility',
    intro:
      'SabaiCraft is committed to a shopping experience everyone can use. We aim to meet WCAG 2.1 Level AA across the site.',
    updated: 'Effective: September 2026',
    sections: [
      {
        heading: 'What We Do',
        bullets: [
          'Semantic HTML with proper landmarks and heading structure',
          'Full keyboard navigation, visible focus indicators, and Escape-to-close dialogs',
          'Descriptive alternative text for product imagery',
          'Colour contrast checked against WCAG AA',
          'Respect for the user’s reduced-motion preference',
        ],
      },
      {
        heading: 'Found a Barrier?',
        paragraphs: [
          'If any part of this site is difficult to use with your assistive technology, email contact@sabaicraft.com and we will fix it — accessibility issues are treated as high-priority bugs.',
        ],
      },
    ],
  },
};

export function InfoPage() {
  const { slug } = useParams<{ slug: string }>();
  const content = slug ? INFO_PAGES[slug] : undefined;

  useEffect(() => {
    if (content) {
      document.title = `${content.title} | SabaiCraft`;
    }
  }, [content]);

  if (!content) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="bg-cream-50">
      {/* Page header */}
      <div className="bg-olive-950 text-cream-50">
        <div className="container-main py-12 lg:py-16">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1.5 text-caption text-olive-300">
              <li>
                <Link to="/" className="hover:text-cream-50 transition-colors">Home</Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="w-3.5 h-3.5" />
              </li>
              <li aria-current="page" className="text-sabai-400">{content.title}</li>
            </ol>
          </nav>
          <h1 className="font-display font-medium text-display-sm text-cream-50 mb-3">{content.title}</h1>
          <p className="text-olive-200 text-body max-w-2xl">{content.intro}</p>
          {content.updated && <p className="text-olive-400 text-caption mt-3">{content.updated}</p>}
        </div>
      </div>

      {/* Content */}
      <div className="container-main py-12 lg:py-16">
        <div className="max-w-3xl space-y-8">
          {content.sections.map((section) => (
            <Card key={section.heading} padding="lg">
              <h2 className="heading-4 mb-4">{section.heading}</h2>
              {section.paragraphs?.map((paragraph, i) => (
                <p key={i} className="body-sm text-olive-700 leading-relaxed mb-3 last:mb-0">
                  {paragraph}
                </p>
              ))}
              {section.bullets && (
                <ul className="space-y-2.5" role="list">
                  {section.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-body-sm text-olive-700 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-sage-600 mt-2 flex-shrink-0" aria-hidden="true" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ))}

          <div className="bg-sage-50 border border-sage-100 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-medium text-olive-950 text-body-sm">Still have questions?</p>
              <p className="text-olive-600 text-body-sm mt-1">Our team is happy to help.</p>
            </div>
            <Button asChild variant="primary">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
