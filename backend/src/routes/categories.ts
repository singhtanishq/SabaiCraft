import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma/client';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest, authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// Get all categories
router.get('/', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: { include: { _count: { select: { products: true } } } },
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
});

// Get category by slug with products
router.get('/:slug', async (req, res, next) => {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug },
      include: {
        children: { include: { _count: { select: { products: true } } } },
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      throw new AppError(404, 'Category not found');
    }

    // Get products in this category
    const {
      page = '1',
      limit = '12',
      sort = 'newest',
      minPrice,
      maxPrice,
      inStock,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    const categoryIds = [category.id, ...category.children.map(c => c.id)];

    const where: any = {
      isActive: true,
      categoryId: { in: categoryIds },
    };

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
      case 'price_asc': orderBy = { basePrice: 'asc' }; break;
      case 'price_desc': orderBy = { basePrice: 'desc' }; break;
      case 'rating': orderBy = { rating: 'desc' }; break;
      case 'popular': orderBy = { reviewCount: 'desc' }; break;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        include: { images: { take: 1 }, variants: { where: { inventory: { gt: 0 } }, take: 1 } },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      data: { category, products, pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } },
    });
  } catch (error) {
    next(error);
  }
});

// Admin: Create category
router.post('/', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const schema = z.object({
      name: z.string().min(1),
      slug: z.string().min(1),
      description: z.string().optional(),
      image: z.string().url().optional(),
      parentId: z.string().optional(),
    });
    const data = schema.parse(req.body);

    const category = await prisma.category.create({ data });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
});

// Admin: Update category
router.put('/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const category = await prisma.category.update({ where: { id: req.params.id as string }, data: req.body });
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
});

// Admin: Delete category
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;