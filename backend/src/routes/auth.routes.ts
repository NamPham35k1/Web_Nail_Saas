import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../db/prisma.js';
import { generateSlug, isValidSlug } from '../utils/slug.js';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'nailvibe_dev_secret_key_123456789';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const registerSchema = z.object({
  email: z.string().email('Email không đúng định dạng.'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự.'),
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự.'),
  salonName: z.string().min(2, 'Tên tiệm phải có ít nhất 2 ký tự.'),
  phone: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email('Email không đúng định dạng.'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu.')
});

/**
 * Register a new User and their initial Nail Salon Tenant
 */
router.post('/register', async (req, res): Promise<any> => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors[0].message });
    }

    const { email, password, fullName, salonName, phone } = parseResult.data;

    // Check if email already registered
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác.' });
    }

    // Generate unique slug
    let baseSlug = generateSlug(salonName);
    const slugCheck = isValidSlug(baseSlug);
    if (!slugCheck.valid) {
      baseSlug = `tiem-nail-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    let finalSlug = baseSlug;
    let collisionCount = 1;
    while (await prisma.tenant.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${Math.floor(100 + Math.random() * 900)}`;
      collisionCount++;
      if (collisionCount > 10) {
        finalSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
        break;
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create User, Tenant, Membership, Settings, WorkingHours, OnboardingDraft in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          fullName,
          phone: phone || null
        }
      });

      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 14); // 14 days free trial

      const tenant = await tx.tenant.create({
        data: {
          name: salonName,
          slug: finalSlug,
          phone: phone || null,
          email,
          plan: 'TRIAL',
          trialEndsAt,
          isPublished: false
        }
      });

      await tx.tenantMembership.create({
        data: {
          userId: user.id,
          tenantId: tenant.id,
          role: 'OWNER'
        }
      });

      await tx.tenantSettings.create({
        data: {
          tenantId: tenant.id,
          brandColor: '#D46B84',
          brandSecondaryColor: '#FFF0F5',
          bookingPolicy: 'Vui lòng đến đúng giờ trước 10 phút. Nếu hủy xin báo trước ít nhất 2 giờ.'
        }
      });

      // Default working hours: 7 days open 09:00 - 20:00
      for (let day = 0; day <= 6; day++) {
        await tx.workingHours.create({
          data: {
            tenantId: tenant.id,
            dayOfWeek: day,
            isOpen: true,
            openTime: '09:00',
            closeTime: '20:00'
          }
        });
      }

      const draft = await tx.onboardingDraft.create({
        data: {
          tenantId: tenant.id,
          currentStep: 1,
          isCompleted: false,
          draftData: JSON.stringify({
            step1: { name: salonName, slug: finalSlug, phone: phone || '' }
          })
        }
      });

      return { user, tenant, draft };
    });

    const token = jwt.sign(
      { userId: result.user.id, tenantId: result.tenant.id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    return res.status(201).json({
      message: 'Đăng ký thành công!',
      token,
      user: {
        id: result.user.id,
        email: result.user.email,
        fullName: result.user.fullName,
        phone: result.user.phone
      },
      tenant: {
        id: result.tenant.id,
        name: result.tenant.name,
        slug: result.tenant.slug,
        isPublished: result.tenant.isPublished,
        plan: result.tenant.plan,
        trialEndsAt: result.tenant.trialEndsAt
      },
      onboarding: {
        currentStep: result.draft.currentStep,
        isCompleted: result.draft.isCompleted
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Đã xảy ra lỗi khi tạo tài khoản. Vui lòng thử lại.' });
  }
});

/**
 * Login
 */
router.post('/login', async (req, res): Promise<any> => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors[0].message });
    }

    const { email, password } = parseResult.data;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        memberships: {
          include: {
            tenant: {
              include: {
                onboardingDraft: true,
                settings: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không chính xác.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không chính xác.' });
    }

    // Pick active tenant (first owned or managed)
    const primaryMembership = user.memberships[0];
    const activeTenant = primaryMembership ? primaryMembership.tenant : null;

    const token = jwt.sign(
      { userId: user.id, tenantId: activeTenant?.id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    return res.json({
      message: 'Đăng nhập thành công!',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone
      },
      tenants: user.memberships.map((m) => ({
        id: m.tenant.id,
        name: m.tenant.name,
        slug: m.tenant.slug,
        role: m.role,
        isPublished: m.tenant.isPublished,
        plan: m.tenant.plan,
        onboarding: m.tenant.onboardingDraft
      })),
      activeTenant: activeTenant
        ? {
            id: activeTenant.id,
            name: activeTenant.name,
            slug: activeTenant.slug,
            isPublished: activeTenant.isPublished,
            plan: activeTenant.plan,
            onboarding: activeTenant.onboardingDraft
          }
        : null
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Lỗi máy chủ khi đăng nhập.' });
  }
});

/**
 * Get current authenticated user profile and memberships
 */
router.get('/me', authenticate, async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        memberships: {
          include: {
            tenant: {
              include: {
                settings: true,
                onboardingDraft: true
              }
            }
          }
        }
      }
    });

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ error: 'Không thể tải thông tin người dùng.' });
  }
});

export default router;
