import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma/client';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest, authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// Get user orders
router.get('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const { status, page = '1', limit = '10' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    const where: any = { userId: req.user!.id };
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { placedAt: 'desc' },
        skip,
        take: limitNum,
        include: {
          items: { include: { product: { include: { images: { take: 1 } } } } },
          shippingAddress: true,
        },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    next(error);
  }
});

// Get order by ID
router.get('/:id', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id as string },
      include: {
        items: { include: { product: { include: { images: true } } } },
        shippingAddress: true,
        billingAddress: true,
      },
    });

    if (!order) throw new AppError(404, 'Order not found');
    if (order.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
      throw new AppError(403, 'Not authorized to view this order');
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

// Create order from cart
router.post('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const schema = z.object({
      shippingAddressId: z.string(),
      billingAddressId: z.string().optional(),
      paymentMethod: z.enum(['CARD', 'UPI', 'NETBANKING', 'WALLET', 'COD']),
      notes: z.string().optional(),
    });
    const data = schema.parse(req.body);

    // Get user's cart
    const cart = await prisma.cart.findFirst({
      where: { userId: req.user!.id },
      include: { items: { include: { product: { include: { images: { take: 1 } } }, variant: true } } },
    });
    if (!cart || cart.items.length === 0) {
      throw new AppError(400, 'Cart is empty');
    }

    // Verify inventory
    for (const item of cart.items) {
      if (item.variant.inventory < item.quantity) {
        throw new AppError(400, `Insufficient inventory for ${item.product.name}`);
      }
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);
    const shipping = subtotal >= 200000 ? 0 : 9900;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;

    // Get shipping address and verify ownership
    const shippingAddress = await prisma.address.findUnique({ where: { id: data.shippingAddressId } });
    if (!shippingAddress) throw new AppError(404, 'Shipping address not found');
    if (shippingAddress.userId !== req.user!.id) {
      throw new AppError(403, 'Not authorized to use this address');
    }

    if (data.billingAddressId && data.billingAddressId !== data.shippingAddressId) {
      const billingAddress = await prisma.address.findUnique({ where: { id: data.billingAddressId } });
      if (!billingAddress) throw new AppError(404, 'Billing address not found');
      if (billingAddress.userId !== req.user!.id) {
        throw new AppError(403, 'Not authorized to use this address');
      }
    }

    const billingAddressId = data.billingAddressId || data.shippingAddressId;

    // Create order
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const order = await tx.order.create({
        data: {
          userId: req.user!.id,
          orderNumber,
          paymentMethod: data.paymentMethod,
          paymentStatus: data.paymentMethod === 'COD' ? 'COD' : 'PENDING',
          subtotal,
          shipping,
          tax,
          total,
          shippingAddressId: data.shippingAddressId,
          billingAddressId,
          notes: data.notes,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              productName: item.product.name,
              productSlug: item.product.slug,
              variantId: item.variantId,
              variantName: item.variant.name,
              variantAttributes: item.variant.attributes as any,
              quantity: item.quantity,
              price: item.variant.price,
              total: item.variant.price * item.quantity,
              image: item.product.images[0]?.url,
            })),
          },
        },
        include: { items: true, shippingAddress: true },
      });

      // Update inventory
      for (const item of cart.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { inventory: { decrement: item.quantity } },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return order;
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

// Admin: Get all orders
router.get('/admin/all', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const { status, paymentStatus, page = '1', limit = '20', search } = req.query;
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search as string, mode: 'insensitive' } },
        { user: { name: { contains: search as string, mode: 'insensitive' } } },
        { user: { email: { contains: search as string, mode: 'insensitive' } } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { placedAt: 'desc' },
        skip,
        take: limitNum,
        include: { user: { select: { id: true, name: true, email: true } }, items: true },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    next(error);
  }
});

// Admin: Update order status
router.patch('/admin/:id/status', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const schema = z.object({ status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']) });
    const { status } = schema.parse(req.body);

    const order = await prisma.order.update({
      where: { id: req.params.id as string },
      data: {
        status,
        ...(status === 'CONFIRMED' && { confirmedAt: new Date() }),
        ...(status === 'SHIPPED' && { shippedAt: new Date() }),
        ...(status === 'DELIVERED' && { deliveredAt: new Date() }),
        ...(status === 'CANCELLED' && { cancelledAt: new Date() }),
      },
      include: { items: true },
    });

    // If cancelled, restore inventory
    if (status === 'CANCELLED') {
      await prisma.$transaction(
        order.items.map((item) =>
          prisma.productVariant.update({
            where: { id: item.variantId },
            data: { inventory: { increment: item.quantity } },
          })
        )
      );
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

export default router;