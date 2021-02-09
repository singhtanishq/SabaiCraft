import { Hero } from './Hero';
import { FeaturedProducts } from './FeaturedProducts';
import { Categories } from './Categories';
import { StorySection } from './StorySection';
import { Testimonials } from './Testimonials';
import { Newsletter } from './Newsletter';
import { getFeaturedProducts } from '../../data/products';

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