import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../db/prisma.js';

const router = Router();

const bookingSchema = z.object({
  customerName: z.string().min(2, 'Vui lòng nhập họ tên của bạn.'),
  customerPhone: z.string().min(8, 'Vui lòng nhập số điện thoại hợp lệ.'),
  customerEmail: z.string().email().optional().or(z.literal('')),
  serviceId: z.string().min(1, 'Vui lòng chọn dịch vụ.'),
  staffId: z.string().optional().nullable(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Định dạng ngày phải là YYYY-MM-DD.'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Định dạng giờ phải là HH:mm.'),
  notes: z.string().optional()
});

/**
 * GET /api/public/salon/:slug
 * Retrieve public salon profile for customer booking page
 */
router.get('/salon/:slug', async (req: Request, res: Response): Promise<any> => {
  try {
    const { slug } = req.params;

    const tenant = await prisma.tenant.findUnique({
      where: { slug },
      include: {
        settings: true,
        workingHours: {
          orderBy: { dayOfWeek: 'asc' }
        },
        services: {
          where: { isActive: true },
          orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }, { name: 'asc' }]
        },
        staff: {
          where: { isActive: true },
          orderBy: { name: 'asc' }
        }
      }
    });

    if (!tenant) {
      return res.status(404).json({ error: 'Không tìm thấy tiệm nail với địa chỉ này.' });
    }

    // Return sanitized public info
    return res.json({
      salon: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        phone: tenant.phone,
        email: tenant.email,
        address: tenant.address,
        description: tenant.description,
        isPublished: tenant.isPublished,
        settings: tenant.settings || {
          brandColor: '#D46B84',
          brandSecondaryColor: '#FFF0F5',
          bookingPolicy: 'Vui lòng đến trước 10 phút để được phục vụ tốt nhất.'
        },
        workingHours: tenant.workingHours,
        services: tenant.services,
        staff: tenant.staff
      }
    });
  } catch (error) {
    console.error('get public salon error:', error);
    return res.status(500).json({ error: 'Lỗi tải thông tin tiệm nail.' });
  }
});

/**
 * GET /api/public/salon/:slug/slots
 * Calculate free time slots for booking
 */
router.get('/salon/:slug/slots', async (req: Request, res: Response): Promise<any> => {
  try {
    const { slug } = req.params;
    const { date, serviceId, staffId } = req.query;

    if (!date || typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'Tham số date không hợp lệ (YYYY-MM-DD).' });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { slug },
      include: {
        settings: true,
        workingHours: true
      }
    });

    if (!tenant) {
      return res.status(404).json({ error: 'Không tìm thấy tiệm nail.' });
    }

    // Parse date and day of week
    const targetDate = new Date(`${date}T00:00:00`);
    const dayOfWeek = targetDate.getDay(); // 0 is Sunday, 1 is Monday...

    const daySchedule = tenant.workingHours.find((h) => h.dayOfWeek === dayOfWeek);
    if (!daySchedule || !daySchedule.isOpen) {
      return res.json({
        available: false,
        message: 'Tiệm đóng cửa vào ngày này. Vui lòng chọn ngày khác.',
        slots: []
      });
    }

    // Get service duration
    let durationMinutes = 45;
    if (serviceId && typeof serviceId === 'string') {
      const service = await prisma.service.findUnique({ where: { id: serviceId } });
      if (service) {
        durationMinutes = service.durationMinutes;
      }
    }

    const slotInterval = tenant.settings?.slotIntervalMinutes || 30;

    // Get all appointments for this tenant on that date
    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59`);

    const appointmentWhere: any = {
      tenantId: tenant.id,
      status: { notIn: ['CANCELLED'] },
      startTime: { gte: startOfDay, lte: endOfDay }
    };

    if (staffId && typeof staffId === 'string' && staffId !== 'any') {
      appointmentWhere.staffId = staffId;
    }

    const existingAppointments = await prisma.appointment.findMany({
      where: appointmentWhere,
      select: { startTime: true, endTime: true, staffId: true }
    });

    // Generate slots from openTime to closeTime
    const [openH, openM] = daySchedule.openTime.split(':').map(Number);
    const [closeH, closeM] = daySchedule.closeTime.split(':').map(Number);

    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    const slots: { time: string; available: boolean; reason?: string }[] = [];
    const now = new Date();

    for (let m = openMinutes; m + durationMinutes <= closeMinutes; m += slotInterval) {
      const slotHour = Math.floor(m / 60);
      const slotMinute = m % 60;
      const timeStr = `${slotHour.toString().padStart(2, '0')}:${slotMinute.toString().padStart(2, '0')}`;

      const slotStart = new Date(`${date}T${timeStr}:00`);
      const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60 * 1000);

      // Check if slot is in the past
      if (slotStart <= now) {
        slots.push({ time: timeStr, available: false, reason: 'Đã qua giờ' });
        continue;
      }

      // Check overlap with existing appointments
      const hasConflict = existingAppointments.some((appt) => {
        return slotStart < appt.endTime && slotEnd > appt.startTime;
      });

      slots.push({
        time: timeStr,
        available: !hasConflict
      });
    }

    return res.json({
      available: true,
      date,
      dayOfWeek,
      openTime: daySchedule.openTime,
      closeTime: daySchedule.closeTime,
      slots
    });
  } catch (error) {
    console.error('get slots error:', error);
    return res.status(500).json({ error: 'Lỗi kiểm tra lịch trống.' });
  }
});

/**
 * POST /api/public/salon/:slug/book
 * Customer submits appointment request
 */
router.post('/salon/:slug/book', async (req: Request, res: Response): Promise<any> => {
  try {
    const { slug } = req.params;

    const tenant = await prisma.tenant.findUnique({
      where: { slug },
      include: { settings: true }
    });

    if (!tenant) {
      return res.status(404).json({ error: 'Không tìm thấy tiệm nail.' });
    }

    if (!tenant.isPublished) {
      return res.status(400).json({ error: 'Website của tiệm hiện đang tạm dừng nhận lịch trực tuyến.' });
    }

    const parseResult = bookingSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors[0].message });
    }

    const { customerName, customerPhone, customerEmail, serviceId, staffId, date, time, notes } = parseResult.data;

    // Verify service belongs to this tenant!
    const service = await prisma.service.findFirst({
      where: { id: serviceId, tenantId: tenant.id, isActive: true }
    });

    if (!service) {
      return res.status(400).json({ error: 'Dịch vụ không tồn tại hoặc đã ngừng cung cấp.' });
    }

    // Verify staff if specified
    let verifiedStaffId: string | null = null;
    let staffName = 'Chuyên viên bất kỳ';
    if (staffId && staffId !== 'any') {
      const staffMember = await prisma.staff.findFirst({
        where: { id: staffId, tenantId: tenant.id, isActive: true }
      });
      if (staffMember) {
        verifiedStaffId = staffMember.id;
        staffName = staffMember.name;
      }
    }

    // Calculate start & end time
    const startTime = new Date(`${date}T${time}:00`);
    const endTime = new Date(startTime.getTime() + service.durationMinutes * 60 * 1000);

    // Double-check no conflicting appointment
    const conflict = await prisma.appointment.findFirst({
      where: {
        tenantId: tenant.id,
        status: { notIn: ['CANCELLED'] },
        ...(verifiedStaffId ? { staffId: verifiedStaffId } : {}),
        startTime: { lt: endTime },
        endTime: { gt: startTime }
      }
    });

    if (conflict) {
      return res.status(409).json({ error: 'Khung giờ này vừa có khách đặt trước. Vui lòng chọn khung giờ khác.' });
    }

    // Generate appointment code: NV- + 4 random digits
    const appointmentCode = `NV-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create or update customer record for this tenant
    await prisma.customer.upsert({
      where: {
        tenantId_phone: {
          tenantId: tenant.id,
          phone: customerPhone
        }
      },
      update: {
        name: customerName,
        email: customerEmail || undefined,
        totalVisits: { increment: 1 },
        totalSpent: { increment: service.price }
      },
      create: {
        tenantId: tenant.id,
        name: customerName,
        phone: customerPhone,
        email: customerEmail || null,
        totalVisits: 1,
        totalSpent: service.price
      }
    });

    // Create Appointment
    const appointment = await prisma.appointment.create({
      data: {
        tenantId: tenant.id,
        appointmentCode,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        serviceId: service.id,
        staffId: verifiedStaffId,
        startTime,
        endTime,
        status: 'PENDING',
        notes: notes || null,
        totalPrice: service.price
      },
      include: {
        service: true,
        staff: true
      }
    });

    return res.status(201).json({
      message: 'Đặt lịch thành công! Tiệm sẽ liên hệ sớm để xác nhận với bạn.',
      appointment: {
        code: appointment.appointmentCode,
        customerName: appointment.customerName,
        customerPhone: appointment.customerPhone,
        serviceName: service.name,
        staffName,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        totalPrice: appointment.totalPrice,
        status: appointment.status,
        salonName: tenant.name,
        salonPhone: tenant.phone,
        salonAddress: tenant.address
      }
    });
  } catch (error) {
    console.error('book appointment error:', error);
    return res.status(500).json({ error: 'Lỗi tạo lịch hẹn. Vui lòng thử lại.' });
  }
});

export default router;
