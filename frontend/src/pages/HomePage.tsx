import { useMemo } from 'react';
import { Hero } from '@components/home/Hero';
import { FeaturedProducts } from '@components/home/FeaturedProducts';
import { Categories } from '@components/home/Categories';
import { StorySection } from '@components/home/StorySection';
import { Testimonials } from '@components/home/Testimonials';
import { Newsletter } from '@components/home/Newsletter';
import { useCatalog } from '@hooks/useCatalog';

export function HomePage() {
  const { products, categories } = useCatalog();

  // Prefer API products; Categories section shows collection counts from API.
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
