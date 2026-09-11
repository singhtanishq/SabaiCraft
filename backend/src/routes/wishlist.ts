import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma/client';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();

// Get wishlist
router.get('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const items = await prisma.wishlistItem.findMany({
      where: { userId: req.user!.id },
      include: {
        product: { include: { images: { take: 1 }, variants: { where: { inventory: { gt: 0 } }, take: 1 } } },
        variant: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
});

// Add to wishlist
router.post('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const schema = z.object({
      productId: z.string(),
      variantId: z.string().optional(),
    });
    const data = schema.parse(req.body);

    // Check if already in wishlist
    const existing = await prisma.wishlistItem.findUnique({
      where: { userId_productId_variantId: { userId: req.user!.id, productId: data.productId, variantId: data.variantId } },
    });
    if (existing) {
      return res.json({ success: true, data: existing, message: 'Already in wishlist' });
    }

    const item = await prisma.wishlistItem.create({
      data: { userId: req.user!.id, productId: data.productId, variantId: data.variantId },
      include: { product: { include: { images: { take: 1 } } } },
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
});

// Remove from wishlist
router.delete('/:itemId', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const item = await prisma.wishlistItem.findUnique({ where: { id: req.params.itemId } });
    if (!item) throw new AppError(404, 'Wishlist item not found');
    if (item.userId !== req.user!.id) throw new AppError(403, 'Not authorized');

    await prisma.wishlistItem.delete({ where: { id: req.params.itemId } });
    res.json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    next(error);
  }
});

// Clear wishlist
router.delete('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    await prisma.wishlistItem.deleteMany({ where: { userId: req.user!.id } });
    res.json({ success: true, message: 'Wishlist cleared' });
  } catch (error) {
    next(error);
  }
});

export default router;