import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma/client';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest, authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// Get all products with filters
router.get('/', async (req, res, next) => {
  try {
    const {
      query,
      category,
      minPrice,
      maxPrice,
      sort = 'newest',
      page = '1',
      limit = '12',
      inStock,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    const where: any = { isActive: true };

    if (query) {
      where.OR = [
        { name: { contains: query as string, mode: 'insensitive' } },
        { description: { contains: query as string, mode: 'insensitive' } },
        { tags: { has: query as string } },
      ];
    }

    if (category) {
      where.categoryId = category;
    }

    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) where.basePrice.gte = parseInt(minPrice as string);
      if (maxPrice) where.basePrice.lte = parseInt(maxPrice as string);
    }

    if (inStock === 'true') {
      where.variants = { some: { inventory: { gt: 0 } } };
    }

    let orderBy: any = { createdAt: 'desc' };
    switch (sort) {
      case 'price_asc':
        orderBy = { basePrice: 'asc' };
        break;
      case 'price_desc':
        orderBy = { basePrice: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'popular':
        orderBy = { reviewCount: 'desc' };
        break;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { position: 'asc' }, take: 1 },
          variants: { where: { inventory: { gt: 0 } }, take: 1 },
        },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Search suggestions — must be registered BEFORE '/:slug' so that
// "search" is not treated as a slug.
router.get('/search/suggestions', async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || (q as string).length < 2) {
      return res.json({ success: true, data: [] });
    }

    const query = q as string;
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query } },
          { tags: { contains: query } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        basePrice: true,
        categoryId: true,
        images: { take: 1, orderBy: { position: 'asc' } },
      },
      take: 5,
    });

    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
});

// Get featured products
router.get('/featured', async (req, res, next) => {
  try {
    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit as string) || 8));
    const products = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { position: 'asc' }, take: 1 },
        variants: { where: { inventory: { gt: 0 } }, take: 1 },
      },
    });
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
});

// Get product by slug
router.get('/:slug', async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug, isActive: true },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { position: 'asc' } },
        variants: { orderBy: { price: 'asc' } },
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: { id: true, userName: true, userAvatar: true, rating: true, title: true, content: true, images: true, createdAt: true },
        },
      },
    });

    if (!product) {
      throw new AppError(404, 'Product not found');
    }

    // Get related products
    const related = await prisma.product.findMany({
      where: { categoryId: product.categoryId, isActive: true, id: { not: product.id } },
      take: 4,
      include: { images: { take: 1 }, variants: { where: { inventory: { gt: 0 } }, take: 1 } },
    });

    res.json({ success: true, data: { ...product, related } });
  } catch (error) {
    next(error);
  }
});

// Admin: Create product
router.post('/', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const schema = z.object({
      name: z.string().min(1),
      slug: z.string().min(1),
      description: z.string().min(1),
      shortDescription: z.string().optional(),
      categoryId: z.string().min(1),
      basePrice: z.number().int().positive(),
      compareAtPrice: z.number().int().positive().optional(),
      images: z.array(z.object({ url: z.string().url(), alt: z.string(), position: z.number().int() })),
      variants: z.array(z.object({
        name: z.string(),
        sku: z.string(),
        price: z.number().int().positive(),
        compareAtPrice: z.number().int().positive().optional(),
        inventory: z.number().int().nonnegative(),
        image: z.string().optional(),
        attributes: z.string(), // JSON string
      })),
      tags: z.array(z.string()).optional(),
    });

    const data = schema.parse(req.body);

    // Check if slug exists
    const existing = await prisma.product.findUnique({ where: { slug: data.slug } });
    if (existing) throw new AppError(409, 'Product with this slug already exists');

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        shortDescription: data.shortDescription,
        categoryId: data.categoryId,
        basePrice: data.basePrice,
        compareAtPrice: data.compareAtPrice,
        tags: data.tags ? data.tags.join(',') : '',
        images: { create: data.images },
        variants: { create: data.variants },
      },
      include: { images: true, variants: true },
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

// Admin: Update product (whitelisted fields only — never pass raw body to Prisma)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const schema = z.object({
      name: z.string().min(1).optional(),
      slug: z.string().min(1).optional(),
      description: z.string().min(1).optional(),
      shortDescription: z.string().optional(),
      categoryId: z.string().optional(),
      basePrice: z.number().int().positive().optional(),
      compareAtPrice: z.number().int().positive().nullable().optional(),
      isActive: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
      tags: z.array(z.string()).optional(),
      images: z.array(z.object({
        id: z.string().optional(),
        url: z.string().url(),
        alt: z.string(),
        position: z.number().int(),
      })).optional(),
      variants: z.array(z.object({
        id: z.string().optional(),
        name: z.string(),
        sku: z.string(),
        price: z.number().int().positive(),
        compareAtPrice: z.number().int().positive().nullable().optional(),
        inventory: z.number().int().nonnegative(),
        image: z.string().optional(),
        attributes: z.string(),
      })).optional(),
    });
    const data = schema.parse(req.body);

    const { images, variants, tags, ...scalarData } = data;
    if (tags !== undefined) {
      (scalarData as any).tags = tags.join(',');
    }

    const product = await prisma.$transaction(async (tx) => {
      // Replace image/variant sets when provided.
      if (images) {
        await tx.productImage.deleteMany({ where: { productId: req.params.id as string } });
        if (images.length > 0) {
          await tx.productImage.createMany({
            data: images.map((img) => ({ ...img, productId: req.params.id as string })),
          });
        }
      }
      if (variants) {
        await tx.productVariant.deleteMany({ where: { productId: req.params.id as string } });
        if (variants.length > 0) {
          await tx.productVariant.createMany({
            data: variants.map((v) => ({ ...v, productId: req.params.id as string })),
          });
        }
      }
      return tx.product.update({
        where: { id: req.params.id as string },
        data: scalarData,
        include: { images: true, variants: true },
      });
    });

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

// Admin: Delete product (soft delete keeps order history references intact)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    await prisma.product.update({
      where: { id: req.params.id as string },
      data: { isActive: false },
    });
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;