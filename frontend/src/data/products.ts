import type { Product, ProductVariant, ProductImage, Category } from '../types';

export const categories: Category[] = [
  {
    id: 'cat-1',
    name: 'Baskets',
    slug: 'baskets',
    description: 'Handwoven storage and decorative baskets',
    image: '/Images/basket.png',
    productCount: 12,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-2',
    name: 'Bags',
    slug: 'bags',
    description: 'Stylish and sustainable bags',
    image: '/Images/bag.png',
    productCount: 8,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-3',
    name: 'Coasters',
    slug: 'coasters',
    description: 'Protective and beautiful coasters',
    image: '/Images/coaster.png',
    productCount: 6,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-4',
    name: 'Hats',
    slug: 'hats',
    description: 'Natural fiber hats for sun protection',
    image: '/Images/hat.png',
    productCount: 4,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-5',
    name: 'Toys',
    slug: 'toys',
    description: 'Eco-friendly toys for children',
    image: '/Images/toy.png',
    productCount: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-6',
    name: 'Mats',
    slug: 'mats',
    description: 'Floor mats and table runners',
    image: '/Images/mat.png',
    productCount: 7,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-7',
    name: 'Garments',
    slug: 'garments',
    description: 'Natural fiber clothing and accessories',
    image: '/Images/fashion.png',
    productCount: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const createProduct = (
  id: string,
  name: string,
  slug: string,
  categoryId: string,
  basePrice: number,
  compareAtPrice: number | undefined,
  images: string[],
  variants: Omit<ProductVariant, 'id'>[],
  description: string,
  shortDescription: string,
  rating: number,
  reviewCount: number,
  isFeatured: boolean = false,
  tags: string[] = []
): Product => ({
  id,
  name,
  slug,
  categoryId,
  description,
  shortDescription,
  images: images.map((url, index) => ({
    id: `img-${id}-${index}`,
    url,
    alt: `${name} - Image ${index + 1}`,
    position: index,
  })),
  variants: variants.map((v, index) => ({
    ...v,
    id: `var-${id}-${index}`,
  })),
  basePrice,
  compareAtPrice,
  rating,
  reviewCount,
  isActive: true,
  isFeatured,
  tags,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
});

export const products: Product[] = [
  createProduct(
    'prod-1',
    'Sabai Handle Basket',
    'sabai-handle-basket',
    'cat-1',
    120000, // ₹1,200
    150000, // ₹1,500
    ['/Images/p1.jpg', '/Images/p1.1.webp', '/Images/p1.2.webp', '/Images/p1.3.webp'],
    [
      { name: 'Small', sku: 'SHB-S', price: 100000, compareAtPrice: 120000, inventory: 15, attributes: { size: 'Small' } },
      { name: 'Medium', sku: 'SHB-M', price: 120000, compareAtPrice: 150000, inventory: 10, attributes: { size: 'Medium' } },
      { name: 'Large', sku: 'SHB-L', price: 150000, compareAtPrice: 180000, inventory: 5, attributes: { size: 'Large' } },
    ],
    'Beautifully handwoven Sabai grass basket with sturdy handles. Perfect for storing fruits, vegetables, or as a decorative piece. Each basket is crafted by skilled artisans using traditional techniques passed down through generations.',
    'Handwoven Sabai grass basket with sturdy handles - perfect for storage and decor',
    4.8,
    124,
    true,
    ['bestseller', 'handwoven', 'eco-friendly']
  ),
  createProduct(
    'prod-2',
    'Sabai Fruit Basket',
    'sabai-fruit-basket',
    'cat-1',
    100000, // ₹1,000
    120000, // ₹1,200
    ['/Images/p4.jpg', '/Images/p4.webp'],
    [
      { name: 'Regular', sku: 'SFB-R', price: 100000, compareAtPrice: 120000, inventory: 20, attributes: { size: 'Regular' } },
      { name: 'Large', sku: 'SFB-L', price: 130000, compareAtPrice: 150000, inventory: 8, attributes: { size: 'Large' } },
    ],
    'Elegant fruit basket handcrafted from natural Sabai grass. The open weave design allows air circulation, keeping fruits fresh longer. A beautiful addition to any kitchen or dining table.',
    'Open-weave fruit basket for natural air circulation and freshness',
    4.7,
    89,
    true,
    ['kitchen', 'eco-friendly', 'handwoven']
  ),
  createProduct(
    'prod-3',
    'Sabai Lid Basket',
    'sabai-lid-basket',
    'cat-1',
    80000, // ₹800
    100000, // ₹1,000
    ['/Images/p5.jpg', '/Images/p5.webp'],
    [
      { name: 'Small', sku: 'SLB-S', price: 80000, compareAtPrice: 100000, inventory: 25, attributes: { size: 'Small' } },
      { name: 'Medium', sku: 'SLB-M', price: 100000, compareAtPrice: 120000, inventory: 12, attributes: { size: 'Medium' } },
    ],
    'Versatile storage basket with a removable lid. Ideal for organizing toys, linens, or pantry items. The tight-fitting lid keeps contents dust-free while adding a touch of natural elegance to your space.',
    'Storage basket with removable lid - perfect for organizing any space',
    4.6,
    67,
    false,
    ['storage', 'organizing', 'handwoven']
  ),
  createProduct(
    'prod-4',
    'Sabai Matka Basket',
    'sabai-matka-basket',
    'cat-1',
    102000, // ₹1,020
    120000, // ₹1,200
    ['/Images/p1.webp', '/Images/p1.1.webp', '/Images/p1.2.webp', '/Images/p1.3.webp'],
    [
      { name: 'Beige', sku: 'SMB-B', price: 102000, compareAtPrice: 120000, inventory: 18, attributes: { color: 'Beige' } },
      { name: 'Natural', sku: 'SMB-N', price: 110000, compareAtPrice: 130000, inventory: 10, attributes: { color: 'Natural' } },
      { name: 'Brown', sku: 'SMB-BR', price: 115000, compareAtPrice: 135000, inventory: 7, attributes: { color: 'Brown' } },
    ],
    'Traditional Matka-style basket with a rounded bottom and wide opening. Handwoven using age-old techniques, this basket brings rustic charm to modern homes. Perfect for dry storage or as a planter cover.',
    'Traditional Matka-style basket with rustic charm',
    4.5,
    45,
    true,
    ['traditional', 'rustic', 'handwoven']
  ),
  createProduct(
    'prod-5',
    'Sabai Mat (Beige)',
    'sabai-mat-beige',
    'cat-6',
    110000, // ₹1,100
    130000, // ₹1,300
    ['/Images/p7.webp', '/Images/p7.1.webp'],
    [
      { name: '2x3 ft', sku: 'SMB-2x3', price: 110000, compareAtPrice: 130000, inventory: 12, attributes: { size: '2x3 ft', color: 'Beige' } },
      { name: '3x5 ft', sku: 'SMB-3x5', price: 180000, compareAtPrice: 220000, inventory: 6, attributes: { size: '3x5 ft', color: 'Beige' } },
      { name: '4x6 ft', sku: 'SMB-4x6', price: 250000, compareAtPrice: 300000, inventory: 3, attributes: { size: '4x6 ft', color: 'Beige' } },
    ],
    'Elegant beige floor mat handwoven from premium Sabai grass. The natural fibers provide a cool, comfortable surface perfect for any room. Adds texture and warmth to your living space while being completely biodegradable.',
    'Premium handwoven floor mat in natural beige',
    4.7,
    78,
    true,
    ['home-decor', 'floor-mat', 'eco-friendly']
  ),
  createProduct(
    'prod-6',
    'Sabai Mat (Green)',
    'sabai-mat-green',
    'cat-6',
    100000, // ₹1,000
    120000, // ₹1,200
    ['/Images/p7.1.webp'],
    [
      { name: '2x3 ft', sku: 'SMG-2x3', price: 100000, compareAtPrice: 120000, inventory: 15, attributes: { size: '2x3 ft', color: 'Green' } },
      { name: '3x5 ft', sku: 'SMG-3x5', price: 170000, compareAtPrice: 200000, inventory: 8, attributes: { size: '3x5 ft', color: 'Green' } },
    ],
    'Vibrant green floor mat dyed with natural, non-toxic pigments. The refreshing color brings nature indoors while the Sabai grass construction ensures durability and comfort. Perfect for entryways, bedrooms, or meditation spaces.',
    'Natural green dyed floor mat for a fresh, natural look',
    4.6,
    52,
    false,
    ['home-decor', 'floor-mat', 'natural-dye']
  ),
  createProduct(
    'prod-7',
    'Beige Utility Basket',
    'beige-utility-basket',
    'cat-1',
    105000, // ₹1,050
    125000, // ₹1,250
    ['/Images/p8.webp', '/Images/p8.1.webp', '/Images/p8.2.webp', '/Images/p8.3.webp'],
    [
      { name: 'Small', sku: 'BUB-S', price: 105000, compareAtPrice: 125000, inventory: 20, attributes: { size: 'Small' } },
      { name: 'Medium', sku: 'BUB-M', price: 120000, compareAtPrice: 140000, inventory: 12, attributes: { size: 'Medium' } },
      { name: 'Large', sku: 'BUB-L', price: 140000, compareAtPrice: 160000, inventory: 6, attributes: { size: 'Large' } },
    ],
    'Multi-purpose utility basket in classic beige. The sturdy construction handles heavy loads while the neutral tone complements any decor. Use for laundry, toys, firewood, or pantry organization.',
    'Versatile utility basket for heavy-duty storage needs',
    4.5,
    34,
    false,
    ['utility', 'storage', 'heavy-duty']
  ),
  createProduct(
    'prod-8',
    'Big Fruit Basket',
    'big-fruit-basket',
    'cat-1',
    108000, // ₹1,080
    130000, // ₹1,300
    ['/Images/p2.webp'],
    [
      { name: 'Standard', sku: 'BFB-STD', price: 108000, compareAtPrice: 130000, inventory: 14, attributes: { size: 'Standard' } },
    ],
    'Large capacity fruit basket perfect for families. The spacious design holds abundant produce while the open weave ensures optimal ventilation. Handcrafted with care by master weavers.',
    'Extra-large fruit basket for family-sized storage',
    4.4,
    28,
    false,
    ['kitchen', 'large-capacity', 'handwoven']
  ),
  createProduct(
    'prod-9',
    'Small Fruit Basket',
    'small-fruit-basket',
    'cat-1',
    132000, // ₹1,320
    150000, // ₹1,500
    ['/Images/p3.webp'],
    [
      { name: 'Compact', sku: 'SFB-C', price: 132000, compareAtPrice: 150000, inventory: 10, attributes: { size: 'Compact' } },
    ],
    'Compact fruit basket ideal for small kitchens or as a countertop accent. Despite its size, it\'s woven with the same attention to detail and quality as our larger pieces.',
    'Compact fruit basket for small spaces',
    4.3,
    19,
    false,
    ['kitchen', 'compact', 'handwoven']
  ),
  createProduct(
    'prod-10',
    'Sabai Casserole (Beige)',
    'sabai-casserole-beige',
    'cat-1',
    115000, // ₹1,150
    140000, // ₹1,400
    ['/Images/p4.webp'],
    [
      { name: 'Medium', sku: 'SCB-M', price: 115000, compareAtPrice: 140000, inventory: 8, attributes: { size: 'Medium', color: 'Beige' } },
      { name: 'Large', sku: 'SCB-L', price: 140000, compareAtPrice: 170000, inventory: 4, attributes: { size: 'Large', color: 'Beige' } },
    ],
    'Unique casserole-style basket with high sides and handles. Perfect for serving bread, storing baked goods, or as a decorative centerpiece. The beige tone adds warmth to any table setting.',
    'Casserole-style serving and storage basket',
    4.5,
    23,
    false,
    ['serving', 'kitchen', 'decorative']
  ),
  createProduct(
    'prod-11',
    'Sabai Casserole (Green)',
    'sabai-casserole-green',
    'cat-1',
    126000, // ₹1,260
    150000, // ₹1,500
    ['/Images/p5.webp'],
    [
      { name: 'Medium', sku: 'SCG-M', price: 126000, compareAtPrice: 150000, inventory: 6, attributes: { size: 'Medium', color: 'Green' } },
    ],
    'Green variant of our popular casserole basket. Naturally dyed with eco-friendly pigments for a pop of color. Great for gifting or adding a fresh accent to your kitchen.',
    'Naturally dyed green casserole basket',
    4.4,
    15,
    false,
    ['serving', 'kitchen', 'natural-dye', 'gift']
  ),
  createProduct(
    'prod-12',
    'Sabai Tote Bag',
    'sabai-tote-bag',
    'cat-2',
    140000, // ₹1,400
    170000, // ₹1,700
    ['/Images/p6.jpg', '/Images/p6.webp'],
    [
      { name: 'Natural', sku: 'STB-N', price: 140000, compareAtPrice: 170000, inventory: 12, attributes: { color: 'Natural' } },
      { name: 'Beige', sku: 'STB-B', price: 150000, compareAtPrice: 180000, inventory: 8, attributes: { color: 'Beige' } },
    ],
    'Stylish and sturdy tote bag woven from Sabai grass. Features comfortable handles and spacious interior. Perfect for grocery runs, beach days, or as an everyday bag. A sustainable fashion statement.',
    'Eco-friendly tote bag for everyday use',
    4.8,
    92,
    true,
    ['bag', 'fashion', 'everyday', 'sustainable']
  ),
  createProduct(
    'prod-13',
    'Sabai Coaster Set (4 pcs)',
    'sabai-coaster-set-4',
    'cat-3',
    45000, // ₹450
    60000, // ₹600
    ['/Images/l1.png'],
    [
      { name: 'Set of 4', sku: 'SCS-4', price: 45000, compareAtPrice: 60000, inventory: 30, attributes: { quantity: '4' } },
      { name: 'Set of 6', sku: 'SCS-6', price: 65000, compareAtPrice: 85000, inventory: 20, attributes: { quantity: '6' } },
    ],
    'Set of 4 round coasters handwoven from Sabai grass. Protects surfaces while adding natural texture to your table setting. Comes in a beautiful gift box.',
    'Handwoven coaster set - protects surfaces naturally',
    4.6,
    56,
    true,
    ['tableware', 'gift', 'set']
  ),
  createProduct(
    'prod-14',
    'Sabai Sun Hat',
    'sabai-sun-hat',
    'cat-4',
    95000, // ₹950
    120000, // ₹1,200
    ['/Images/hat.png'],
    [
      { name: 'M/L', sku: 'SSH-ML', price: 95000, compareAtPrice: 120000, inventory: 15, attributes: { size: 'M/L' } },
    ],
    'Wide-brimmed sun hat woven from breathable Sabai grass. Provides excellent UV protection while keeping you cool. Adjustable inner band for perfect fit. Perfect for gardening, beach, or outdoor events.',
    'Breathable wide-brim sun hat with UV protection',
    4.5,
    31,
    false,
    ['accessories', 'sun-protection', 'outdoor']
  ),
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.categoryId === categoryId && p.isActive);
}

export function getFeaturedProducts(limit?: number): Product[] {
  const featured = products.filter((p) => p.isFeatured && p.isActive);
  return limit ? featured.slice(0, limit) : featured;
}

export function getProductsByIds(ids: string[]): Product[] {
  return products.filter((p) => ids.includes(p.id));
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (p) =>
      p.isActive &&
      (p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.tags.some((t) => t.toLowerCase().includes(lowerQuery)))
  );
}

export function getRelatedProducts(productId: string, categoryId: string, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== productId && p.categoryId === categoryId && p.isActive)
    .slice(0, limit);
}