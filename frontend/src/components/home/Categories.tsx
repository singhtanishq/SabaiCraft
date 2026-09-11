import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { cn } from '../../utils/cn';
import { categories } from '../../data/products';

interface CategoriesProps {
  title?: string;
  subtitle?: string;
}

export function Categories({ title = 'Shop by Category', subtitle = 'Explore our handcrafted collections' }: CategoriesProps) {
  return (
    <section className="section-lg bg-olive-50/50" aria-labelledby="categories-heading">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12 lg:mb-16"
        >
          <h2 id="categories-heading" className="heading-1 mb-4">
            {title}
          </h2>
          <p className="body-lg text-olive-600">{subtitle}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
          role="list"
        >
          {categories.map((category, index) => (
            <motion.article
              key={category.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              whileHover={{ y: -6 }}
              className="group"
            >
              <Link
                to={`/category/${category.slug}`}
                className="block card-interactive h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:ring-offset-2"
                aria-label={`Browse ${category.name} collection`}
              >
                <div className="relative aspect-square overflow-hidden bg-olive-100">
                  <img
                    src={category.image}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    aria-hidden="true"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-olive-950/70 via-transparent to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-display font-medium text-cream-50 text-heading-md mb-1">
                      {category.name}
                    </h3>
                    <p className="text-olive-100 text-body-sm flex items-center gap-1">
                      {category.productCount} products
                      <motion.span
                        initial={{ x: 0 }}
                        whileHover={{ x: 4 }}
                        className="text-sabai-300"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.span>
                    </p>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}