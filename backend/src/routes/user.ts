import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../prisma/client';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();

// Get user profile
router.get('/profile', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, email: true, name: true, phone: true, avatar: true, role: true, createdAt: true },
    });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

// Update profile
router.put('/profile', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const schema = z.object({
      name: z.string().min(1).optional(),
      phone: z.string().optional(),
    });
    const data = schema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data,
      select: { id: true, email: true, name: true, phone: true, avatar: true, role: true },
    });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

// Change password
router.put('/password', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const schema = z.object({
      currentPassword: z.string().min(1),
      newPassword: z.string().min(8),
    });
    const data = schema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) throw new AppError(404, 'User not found');

    const isValid = await bcrypt.compare(data.currentPassword, user.passwordHash);
    if (!isValid) throw new AppError(401, 'Current password is incorrect');

    const passwordHash = await bcrypt.hash(data.newPassword, 12);
    await prisma.user.update({ where: { id: req.user!.id }, data: { passwordHash } });

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
});

// Addresses
router.get('/addresses', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user!.id },
      orderBy: { isDefault: 'desc' },
    });
    res.json({ success: true, data: addresses });
  } catch (error) {
    next(error);
  }
});

router.post('/addresses', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const schema = z.object({
      name: z.string().min(1),
      phone: z.string().min(1),
      addressLine1: z.string().min(1),
      addressLine2: z.string().optional(),
      city: z.string().min(1),
      state: z.string().min(1),
      postalCode: z.string().min(1),
      country: z.string().default('India'),
      type: z.enum(['shipping', 'billing']).default('shipping'),
      isDefault: z.boolean().default(false),
    });
    const data = schema.parse(req.body);

    // If setting as default, unset other defaults of same type
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user!.id, type: data.type, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: { ...data, userId: req.user!.id },
    });
    res.status(201).json({ success: true, data: address });
  } catch (error) {
    next(error);
  }
});

router.put('/addresses/:id', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const address = await prisma.address.findUnique({ where: { id: req.params.id } });
    if (!address) throw new AppError(404, 'Address not found');
    if (address.userId !== req.user!.id) throw new AppError(403, 'Not authorized');

    const schema = z.object({
      name: z.string().min(1).optional(),
      phone: z.string().min(1).optional(),
      addressLine1: z.string().min(1).optional(),
      addressLine2: z.string().optional(),
      city: z.string().min(1).optional(),
      state: z.string().min(1).optional(),
      postalCode: z.string().min(1).optional(),
      country: z.string().optional(),
      type: z.enum(['shipping', 'billing']).optional(),
      isDefault: z.boolean().optional(),
    });
    const data = schema.parse(req.body);

    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user!.id, type: data.type || address.type, isDefault: true },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.address.update({ where: { id: req.params.id }, data });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

router.delete('/addresses/:id', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const address = await prisma.address.findUnique({ where: { id: req.params.id } });
    if (!address) throw new AppError(404, 'Address not found');
    if (address.userId !== req.user!.id) throw new AppError(403, 'Not authorized');

    await prisma.address.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Address deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;