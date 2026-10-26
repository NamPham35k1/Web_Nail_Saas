import { Router, Response } from 'express';
import { prisma } from '../db/prisma.js';
import { authenticate, requireTenant, AuthenticatedRequest } from '../middleware/auth.js';
import { isValidSlug } from '../utils/slug.js';

const router = Router();

// Apply auth + tenant isolation to all onboarding routes
router.use(authenticate, requireTenant);

// Standard Vietnamese Nail Salon Sample Template
const SAMPLE_PRESET = {
  themeColor: '#D46B84',
  secondaryColor: '#FFF0F5',
  bookingPolicy: 'Quý khách vui lòng đến trước 10 phút. Nếu hủy hoặc đổi lịch, xin báo trước 2 giờ.',
  services: [
    { name: 'Sơn Gel Hàn Quốc Cao Cấp', category: 'Sơn Gel', durationMinutes: 45, price: 160000, description: 'Sơn gel bền đẹp 3-4 tuần, bảng màu xu hướng.' },
    { name: 'Đắp Gel Nối Móng Tự Nhiên', category: 'Đắp Móng', durationMinutes: 75, price: 300000, description: 'Nối móng chuẩn form thanh lịch, không đau rát.' },
    { name: 'Móng Úp Thiết Kế Theo Mẫu', category: 'Móng Úp', durationMinutes: 60, price: 240000, description: 'Đính charm, đá sáng và kim tuyến lấp lánh.' },
    { name: 'Nail Art Vẽ Nghệ Thuật (1 bộ)', category: 'Nail Art', durationMinutes: 40, price: 120000, description: 'Họa tiết vẽ tay tinh tế từng ngón.' },
    { name: 'Cắt Da & Spa Dưỡng Móng OPI', category: 'Chăm Sóc Móng', durationMinutes: 30, price: 80000, description: 'Ngâm nước ấm muối khoáng và thoa serum dưỡng.' }
  ],
  workingHours: [
    { dayOfWeek: 0, isOpen: true, openTime: '09:00', closeTime: '19:00' }, // Sun
    { dayOfWeek: 1, isOpen: true, openTime: '09:00', closeTime: '20:30' }, // Mon
    { dayOfWeek: 2, isOpen: true, openTime: '09:00', closeTime: '20:30' }, // Tue
    { dayOfWeek: 3, isOpen: true, openTime: '09:00', closeTime: '20:30' }, // Wed
    { dayOfWeek: 4, isOpen: true, openTime: '09:00', closeTime: '20:30' }, // Thu
    { dayOfWeek: 5, isOpen: true, openTime: '09:00', closeTime: '20:30' }, // Fri
    { dayOfWeek: 6, isOpen: true, openTime: '09:00', closeTime: '20:30' }  // Sat
  ]
};

/**
 * GET /api/onboarding/draft
 * Fetch the current onboarding progress and all draft/tenant state
 */
router.get('/draft', async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const tenantId = req.tenant!.id;

    const [draft, tenant, settings, workingHours, services, staff] = await Promise.all([
      prisma.onboardingDraft.findUnique({ where: { tenantId } }),
      prisma.tenant.findUnique({ where: { id: tenantId } }),
      prisma.tenantSettings.findUnique({ where: { tenantId } }),
      prisma.workingHours.findMany({ where: { tenantId }, orderBy: { dayOfWeek: 'asc' } }),
      prisma.service.findMany({ where: { tenantId }, orderBy: { createdAt: 'asc' } }),
      prisma.staff.findMany({ where: { tenantId }, orderBy: { createdAt: 'asc' } })
    ]);

    let parsedDraftData = {};
    if (draft?.draftData) {
      try {
        parsedDraftData = JSON.parse(draft.draftData);
      } catch (e) {
        parsedDraftData = {};
      }
    }

    return res.json({
      currentStep: draft?.currentStep || 1,
      isCompleted: draft?.isCompleted || false,
      draftData: parsedDraftData,
      tenant,
      settings,
      workingHours,
      services,
      staff
    });
  } catch (error) {
    console.error('get draft error:', error);
    return res.status(500).json({ error: 'Không thể tải thông tin onboarding.' });
  }
});

/**
 * POST /api/onboarding/step
 * Autosave step data and update relevant database tables
 */
router.post('/step', async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const tenantId = req.tenant!.id;
    const { step, data } = req.body;

    if (!step || typeof step !== 'number' || step < 1 || step > 7) {
      return res.status(400).json({ error: 'Bước không hợp lệ (1-7).' });
    }

    // Load existing draft
    let draft = await prisma.onboardingDraft.findUnique({ where: { tenantId } });
    let draftDataObj: Record<string, any> = {};
    if (draft?.draftData) {
      try {
        draftDataObj = JSON.parse(draft.draftData);
      } catch (e) {
        draftDataObj = {};
      }
    }

    // Merge new step data into draft
    draftDataObj[`step${step}`] = data;

    // Apply specific DB updates per step
    if (step === 1 && data) {
      // Step 1: Info (name, slug, phone, address, description)
      const { name, slug, phone, address, description } = data;
      const updatePayload: Record<string, any> = {};
      if (name) updatePayload.name = name;
      if (phone !== undefined) updatePayload.phone = phone;
      if (address !== undefined) updatePayload.address = address;
      if (description !== undefined) updatePayload.description = description;

      if (slug && slug !== req.tenant!.slug) {
        const check = isValidSlug(slug);
        if (!check.valid) {
          return res.status(400).json({ error: check.message });
        }
        const existingWithSlug = await prisma.tenant.findUnique({ where: { slug } });
        if (existingWithSlug && existingWithSlug.id !== tenantId) {
          return res.status(400).json({ error: `Slug '${slug}' đã có tiệm khác sử dụng. Vui lòng chọn slug khác.` });
        }
        updatePayload.slug = slug;
      }

      await prisma.tenant.update({
        where: { id: tenantId },
        data: updatePayload
      });
    }

    if (step === 2 && data) {
      // Step 2: Branding (brandColor, logoUrl, bannerUrl, bookingPolicy)
      const { brandColor, logoUrl, bannerUrl, bookingPolicy } = data;
      await prisma.tenantSettings.upsert({
        where: { tenantId },
        update: {
          brandColor: brandColor || '#D46B84',
          logoUrl: logoUrl || null,
          bannerUrl: bannerUrl || null,
          bookingPolicy: bookingPolicy || null
        },
        create: {
          tenantId,
          brandColor: brandColor || '#D46B84',
          logoUrl: logoUrl || null,
          bannerUrl: bannerUrl || null,
          bookingPolicy: bookingPolicy || null
        }
      });
    }

    if (step === 3 && data && Array.isArray(data.workingHours)) {
      // Step 3: Working hours
      for (const item of data.workingHours) {
        await prisma.workingHours.upsert({
          where: {
            tenantId_dayOfWeek: {
              tenantId,
              dayOfWeek: item.dayOfWeek
            }
          },
          update: {
            isOpen: item.isOpen,
            openTime: item.openTime || '09:00',
            closeTime: item.closeTime || '20:00'
          },
          create: {
            tenantId,
            dayOfWeek: item.dayOfWeek,
            isOpen: item.isOpen,
            openTime: item.openTime || '09:00',
            closeTime: item.closeTime || '20:00'
          }
        });
      }
    }

    if (step === 4 && data && Array.isArray(data.services)) {
      // Step 4: Services
      // Replace or update services
      await prisma.service.deleteMany({ where: { tenantId } });
      for (const s of data.services) {
        if (s.name && s.price !== undefined) {
          await prisma.service.create({
            data: {
              tenantId,
              name: s.name,
              category: s.category || 'Dịch vụ chính',
              durationMinutes: Number(s.durationMinutes) || 45,
              price: Number(s.price) || 0,
              description: s.description || null
            }
          });
        }
      }
    }

    if (step === 5 && data && Array.isArray(data.staff)) {
      // Step 5: Staff (Optional)
      await prisma.staff.deleteMany({ where: { tenantId } });
      for (const st of data.staff) {
        if (st.name) {
          await prisma.staff.create({
            data: {
              tenantId,
              name: st.name,
              role: st.role || 'Chuyên viên Nail',
              phone: st.phone || null
            }
          });
        }
      }
    }

    // Save draft record
    const updatedDraft = await prisma.onboardingDraft.upsert({
      where: { tenantId },
      update: {
        currentStep: Math.max(draft?.currentStep || 1, step),
        draftData: JSON.stringify(draftDataObj)
      },
      create: {
        tenantId,
        currentStep: step,
        draftData: JSON.stringify(draftDataObj)
      }
    });

    return res.json({
      message: `Đã tự động lưu bước ${step}!`,
      currentStep: updatedDraft.currentStep,
      draftData: draftDataObj
    });
  } catch (error) {
    console.error('save step error:', error);
    return res.status(500).json({ error: 'Không thể lưu tiến trình bước này.' });
  }
});

/**
 * POST /api/onboarding/apply-sample
 * 1-click apply sample preset data for fast 5-minute setup
 */
router.post('/apply-sample', async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const tenantId = req.tenant!.id;

    // Apply sample branding
    await prisma.tenantSettings.upsert({
      where: { tenantId },
      update: {
        brandColor: SAMPLE_PRESET.themeColor,
        brandSecondaryColor: SAMPLE_PRESET.secondaryColor,
        bookingPolicy: SAMPLE_PRESET.bookingPolicy
      },
      create: {
        tenantId,
        brandColor: SAMPLE_PRESET.themeColor,
        brandSecondaryColor: SAMPLE_PRESET.secondaryColor,
        bookingPolicy: SAMPLE_PRESET.bookingPolicy
      }
    });

    // Apply sample working hours
    for (const h of SAMPLE_PRESET.workingHours) {
      await prisma.workingHours.upsert({
        where: {
          tenantId_dayOfWeek: { tenantId, dayOfWeek: h.dayOfWeek }
        },
        update: {
          isOpen: h.isOpen,
          openTime: h.openTime,
          closeTime: h.closeTime
        },
        create: {
          tenantId,
          dayOfWeek: h.dayOfWeek,
          isOpen: h.isOpen,
          openTime: h.openTime,
          closeTime: h.closeTime
        }
      });
    }

    // Apply sample services (keep existing or replace)
    await prisma.service.deleteMany({ where: { tenantId } });
    for (const s of SAMPLE_PRESET.services) {
      await prisma.service.create({
        data: {
          tenantId,
          name: s.name,
          category: s.category,
          durationMinutes: s.durationMinutes,
          price: s.price,
          description: s.description
        }
      });
    }

    return res.json({
      message: 'Đã áp dụng mẫu dữ liệu tiệm nail chuẩn thành công!',
      preset: SAMPLE_PRESET
    });
  } catch (error) {
    console.error('apply sample error:', error);
    return res.status(500).json({ error: 'Lỗi áp dụng dữ liệu mẫu.' });
  }
});

/**
 * POST /api/onboarding/publish
 * Publish the booking website
 */
router.post('/publish', async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const tenantId = req.tenant!.id;

    // Verify minimum required setup: at least 1 service
    const serviceCount = await prisma.service.count({ where: { tenantId, isActive: true } });
    if (serviceCount === 0) {
      return res.status(400).json({ error: 'Vui lòng thêm ít nhất 1 dịch vụ trước khi xuất bản website.' });
    }

    const tenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: { isPublished: true }
    });

    await prisma.onboardingDraft.upsert({
      where: { tenantId },
      update: { isCompleted: true, currentStep: 7 },
      create: { tenantId, isCompleted: true, currentStep: 7 }
    });

    const publicUrl = `/s/${tenant.slug}`;

    return res.json({
      message: 'Chúc mừng! Website đặt lịch của tiệm đã được xuất bản thành công.',
      isPublished: true,
      slug: tenant.slug,
      publicUrl
    });
  } catch (error) {
    console.error('publish error:', error);
    return res.status(500).json({ error: 'Không thể xuất bản website.' });
  }
});

export default router;
