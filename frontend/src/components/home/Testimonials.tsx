import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card } from '../ui/Card';
import { cn } from '../../utils/cn';

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    content: 'The Sabai Handle Basket exceeded my expectations. The craftsmanship is impeccable — you can feel the care in every weave. It\'s now the centerpiece of my dining table.',
    product: 'Sabai Handle Basket',
    avatar: 'PS',
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    location: 'Delhi',
    rating: 5,
    content: 'I ordered the floor mat for my meditation room and it\'s perfect. The natural fibers feel amazing underfoot, and knowing it supports artisan communities makes it even more special.',
    product: 'Sabai Mat (Beige)',
    avatar: 'RK',
  },
  {
    id: 3,
    name: 'Anita Desai',
    location: 'Bangalore',
    rating: 5,
    content: 'Gifted the coaster set to my mother and she absolutely loved it. The presentation box was beautiful, and the quality is outstanding. Will definitely order more for gifts.',
    product: 'Sabai Coaster Set',
    avatar: 'AD',
  },
  {
    id: 4,
    name: 'Vikram Singh',
    location: 'Pune',
    rating: 4,
    content: 'The tote bag is my daily companion now. Sturdy, stylish, and sustainable — exactly what I was looking for. Gets compliments every time I use it for groceries.',
    product: 'Sabai Tote Bag',
    avatar: 'VS',
  },
  {
    id: 5,
    name: 'Meera Patel',
    location: 'Ahmedabad',
    rating: 5,
    content: 'Ordered the fruit basket and it arrived beautifully packaged. The open weave keeps fruits fresh for days longer than plastic bowls. A functional piece of art!',
    product: 'Sabai Fruit Basket',
    avatar: 'MP',
  },
];

export function Testimonials() {
  return (
    <section className="section-lg bg-olive-50/50" aria-labelledby="testimonials-heading">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12 lg:mb-16"
        >
          <h2 id="testimonials-heading" className="heading-1 mb-4">
            Loved by Our Community
          </h2>
          <p className="body-lg text-olive-600">
            Hear from customers who\'ve brought SabaiCraft into their homes
          </p>
        </motion.div>

        <div className="relative">
          {/* Track */}
          <motion.div
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.article
                key={testimonial.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex-shrink-0 w-[320px] sm:w-[360px] scroll-snap-start"
              >
                <Card variant="elevated" padding="lg" className="h-full">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'w-5 h-5',
                          i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-olive-200'
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>

                  <Quote className="w-8 h-8 text-sage-200 mb-4" aria-hidden="true" />

                  <p className="text-olive-700 text-body leading-relaxed mb-6">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center text-sage-600 font-medium text-body-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-olive-900 text-body-sm">{testimonial.name}</p>
                      <p className="text-olive-500 text-caption">{testimonial.location}</p>
                    </div>
                  </div>
                </Card>
              </motion.article>
            ))}
          </motion.div>

          {/* Scroll hint */}
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-l from-olive-50/50 to-transparent pointer-events-none" aria-hidden="true" />
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label="Testimonial navigation">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={cn(
                'w-2.5 h-2.5 rounded-full transition-all duration-300',
                index === 0 ? 'bg-sage-600 w-8' : 'bg-olive-300 hover:bg-olive-400'
              )}
              role="tab"
              aria-label={`Go to testimonial ${index + 1}`}
              aria-selected={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}