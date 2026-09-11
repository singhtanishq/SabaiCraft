import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma/client';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();

// Get cart
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.cookies?.cart_session;

    if (!userId && !sessionId) {
      return res.json({ success: true, data: { items: [], subtotal: 0, total: 0 } });
    }

    const where = userId ? { userId } : { sessionId };

    let cart = await prisma.cart.findFirst({
      where,
      include: {
        items: {
          include: {
            product: { include: { images: { take: 1 } } },
            variant: true,
          },
        },
      },
    });

    if (!cart) {
      return res.json({ success: true, data: { items: [], subtotal: 0, total: 0 } });
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);
    const shipping = subtotal >= 200000 ? 0 : 9900;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;

    res.json({
      success: true,
      data: {
        ...cart,
        subtotal,
        shipping,
        tax,
        total,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Add to cart
router.post('/items', async (req: AuthRequest, res, next) => {
  try {
    const schema = z.object({
      productId: z.string(),
      variantId: z.string(),
      quantity: z.number().int().positive().default(1),
    });
    const data = schema.parse(req.body);

    const userId = req.user?.id;
    let sessionId = req.cookies?.cart_session;

    // Verify product and variant exist
    const variant = await prisma.productVariant.findUnique({
      where: { id: data.variantId },
      include: { product: true },
    });
    if (!variant) throw new AppError(404, 'Product variant not found');
    if (variant.inventory < data.quantity) throw new AppError(400, 'Insufficient inventory');

    // Find or create cart
    let cart;
    if (userId) {
      cart = await prisma.cart.findFirst({ where: { userId } });
      if (!cart) {
        cart = await prisma.cart.create({ data: { userId } });
      }
      // Merge session cart if exists
      if (sessionId) {
        const sessionCart = await prisma.cart.findFirst({ where: { sessionId } });
        if (sessionCart) {
          for (const item of sessionCart.items) {
            await prisma.cartItem.upsert({
              where: { cartId_productId_variantId: { cartId: cart.id, productId: item.productId, variantId: item.variantId } },
              update: { quantity: { increment: item.quantity } },
              create: { cartId: cart.id, productId: item.productId, variantId: item.variantId, quantity: item.quantity },
            });
          }
          await prisma.cart.delete({ where: { id: sessionCart.id } });
          res.clearCookie('cart_session');
        }
      }
    } else {
      if (!sessionId) {
        sessionId = `cart_${Date.now()}`;
        res.cookie('cart_session', sessionId, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
      }
      cart = await prisma.cart.findFirst({ where: { sessionId } });
      if (!cart) {
        cart = await prisma.cart.create({ data: { sessionId } });
      }
    }

    // Add item to cart
    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_productId_variantId: { cartId: cart.id, productId: data.productId, variantId: data.variantId } },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: { increment: data.quantity } },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId: data.productId, variantId: data.variantId, quantity: data.quantity },
      });
    }

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: { include: { images: { take: 1 } } }, variant: true } } },
    });

    const subtotal = updatedCart!.items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);
    const shipping = subtotal >= 200000 ? 0 : 9900;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;

    res.json({ success: true, data: { ...updatedCart, subtotal, shipping, tax, total } });
  } catch (error) {
    next(error);
  }
});

// Update quantity
router.patch('/items/:itemId', async (req: AuthRequest, res, next) => {
  try {
    const schema = z.object({ quantity: z.number().int().nonnegative() });
    const { quantity } = schema.parse(req.body);

    const userId = req.user?.id;
    const sessionId = req.cookies?.cart_session;

    const where = userId ? { userId } : { sessionId };
    const cart = await prisma.cart.findFirst({ where });
    if (!cart) throw new AppError(404, 'Cart not found');

    const item = await prisma.cartItem.findFirst({
      where: { id: req.params.itemId, cartId: cart.id },
      include: { variant: true },
    });
    if (!item) throw new AppError(404, 'Item not found');

    if (quantity === 0) {
      await prisma.cartItem.delete({ where: { id: item.id } });
    } else {
      if (item.variant.inventory < quantity) throw new AppError(400, 'Insufficient inventory');
      await prisma.cartItem.update({ where: { id: item.id }, data: { quantity } });
    }

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: { include: { images: { take: 1 } } }, variant: true } } },
    });

    const subtotal = updatedCart!.items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);
    const shipping = subtotal >= 200000 ? 0 : 9900;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;

    res.json({ success: true, data: { ...updatedCart, subtotal, shipping, tax, total } });
  } catch (error) {
    next(error);
  }
});

// Remove item
router.delete('/items/:itemId', async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.cookies?.cart_session;

    const where = userId ? { userId } : { sessionId };
    const cart = await prisma.cart.findFirst({ where });
    if (!cart) throw new AppError(404, 'Cart not found');

    await prisma.cartItem.delete({ where: { id: req.params.itemId, cartId: cart.id } });

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: { include: { images: { take: 1 } } }, variant: true } } },
    });

    const subtotal = updatedCart!.items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);
    const shipping = subtotal >= 200000 ? 0 : 9900;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;

    res.json({ success: true, data: { ...updatedCart, subtotal, shipping, tax, total } });
  } catch (error) {
    next(error);
  }
});

// Clear cart
router.delete('/', async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.cookies?.cart_session;

    const where = userId ? { userId } : { sessionId };
    const cart = await prisma.cart.findFirst({ where });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    res.json({ success: true, data: { items: [], subtotal: 0, shipping: 0, tax: 0, total: 0 } });
  } catch (error) {
    next(error);
  }
});

export default router;