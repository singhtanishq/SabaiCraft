import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma/client';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest, authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// All admin routes require admin middleware
router.use(authMiddleware, adminMiddleware);

// Dashboard stats
router.get('/dashboard', async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      lowStockProducts,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: 'PAID' } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { placedAt: 'desc' },
        include: { user: { select: { name: true, email: true } }, items: true },
      }),
      prisma.productVariant.findMany({
        where: { inventory: { lte: 5, gt: 0 } },
        take: 10,
        include: { product: { select: { name: true, slug: true } } },
      }),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        recentOrders,
        lowStockProducts,
      },
    });
  } catch (error) {
    next(error);
  }
});

// User management
router.get('/users', async (req, res, next) => {
  try {
    const { page = '1', limit = '20', search, role } = req.query;
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    if (role) where.role = role;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
        select: { id: true, email: true, name: true, phone: true, role: true, createdAt: true, _count: { select: { orders: true } } },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/users/:id/role', async (req, res, next) => {
  try {
    const schema = z.object({ role: z.enum(['CUSTOMER', 'ADMIN']) });
    const { role } = schema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
      select: { id: true, email: true, name: true, role: true },
    });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

// Product management (reuse product routes with admin middleware)
// We'll use the same product routes but with admin checks

// Category management (reuse category routes)

// Order management (reuse order routes)

// Inventory management
router.get('/inventory', async (req, res, next) => {
  try {
    const { page = '1', limit = '50', lowStock } = req.query;
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (lowStock === 'true') {
      where.inventory = { lte: 10 };
    }

    const [variants, total] = await Promise.all([
      prisma.productVariant.findMany({
        where,
        orderBy: { inventory: 'asc' },
        skip,
        take: limitNum,
        include: { product: { select: { name: true, slug: true, images: { take: 1 } } } },
      }),
      prisma.productVariant.count({ where }),
    ]);

    res.json({
      success: true,
      data: variants,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/inventory/:variantId', async (req, res, next) => {
  try {
    const schema = z.object({ inventory: z.number().int().nonnegative() });
    const { inventory } = schema.parse(req.body);

    const variant = await prisma.productVariant.update({
      where: { id: req.params.variantId },
      data: { inventory },
      include: { product: { select: { name: true } } },
    });
    res.json({ success: true, data: variant });
  } catch (error) {
    next(error);
  }
});

// Coupons
router.get('/coupons', async (req, res, next) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: coupons });
  } catch (error) {
    next(error);
  }
});

router.post('/coupons', async (req, res, next) => {
  try {
    const schema = z.object({
      code: z.string().min(1).toUpperCase(),
      description: z.string(),
      type: z.enum(['percentage', 'fixed']),
      value: z.number().int().positive(),
      minOrderAmount: z.number().int().positive().optional(),
      maxDiscount: z.number().int().positive().optional(),
      usageLimit: z.number().int().positive().optional(),
      userLimit: z.number().int().positive().optional(),
      validFrom: z.string().datetime(),
      validUntil: z.string().datetime(),
      applicableCategories: z.array(z.string()).optional(),
      applicableProducts: z.array(z.string()).optional(),
    });
    const data = schema.parse(req.body);

    const existing = await prisma.coupon.findUnique({ where: { code: data.code } });
    if (existing) throw new AppError(409, 'Coupon code already exists');

    const coupon = await prisma.coupon.create({
      data: { 
        ...data, 
        validFrom: new Date(data.validFrom), 
        validUntil: new Date(data.validUntil),
        applicableCategories: data.applicableCategories?.join(',') || '',
        applicableProducts: data.applicableProducts?.join(',') || '',
      },
    });
    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    next(error);
  }
});

router.put('/coupons/:id', async (req, res, next) => {
  try {
    const coupon = await prisma.coupon.update({ where: { id: req.params.id as string }, data: req.body });
    res.json({ success: true, data: coupon });
  } catch (error) {
    next(error);
  }
});

router.delete('/coupons/:id', async (req, res, next) => {
  try {
    await prisma.coupon.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    next(error);
  }
});

// Reviews moderation
router.get('/reviews', async (req, res, next) => {
  try {
    const { page = '1', limit = '20', status } = req.query;
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (status === 'pending') where.isApproved = false;
    if (status === 'approved') where.isApproved = true;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
        include: { product: { select: { name: true } } },
      }),
      prisma.review.count({ where }),
    ]);

    res.json({
      success: true,
      data: reviews,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/reviews/:id/approve', async (req, res, next) => {
  try {
    const review = await prisma.review.update({
      where: { id: req.params.id as string },
      data: { isApproved: true },
    });
    res.json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
});

router.patch('/reviews/:id/reject', async (req, res, next) => {
  try {
    const review = await prisma.review.update({
      where: { id: req.params.id as string },
      data: { isApproved: false },
    });
    res.json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
});

export default router;