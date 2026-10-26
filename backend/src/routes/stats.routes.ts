import { Router, Response } from 'express';
import { prisma } from '../db/prisma.js';
import { authenticate, requireTenant, AuthenticatedRequest } from '../middleware/auth.js';
import { SUBSCRIPTION_PLANS } from '../config/plans.js';

const router = Router();

router.use(authenticate, requireTenant);

/**
 * GET /api/stats/dashboard
 * Return summary metrics, next appointment, and salon setup checklist
 */
router.get('/dashboard', async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const tenantId = req.tenant!.id;

    // Date boundaries for today
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    // Queries scoped strictly to current tenant
    const [
      todayCount,
      pendingCount,
      confirmedCount,
      completedCount,
      nextAppointment,
      todayAppointments,
      serviceCount,
      workingHoursCount,
      staffCount,
      tenant
    ] = await Promise.all([
      prisma.appointment.count({
        where: {
          tenantId,
          startTime: { gte: todayStart, lte: todayEnd },
          status: { notIn: ['CANCELLED'] }
        }
      }),
      prisma.appointment.count({
        where: { tenantId, status: 'PENDING' }
      }),
      prisma.appointment.count({
        where: { tenantId, status: 'CONFIRMED' }
      }),
      prisma.appointment.count({
        where: { tenantId, status: 'COMPLETED' }
      }),
      prisma.appointment.findFirst({
        where: {
          tenantId,
          startTime: { gte: now },
          status: { in: ['CONFIRMED', 'PENDING'] }
        },
        include: {
          service: true,
          staff: true
        },
        orderBy: { startTime: 'asc' }
      }),
      prisma.appointment.findMany({
        where: {
          tenantId,
          startTime: { gte: todayStart, lte: todayEnd }
        },
        include: {
          service: true,
          staff: true
        },
        orderBy: { startTime: 'asc' }
      }),
      prisma.service.count({ where: { tenantId, isActive: true } }),
      prisma.workingHours.count({ where: { tenantId } }),
      prisma.staff.count({ where: { tenantId, isActive: true } }),
      prisma.tenant.findUnique({
        where: { id: tenantId },
        include: { settings: true }
      })
    ]);

    // Checklist: "Hoàn thiện tiệm của bạn"
    const hasServices = serviceCount > 0;
    const hasWorkingHours = workingHoursCount > 0;
    const hasStaff = staffCount > 0; // Optional but tracked
    const hasCheckedSchedule = true; // Default ready
    const isPublished = Boolean(tenant?.isPublished);

    // Core steps count: services, hours, published (+1 bonus if staff added)
    let completedSteps = 0;
    const totalSteps = 4;
    if (hasServices) completedSteps++;
    if (hasWorkingHours) completedSteps++;
    if (isPublished) completedSteps++;
    if (hasCheckedSchedule) completedSteps++;

    const checklistPercent = Math.round((completedSteps / totalSteps) * 100);

    // Subscription & Trial details
    const plan = SUBSCRIPTION_PLANS[tenant?.plan || 'TRIAL'] || SUBSCRIPTION_PLANS.TRIAL;
    let trialRemainingDays = null;
    if (tenant?.trialEndsAt) {
      const diffMs = new Date(tenant.trialEndsAt).getTime() - Date.now();
      trialRemainingDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    }

    return res.json({
      metrics: {
        todayAppointmentsCount: todayCount,
        pendingAppointmentsCount: pendingCount,
        confirmedAppointmentsCount: confirmedCount,
        completedAppointmentsCount: completedCount
      },
      nextAppointment,
      todayAppointments,
      checklist: {
        hasServices,
        hasWorkingHours,
        hasStaff,
        hasCheckedSchedule,
        isPublished,
        percent: checklistPercent,
        items: [
          { key: 'services', label: 'Đã thêm dịch vụ & bảng giá', completed: hasServices, required: true },
          { key: 'hours', label: 'Đã thiết lập giờ mở cửa', completed: hasWorkingHours, required: true },
          { key: 'staff', label: 'Đã thêm nhân viên làm móng', completed: hasStaff, required: false, note: 'Tùy chọn nếu làm 1 mình' },
          { key: 'schedule', label: 'Đã kiểm tra lịch trống', completed: hasCheckedSchedule, required: true },
          { key: 'publish', label: 'Đã xuất bản website đặt lịch', completed: isPublished, required: true }
        ]
      },
      salon: {
        id: tenant?.id,
        name: tenant?.name,
        slug: tenant?.slug,
        isPublished: tenant?.isPublished,
        publicUrl: `/s/${tenant?.slug}`,
        brandColor: tenant?.settings?.brandColor || '#D46B84'
      },
      subscription: {
        plan: tenant?.plan,
        planName: plan.name,
        trialRemainingDays,
        status: tenant?.subscriptionStatus
      }
    });
  } catch (error) {
    console.error('dashboard stats error:', error);
    return res.status(500).json({ error: 'Không thể tải thống kê bảng điều khiển.' });
  }
});

export default router;
