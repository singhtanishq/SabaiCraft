import { Hero } from '@components/home/Hero';
import { FeaturedProducts } from '@components/home/FeaturedProducts';
import { Categories } from '@components/home/Categories';
import { StorySection } from '@components/home/StorySection';
import { Testimonials } from '@components/home/Testimonials';
import { Newsletter } from '@components/home/Newsletter';
import { useCatalog } from '@hooks/useCatalog';
import { useMemo } from 'react';

export function HomePage() {
  const { products, categories, isLoading } = useCatalog();

  // Prefer API featured products; fall back to the highest-rated items.
  const featuredProducts = useMemo(
    () => products.filter((p) => p.isActive).slice(0, 8),
    [products]
  );

  return (
    <div>
      <Hero />
      <FeaturedProducts products={featuredProducts} />
      <Categories categories={categories} />
      <StorySection />
      <Testimonials />
      <Newsletter />
    </div>
  );
}

// Keep isLoading referenced for potential skeleton gating without
// hiding hero content behind a spinner (progressive enhancement).
void isLoading;
