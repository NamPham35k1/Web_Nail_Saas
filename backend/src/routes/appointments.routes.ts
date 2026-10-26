import { Router, Response } from 'express';
import { prisma } from '../db/prisma.js';
import { authenticate, requireTenant, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

router.use(authenticate, requireTenant);

/**
 * GET /api/appointments
 * List appointments for current tenant with filters
 */
router.get('/', async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const tenantId = req.tenant!.id;
    const { status, date, startDate, endDate, staffId } = req.query;

    const where: any = { tenantId };

    if (status && typeof status === 'string' && status !== 'ALL') {
      where.status = status;
    }

    if (date && typeof date === 'string') {
      const start = new Date(`${date}T00:00:00`);
      const end = new Date(`${date}T23:59:59`);
      where.startTime = { gte: start, lte: end };
    } else if (startDate && endDate) {
      where.startTime = {
        gte: new Date(`${startDate}T00:00:00`),
        lte: new Date(`${endDate}T23:59:59`)
      };
    }

    if (staffId && typeof staffId === 'string' && staffId !== 'ALL') {
      where.staffId = staffId;
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        service: true,
        staff: true
      },
      orderBy: { startTime: 'asc' }
    });

    return res.json({ appointments });
  } catch (error) {
    console.error('get appointments error:', error);
    return res.status(500).json({ error: 'Không thể tải danh sách lịch hẹn.' });
  }
});

/**
 * POST /api/appointments
 * Create manual booking from dashboard (Walk-in / Phone call)
 */
router.post('/', async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const tenantId = req.tenant!.id;
    const { customerName, customerPhone, customerEmail, serviceId, staffId, startTime, notes, status } = req.body;

    if (!customerName || !customerPhone || !serviceId || !startTime) {
      return res.status(400).json({ error: 'Vui lòng điền đủ họ tên khách, SĐT, dịch vụ và thời gian.' });
    }

    const service = await prisma.service.findFirst({
      where: { id: serviceId, tenantId }
    });

    if (!service) {
      return res.status(400).json({ error: 'Dịch vụ không tồn tại trong tiệm này.' });
    }

    const start = new Date(startTime);
    const end = new Date(start.getTime() + service.durationMinutes * 60 * 1000);

    const appointmentCode = `NV-${Math.floor(1000 + Math.random() * 9000)}`;

    // Upsert customer record
    await prisma.customer.upsert({
      where: {
        tenantId_phone: { tenantId, phone: customerPhone }
      },
      update: {
        name: customerName,
        totalVisits: { increment: 1 },
        totalSpent: { increment: service.price }
      },
      create: {
        tenantId,
        name: customerName,
        phone: customerPhone,
        email: customerEmail || null,
        totalVisits: 1,
        totalSpent: service.price
      }
    });

    const appointment = await prisma.appointment.create({
      data: {
        tenantId,
        appointmentCode,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail?.trim() || null,
        serviceId: service.id,
        staffId: staffId || null,
        startTime: start,
        endTime: end,
        status: status || 'CONFIRMED',
        notes: notes?.trim() || null,
        totalPrice: service.price
      },
      include: {
        service: true,
        staff: true
      }
    });

    return res.status(201).json({
      message: 'Tạo lịch hẹn thành công!',
      appointment
    });
  } catch (error) {
    console.error('manual booking error:', error);
    return res.status(500).json({ error: 'Lỗi tạo lịch hẹn.' });
  }
});

/**
 * PATCH /api/appointments/:id/status
 * Update appointment status (PENDING, CONFIRMED, COMPLETED, CANCELLED)
 */
router.patch('/:id/status', async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const tenantId = req.tenant!.id;
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Trạng thái không hợp lệ.' });
    }

    // Verify appointment belongs to this tenant!
    const appointment = await prisma.appointment.findFirst({
      where: { id, tenantId }
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Không tìm thấy lịch hẹn hoặc bạn không có quyền cập nhật.' });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        service: true,
        staff: true
      }
    });

    return res.json({
      message: `Đã chuyển trạng thái sang ${status}!`,
      appointment: updated
    });
  } catch (error) {
    return res.status(500).json({ error: 'Lỗi cập nhật trạng thái lịch hẹn.' });
  }
});

/**
 * DELETE /api/appointments/:id
 */
router.delete('/:id', async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const tenantId = req.tenant!.id;
    const { id } = req.params;

    const appointment = await prisma.appointment.findFirst({
      where: { id, tenantId }
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Không tìm thấy lịch hẹn.' });
    }

    await prisma.appointment.delete({ where: { id } });

    return res.json({ message: 'Đã xóa lịch hẹn thành công.' });
  } catch (error) {
    return res.status(500).json({ error: 'Lỗi xóa lịch hẹn.' });
  }
});

export default router;
