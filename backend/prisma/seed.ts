import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data
  await prisma.adminAuditLog.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.address.deleteMany();
  await prisma.session.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.coupon.deleteMany();

  console.log('🧹 Cleaned existing data');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@sabaicraft.com',
      name: 'Admin User',
      passwordHash: adminPassword,
      phone: '+91 88811 55518',
      role: 'ADMIN',
    },
  });
  console.log('👑 Created admin user');

  // Create demo customer
  const customerPassword = await bcrypt.hash('customer123', 12);
  const customer = await prisma.user.create({
    data: {
      email: 'customer@sabaicraft.com',
      name: 'Demo Customer',
      passwordHash: customerPassword,
      phone: '+91 98765 43210',
      role: 'CUSTOMER',
    },
  });
  console.log('👤 Created demo customer');

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Baskets',
        slug: 'baskets',
        description: 'Handwoven storage and decorative baskets',
        image: '/Images/basket.png',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Bags',
        slug: 'bags',
        description: 'Stylish and sustainable bags',
        image: '/Images/bag.png',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Coasters',
        slug: 'coasters',
        description: 'Protective and beautiful coasters',
        image: '/Images/coaster.png',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Hats',
        slug: 'hats',
        description: 'Natural fiber hats for sun protection',
        image: '/Images/hat.png',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Toys',
        slug: 'toys',
        description: 'Eco-friendly toys for children',
        image: '/Images/toy.png',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Mats',
        slug: 'mats',
        description: 'Floor mats and table runners',
        image: '/Images/mat.png',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Garments',
        slug: 'garments',
        description: 'Natural fiber clothing and accessories',
        image: '/Images/fashion.png',
      },
    }),
  ]);
  console.log('📦 Created categories');

  // Helper to create products
  const createProduct = async (
    name: string,
    slug: string,
    category: typeof categories[0],
    basePrice: number,
    compareAtPrice: number | null,
    images: string[],
    variants: { name: string; sku: string; price: number; compareAtPrice: number | null; inventory: number; attributes: Record<string, string> }[],
    description: string,
    shortDescription: string,
    isFeatured: boolean = false,
    tags: string[] = []
  ) => {
    return prisma.product.create({
      data: {
        name,
        slug,
        categoryId: category.id,
        description,
        shortDescription,
        basePrice,
        compareAtPrice,
        isFeatured,
        tags: tags.join(','),
        images: { create: images.map((url, i) => ({ url, alt: `${name} - Image ${i + 1}`, position: i })) },
        variants: { create: variants.map(v => ({ ...v, attributes: JSON.stringify(v.attributes) })) },
      },
    });
  };

  // Create products
  const products = await Promise.all([
    createProduct(
      'Sabai Handle Basket',
      'sabai-handle-basket',
      categories[0],
      120000,
      150000,
      ['/Images/p1.jpg', '/Images/p1.1.webp', '/Images/p1.2.webp', '/Images/p1.3.webp'],
      [
        { name: 'Small', sku: 'SHB-S', price: 100000, compareAtPrice: 120000, inventory: 15, attributes: { size: 'Small' } },
        { name: 'Medium', sku: 'SHB-M', price: 120000, compareAtPrice: 150000, inventory: 10, attributes: { size: 'Medium' } },
        { name: 'Large', sku: 'SHB-L', price: 150000, compareAtPrice: 180000, inventory: 5, attributes: { size: 'Large' } },
      ],
      'Beautifully handwoven Sabai grass basket with sturdy handles. Perfect for storing fruits, vegetables, or as a decorative piece. Each basket is crafted by skilled artisans using traditional techniques passed down through generations.',
      'Handwoven Sabai grass basket with sturdy handles',
      true,
      ['bestseller', 'handwoven', 'eco-friendly']
    ),
    createProduct(
      'Sabai Fruit Basket',
      'sabai-fruit-basket',
      categories[0],
      100000,
      120000,
      ['/Images/p4.jpg', '/Images/p4.webp'],
      [
        { name: 'Regular', sku: 'SFB-R', price: 100000, compareAtPrice: 120000, inventory: 20, attributes: { size: 'Regular' } },
        { name: 'Large', sku: 'SFB-L', price: 130000, compareAtPrice: 150000, inventory: 8, attributes: { size: 'Large' } },
      ],
      'Elegant fruit basket handcrafted from natural Sabai grass. The open weave design allows air circulation, keeping fruits fresh longer.',
      'Open-weave fruit basket for natural air circulation',
      true,
      ['kitchen', 'eco-friendly']
    ),
    createProduct(
      'Sabai Lid Basket',
      'sabai-lid-basket',
      categories[0],
      80000,
      100000,
      ['/Images/p5.jpg', '/Images/p5.webp'],
      [
        { name: 'Small', sku: 'SLB-S', price: 80000, compareAtPrice: 100000, inventory: 25, attributes: { size: 'Small' } },
        { name: 'Medium', sku: 'SLB-M', price: 100000, compareAtPrice: 120000, inventory: 12, attributes: { size: 'Medium' } },
      ],
      'Versatile storage basket with a removable lid. Ideal for organizing toys, linens, or pantry items.',
      'Storage basket with removable lid',
      false,
      ['storage', 'organizing']
    ),
    createProduct(
      'Sabai Matka Basket',
      'sabai-matka-basket',
      categories[0],
      102000,
      120000,
      ['/Images/p1.webp', '/Images/p1.1.webp', '/Images/p1.2.webp', '/Images/p1.3.webp'],
      [
        { name: 'Beige', sku: 'SMB-B', price: 102000, compareAtPrice: 120000, inventory: 18, attributes: { color: 'Beige' } },
        { name: 'Natural', sku: 'SMB-N', price: 110000, compareAtPrice: 130000, inventory: 10, attributes: { color: 'Natural' } },
        { name: 'Brown', sku: 'SMB-BR', price: 115000, compareAtPrice: 135000, inventory: 7, attributes: { color: 'Brown' } },
      ],
      'Traditional Matka-style basket with a rounded bottom and wide opening. Handwoven using age-old techniques.',
      'Traditional Matka-style basket with rustic charm',
      true,
      ['traditional', 'rustic']
    ),
    createProduct(
      'Sabai Mat (Beige)',
      'sabai-mat-beige',
      categories[5],
      110000,
      130000,
      ['/Images/p7.webp', '/Images/p7.1.webp'],
      [
        { name: '2x3 ft', sku: 'SMB-2x3', price: 110000, compareAtPrice: 130000, inventory: 12, attributes: { size: '2x3 ft', color: 'Beige' } },
        { name: '3x5 ft', sku: 'SMB-3x5', price: 180000, compareAtPrice: 220000, inventory: 6, attributes: { size: '3x5 ft', color: 'Beige' } },
        { name: '4x6 ft', sku: 'SMB-4x6', price: 250000, compareAtPrice: 300000, inventory: 3, attributes: { size: '4x6 ft', color: 'Beige' } },
      ],
      'Elegant beige floor mat handwoven from premium Sabai grass. The natural fibers provide a cool, comfortable surface perfect for any room.',
      'Premium handwoven floor mat in natural beige',
      true,
      ['home-decor', 'floor-mat', 'eco-friendly']
    ),
    createProduct(
      'Sabai Tote Bag',
      'sabai-tote-bag',
      categories[1],
      140000,
      170000,
      ['/Images/p6.jpg', '/Images/p6.webp'],
      [
        { name: 'Natural', sku: 'STB-N', price: 140000, compareAtPrice: 170000, inventory: 12, attributes: { color: 'Natural' } },
        { name: 'Beige', sku: 'STB-B', price: 150000, compareAtPrice: 180000, inventory: 8, attributes: { color: 'Beige' } },
      ],
      'Stylish and sturdy tote bag woven from Sabai grass. Features comfortable handles and spacious interior.',
      'Eco-friendly tote bag for everyday use',
      true,
      ['bag', 'fashion', 'everyday', 'sustainable']
    ),
    createProduct(
      'Sabai Coaster Set (4 pcs)',
      'sabai-coaster-set-4',
      categories[2],
      45000,
      60000,
      ['/Images/l1.png'],
      [
        { name: 'Set of 4', sku: 'SCS-4', price: 45000, compareAtPrice: 60000, inventory: 30, attributes: { quantity: '4' } },
        { name: 'Set of 6', sku: 'SCS-6', price: 65000, compareAtPrice: 85000, inventory: 20, attributes: { quantity: '6' } },
      ],
      'Set of 4 round coasters handwoven from Sabai grass. Protects surfaces while adding natural texture.',
      'Handwoven coaster set - protects surfaces naturally',
      true,
      ['tableware', 'gift', 'set']
    ),
    createProduct(
      'Sabai Sun Hat',
      'sabai-sun-hat',
      categories[3],
      95000,
      120000,
      ['/Images/hat.png'],
      [
        { name: 'M/L', sku: 'SSH-ML', price: 95000, compareAtPrice: 120000, inventory: 15, attributes: { size: 'M/L' } },
      ],
      'Wide-brimmed sun hat woven from breathable Sabai grass. Provides excellent UV protection while keeping you cool.',
      'Breathable wide-brim sun hat with UV protection',
      false,
      ['accessories', 'sun-protection', 'outdoor']
    ),
    createProduct(
      'Sabai Mat (Green)',
      'sabai-mat-green',
      categories[5],
      100000,
      120000,
      ['/Images/p7.1.webp'],
      [
        { name: '2x3 ft', sku: 'SMG-2x3', price: 100000, compareAtPrice: 120000, inventory: 15, attributes: { size: '2x3 ft', color: 'Green' } },
        { name: '3x5 ft', sku: 'SMG-3x5', price: 170000, compareAtPrice: 200000, inventory: 8, attributes: { size: '3x5 ft', color: 'Green' } },
      ],
      'Vibrant green floor mat dyed with natural, non-toxic pigments.',
      'Natural green dyed floor mat',
      false,
      ['home-decor', 'floor-mat', 'natural-dye']
    ),
    createProduct(
      'Beige Utility Basket',
      'beige-utility-basket',
      categories[0],
      105000,
      125000,
      ['/Images/p8.webp', '/Images/p8.1.webp', '/Images/p8.2.webp', '/Images/p8.3.webp'],
      [
        { name: 'Small', sku: 'BUB-S', price: 105000, compareAtPrice: 125000, inventory: 20, attributes: { size: 'Small' } },
        { name: 'Medium', sku: 'BUB-M', price: 120000, compareAtPrice: 140000, inventory: 12, attributes: { size: 'Medium' } },
        { name: 'Large', sku: 'BUB-L', price: 140000, compareAtPrice: 160000, inventory: 6, attributes: { size: 'Large' } },
      ],
      'Multi-purpose utility basket in classic beige. The sturdy construction handles heavy loads.',
      'Versatile utility basket for heavy-duty storage',
      false,
      ['utility', 'storage', 'heavy-duty']
    ),
    createProduct(
      'Sabai Casserole (Beige)',
      'sabai-casserole-beige',
      categories[0],
      115000,
      140000,
      ['/Images/p4.webp'],
      [
        { name: 'Medium', sku: 'SCB-M', price: 115000, compareAtPrice: 140000, inventory: 8, attributes: { size: 'Medium', color: 'Beige' } },
        { name: 'Large', sku: 'SCB-L', price: 140000, compareAtPrice: 170000, inventory: 4, attributes: { size: 'Large', color: 'Beige' } },
      ],
      'Unique casserole-style basket with high sides and handles. Perfect for serving bread or as a decorative centerpiece.',
      'Casserole-style serving and storage basket',
      false,
      ['serving', 'kitchen', 'decorative']
    ),
  ]);
  console.log('🛍️ Created products');

  // Create default address for demo customer
  await prisma.address.create({
    data: {
      userId: customer.id,
      name: 'Demo Customer',
      phone: '+91 98765 43210',
      addressLine1: '123 Main Street',
      addressLine2: 'Near Central Park',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India',
      isDefault: true,
      type: 'shipping',
    },
  });
  console.log('📍 Created default address');

  // Create sample coupons
  await Promise.all([
    prisma.coupon.create({
      data: {
        code: 'WELCOME10',
        description: '10% off on first order',
        type: 'percentage',
        value: 10,
        minOrderAmount: 100000,
        maxDiscount: 50000,
        usageLimit: 100,
        userLimit: 1,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.coupon.create({
      data: {
        code: 'FLAT200',
        description: 'Flat ₹200 off on orders above ₹1500',
        type: 'fixed',
        value: 20000,
        minOrderAmount: 150000,
        usageLimit: 50,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.coupon.create({
      data: {
        code: 'FREESHIP',
        description: 'Free shipping on all orders',
        type: 'fixed',
        value: 9900, // shipping cost
        minOrderAmount: 1,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    }),
  ]);
  console.log('🎫 Created coupons');

  console.log('✅ Database seed completed successfully!');
  console.log('\n📋 Login credentials:');
  console.log('   Admin:    admin@sabaicraft.com / admin123');
  console.log('   Customer: customer@sabaicraft.com / customer123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });