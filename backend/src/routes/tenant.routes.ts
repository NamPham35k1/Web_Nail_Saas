import { Router, Response } from 'express';
import { prisma } from '../db/prisma.js';
import { authenticate, requireTenant, requireManagerOrOwner, AuthenticatedRequest } from '../middleware/auth.js';
import { isValidSlug } from '../utils/slug.js';

const router = Router();

router.use(authenticate, requireTenant);

/**
 * GET /api/tenant/current
 * Return active tenant details, settings, and stats
 */
router.get('/current', async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const tenantId = req.tenant!.id;

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        settings: true,
        workingHours: {
          orderBy: { dayOfWeek: 'asc' }
        },
        _count: {
          select: {
            services: true,
            staff: true,
            appointments: true,
            customers: true
          }
        }
      }
    });

    if (!tenant) {
      return res.status(404).json({ error: 'Không tìm thấy thông tin tiệm.' });
    }

    return res.json({ tenant, role: req.tenantRole });
  } catch (error) {
    console.error('get current tenant error:', error);
    return res.status(500).json({ error: 'Không thể tải thông tin tiệm.' });
  }
});

/**
 * GET /api/tenant/check-slug
 * Check if a candidate slug is available
 */
router.get('/check-slug', async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const slug = (req.query.slug as string || '').trim().toLowerCase();
    const currentTenantId = req.tenant!.id;

    const check = isValidSlug(slug);
    if (!check.valid) {
      return res.json({ available: false, message: check.message });
    }

    const existing = await prisma.tenant.findUnique({ where: { slug } });
    if (existing && existing.id !== currentTenantId) {
      return res.json({ available: false, message: `Slug '${slug}' đã được tiệm khác sử dụng.` });
    }

    return res.json({ available: true, message: `Slug '${slug}' có thể sử dụng!` });
  } catch (error) {
    return res.status(500).json({ error: 'Lỗi kiểm tra slug.' });
  }
});

/**
 * PUT /api/tenant/slug
 * Change salon public slug
 */
router.put('/slug', requireManagerOrOwner, async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const tenantId = req.tenant!.id;
    const { slug } = req.body;

    const cleanSlug = (slug || '').trim().toLowerCase();
    const check = isValidSlug(cleanSlug);
    if (!check.valid) {
      return res.status(400).json({ error: check.message });
    }

    const existing = await prisma.tenant.findUnique({ where: { slug: cleanSlug } });
    if (existing && existing.id !== tenantId) {
      return res.status(400).json({ error: `Slug '${cleanSlug}' đã được tiệm khác đăng ký trước.` });
    }

    const oldSlug = req.tenant!.slug;

    const updated = await prisma.tenant.update({
      where: { id: tenantId },
      data: { slug: cleanSlug }
    });

    return res.json({
      message: 'Cập nhật đường dẫn website thành công!',
      oldSlug,
      newSlug: updated.slug,
      warning: oldSlug !== updated.slug ? `Lưu ý: Khách hàng sử dụng link cũ '/s/${oldSlug}' sẽ không thể truy cập. Hãy cập nhật lại link mới '/s/${updated.slug}' trên mạng xã hội hoặc in lại mã QR.` : null
    });
  } catch (error) {
    console.error('update slug error:', error);
    return res.status(500).json({ error: 'Lỗi cập nhật slug.' });
  }
});

/**
 * PUT /api/tenant/profile
 * Update salon basic information
 */
router.put('/profile', requireManagerOrOwner, async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const tenantId = req.tenant!.id;
    const { name, phone, email, address, description } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Tên tiệm phải có ít nhất 2 ký tự.' });
    }

    const updated = await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        name: name.trim(),
        phone: phone !== undefined ? phone.trim() : undefined,
        email: email !== undefined ? email.trim() : undefined,
        address: address !== undefined ? address.trim() : undefined,
        description: description !== undefined ? description.trim() : undefined
      }
    });

    return res.json({
      message: 'Cập nhật thông tin tiệm thành công!',
      tenant: updated
    });
  } catch (error) {
    console.error('update profile error:', error);
    return res.status(500).json({ error: 'Lỗi cập nhật thông tin tiệm.' });
  }
});

/**
 * PUT /api/tenant/settings
 * Update branding and booking settings
 */
router.put('/settings', requireManagerOrOwner, async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const tenantId = req.tenant!.id;
    const {
      brandColor,
      brandSecondaryColor,
      logoUrl,
      bannerUrl,
      bookingPolicy,
      depositRequired,
      depositAmount,
      slotIntervalMinutes,
      leadTimeHours,
      maxAdvanceDays,
      notice
    } = req.body;

    const updated = await prisma.tenantSettings.upsert({
      where: { tenantId },
      update: {
        brandColor: brandColor || undefined,
        brandSecondaryColor: brandSecondaryColor || undefined,
        logoUrl: logoUrl !== undefined ? logoUrl : undefined,
        bannerUrl: bannerUrl !== undefined ? bannerUrl : undefined,
        bookingPolicy: bookingPolicy !== undefined ? bookingPolicy : undefined,
        depositRequired: depositRequired !== undefined ? Boolean(depositRequired) : undefined,
        depositAmount: depositAmount !== undefined ? Number(depositAmount) : undefined,
        slotIntervalMinutes: slotIntervalMinutes ? Number(slotIntervalMinutes) : undefined,
        leadTimeHours: leadTimeHours !== undefined ? Number(leadTimeHours) : undefined,
        maxAdvanceDays: maxAdvanceDays !== undefined ? Number(maxAdvanceDays) : undefined,
        notice: notice !== undefined ? notice : undefined
      },
      create: {
        tenantId,
        brandColor: brandColor || '#D46B84',
        brandSecondaryColor: brandSecondaryColor || '#FFF0F5',
        logoUrl: logoUrl || null,
        bannerUrl: bannerUrl || null,
        bookingPolicy: bookingPolicy || null,
        depositRequired: Boolean(depositRequired),
        depositAmount: Number(depositAmount) || 0,
        slotIntervalMinutes: Number(slotIntervalMinutes) || 30,
        leadTimeHours: Number(leadTimeHours) || 1,
        maxAdvanceDays: Number(maxAdvanceDays) || 30,
        notice: notice || null
      }
    });

    return res.json({
      message: 'Cập nhật giao diện & cài đặt thương hiệu thành công!',
      settings: updated
    });
  } catch (error) {
    console.error('update settings error:', error);
    return res.status(500).json({ error: 'Lỗi cập nhật cài đặt.' });
  }
});

/**
 * GET & PUT /api/tenant/working-hours
 */
router.get('/working-hours', async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const tenantId = req.tenant!.id;
    const hours = await prisma.workingHours.findMany({
      where: { tenantId },
      orderBy: { dayOfWeek: 'asc' }
    });
    return res.json({ workingHours: hours });
  } catch (error) {
    return res.status(500).json({ error: 'Lỗi tải giờ mở cửa.' });
  }
});

router.put('/working-hours', requireManagerOrOwner, async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const tenantId = req.tenant!.id;
    const { workingHours } = req.body;

    if (!Array.isArray(workingHours)) {
      return res.status(400).json({ error: 'Dữ liệu workingHours không hợp lệ.' });
    }

    for (const h of workingHours) {
      await prisma.workingHours.upsert({
        where: {
          tenantId_dayOfWeek: {
            tenantId,
            dayOfWeek: h.dayOfWeek
          }
        },
        update: {
          isOpen: Boolean(h.isOpen),
          openTime: h.openTime || '09:00',
          closeTime: h.closeTime || '20:00',
          breakStart: h.breakStart || null,
          breakEnd: h.breakEnd || null
        },
        create: {
          tenantId,
          dayOfWeek: h.dayOfWeek,
          isOpen: Boolean(h.isOpen),
          openTime: h.openTime || '09:00',
          closeTime: h.closeTime || '20:00',
          breakStart: h.breakStart || null,
          breakEnd: h.breakEnd || null
        }
      });
    }

    const updated = await prisma.workingHours.findMany({
      where: { tenantId },
      orderBy: { dayOfWeek: 'asc' }
    });

    return res.json({
      message: 'Cập nhật giờ mở cửa thành công!',
      workingHours: updated
    });
  } catch (error) {
    console.error('update working hours error:', error);
    return res.status(500).json({ error: 'Lỗi cập nhật giờ mở cửa.' });
  }
});

/**
 * POST /api/tenant/publish-toggle
 * Toggle published state
 */
router.post('/publish-toggle', requireManagerOrOwner, async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const tenantId = req.tenant!.id;

    const currentTenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!currentTenant) {
      return res.status(404).json({ error: 'Tiệm không tồn tại.' });
    }

    const newStatus = !currentTenant.isPublished;

    // If publishing, ensure at least 1 service exists
    if (newStatus) {
      const sCount = await prisma.service.count({ where: { tenantId, isActive: true } });
      if (sCount === 0) {
        return res.status(400).json({ error: 'Tiệm cần có ít nhất 1 dịch vụ đang hoạt động trước khi xuất bản.' });
      }
    }

    const updated = await prisma.tenant.update({
      where: { id: tenantId },
      data: { isPublished: newStatus }
    });

    return res.json({
      message: newStatus ? 'Website đã được xuất bản trực tuyến!' : 'Đã tạm dừng nhận lịch qua website.',
      isPublished: updated.isPublished
    });
  } catch (error) {
    return res.status(500).json({ error: 'Lỗi cập nhật trạng thái xuất bản.' });
  }
});

export default router;
