import { Hero } from '@components/home/Hero';
import { FeaturedProducts } from '@components/home/FeaturedProducts';
import { Categories } from '@components/home/Categories';
import { StorySection } from '@components/home/StorySection';
import { Testimonials } from '@components/home/Testimonials';
import { Newsletter } from '@components/home/Newsletter';
import { getFeaturedProducts } from '@data/products';

export function HomePage() {
  const featuredProducts = getFeaturedProducts(8);

  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedProducts products={featuredProducts} />
      <Categories />
      <StorySection />
      <Testimonials />
      <Newsletter />
    </div>
  );
}