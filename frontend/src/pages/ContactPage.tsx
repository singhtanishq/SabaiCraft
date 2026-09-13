import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Clock, Send, MessageSquare, CheckCircle } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Input, Textarea } from '@components/ui/Input';
import { Card } from '@components/ui/Card';
import { useToastHelpers } from '@components/ui/Toast';
import { cn } from '@utils/cn';

const contactInfo = [
  {
    icon: Mail,
    title: 'Email Us',
    value: 'contact@sabaicraft.com',
    desc: 'We respond within 24 hours',
  },
  {
    icon: Phone,
    title: 'Call Us',
    value: '+91 88811 55518',
    desc: 'Mon - Sat, 10 AM - 6 PM IST',
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    value: 'Varanasi, Uttar Pradesh, India',
    desc: 'Our workshop and showroom',
  },
];

const faqs = [
  {
    question: 'What is Sabai grass?',
    answer: 'Sabai grass (Eulaliopsis binata) is a natural fiber grass that grows abundantly in the wild grasslands of India. It\'s sustainably harvested, biodegradable, and has been used for centuries by artisans to create durable, eco-friendly products.',
  },
  {
    question: 'Are your products eco-friendly?',
    answer: 'Yes! All our products are made from 100% natural Sabai grass with no synthetic materials, plastics, or harmful chemicals. Even our packaging is plastic-free and recyclable.',
  },
  {
    question: 'How do I care for my SabaiCraft products?',
    answer: 'Simply wipe clean with a damp cloth. Avoid prolonged exposure to moisture and direct sunlight. For deeper cleaning, use a mild soap solution and air dry completely.',
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Currently we ship across India. International shipping is coming soon! Sign up for our newsletter to be notified when we launch in your country.',
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer a 7-day return policy from the date of delivery. Items must be unused and in original packaging. Full refunds or exchanges are available. Return shipping is free for defective items.',
  },
  {
    question: 'Are the products handmade?',
    answer: 'Absolutely! Every single product is handwoven by skilled artisans using traditional techniques. This means each piece has slight variations that make it unique.',
  },
];

export function ContactPage() {
  const [activeTab, setActiveTab] = useState<'contact' | 'faq'>('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { success, error } = useToastHelpers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      error('Missing fields', 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setSubmitStatus('success');
    success('Message Sent!', 'Thank you for reaching out. We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitStatus('idle'), 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <section className="relative bg-olive-950 text-cream-50 py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/Images/sabai mascot.png')] bg-center bg-cover opacity-[0.03]" />
        <div className="absolute inset-0 bg-gradient-to-br from-olive-950 via-olive-900 to-sage-800" />

        <div className="container-main relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
              <Mail className="w-4 h-4 text-sabai-300" />
              <span className="text-body-sm font-medium">Get in Touch</span>
            </div>
            <h1 className="heading-display text-cream-50 text-display-md lg:text-display-lg mb-4 text-balance">
              We&apos;d Love to Hear from You
            </h1>
            <p className="body-lg text-olive-300 max-w-2xl mx-auto text-pretty">
              Have questions about our products, your order, or want to collaborate? Our team is here to help.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-lg">
        <div className="container-main">
          {/* Contact Info & Form */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 space-y-6 min-w-0"
            >
              <Card padding="lg" className="h-full">
                <h3 className="heading-3 mb-6">Contact Information</h3>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={info.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center text-sage-600 flex-shrink-0">
                        <info.icon className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-olive-900 text-body-sm">{info.title}</p>
                        <p className="text-olive-700 text-body">{info.value}</p>
                        <p className="caption text-olive-600">{info.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* Business Hours */}
              <Card padding="lg">
                <h3 className="heading-3 mb-4 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-sage-600" />
                  Business Hours
                </h3>
                <div className="space-y-2 text-olive-600 text-body-sm">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-medium text-olive-900">10:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium text-olive-900">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-medium text-olive-900">Closed</span>
                  </div>
                  <p className="caption text-olive-600 pt-2">All times IST</p>
                </div>
              </Card>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 min-w-0"
            >
              <Card padding="lg">
                <h3 className="heading-3 mb-6 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-sage-600" />
                  Send Us a Message
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Your name"
                      required
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <Input
                    label="Subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    placeholder="What&apos;s this about?"
                    required
                  />

                  <Textarea
                    label="Message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Tell us how we can help..."
                    rows={5}
                    required
                  />

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full sm:w-auto"
                    isLoading={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-5 h-5 mr-2" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                        Sending...
                      </>
                    ) : submitStatus === 'success' ? (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Message Sent!
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 lg:mt-20"
          >
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="heading-1 mb-4">Frequently Asked Questions</h2>
              <p className="body-lg text-olive-600">Quick answers to common questions</p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="space-y-3" role="list">
                {faqs.map((faq, index) => (
                  <motion.article
                    key={faq.question}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="card p-6"
                  >
                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer list-none">
                        <h4 className="font-medium text-olive-900 text-body pr-8">{faq.question}</h4>
                        <span className={cn(
                          'w-5 h-5 flex-shrink-0 transition-transform',
                          'text-olive-400 group-open:rotate-180'
                        )}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </span>
                      </summary>
                      <div className="mt-4 pt-4 border-t border-olive-100 animate-in">
                        <p className="text-olive-600 text-body-sm leading-relaxed">{faq.answer}</p>
                      </div>
                    </details>
                  </motion.article>
                ))}
              </div>

              <div className="text-center mt-8">
                <p className="text-olive-600 text-body-sm mb-4">Still have questions?</p>
                <Button asChild variant="outline" size="lg">
                  <a href="mailto:contact@sabaicraft.com">Email Us Directly</a>
                </Button>
              </div>
            </div>
          </motion.section>
        </div>
      </section>
    </div>
  );
}