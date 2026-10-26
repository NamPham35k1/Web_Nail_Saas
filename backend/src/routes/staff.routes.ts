import { Router, Response } from 'express';
import { prisma } from '../db/prisma.js';
import { authenticate, requireTenant, requireManagerOrOwner, AuthenticatedRequest } from '../middleware/auth.js';
import { checkPlanLimit } from '../config/plans.js';

const router = Router();

router.use(authenticate, requireTenant);

/**
 * GET /api/staff
 */
router.get('/', async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const tenantId = req.tenant!.id;
    const staff = await prisma.staff.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'asc' },
      include: {
        _count: {
          select: { appointments: true }
        }
      }
    });

    return res.json({ staff });
  } catch (error) {
    return res.status(500).json({ error: 'Không thể tải danh sách nhân viên.' });
  }
});

/**
 * POST /api/staff
 */
router.post('/', requireManagerOrOwner, async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const tenantId = req.tenant!.id;
    const { name, phone, email, role, avatarUrl } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Tên nhân viên phải có ít nhất 2 ký tự.' });
    }

    // Check plan limits
    const currentCount = await prisma.staff.count({ where: { tenantId } });
    const limitCheck = checkPlanLimit(req.tenant!.plan, 'staff', currentCount);
    if (!limitCheck.allowed) {
      return res.status(403).json({ error: limitCheck.message });
    }

    const staffMember = await prisma.staff.create({
      data: {
        tenantId,
        name: name.trim(),
        role: role?.trim() || 'Chuyên viên Nail',
        phone: phone?.trim() || null,
        email: email?.trim() || null,
        avatarUrl: avatarUrl?.trim() || null,
        isActive: true
      }
    });

    return res.status(201).json({
      message: 'Thêm nhân viên thành công!',
      staff: staffMember
    });
  } catch (error) {
    console.error('create staff error:', error);
    return res.status(500).json({ error: 'Lỗi thêm nhân viên.' });
  }
});

/**
 * PUT /api/staff/:id
 */
router.put('/:id', requireManagerOrOwner, async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const tenantId = req.tenant!.id;
    const { id } = req.params;
    const { name, phone, email, role, avatarUrl, isActive } = req.body;

    const existing = await prisma.staff.findFirst({
      where: { id, tenantId }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Không tìm thấy nhân viên.' });
    }

    const updated = await prisma.staff.update({
      where: { id },
      data: {
        name: name !== undefined ? name.trim() : undefined,
        role: role !== undefined ? role.trim() : undefined,
        phone: phone !== undefined ? phone?.trim() || null : undefined,
        email: email !== undefined ? email?.trim() || null : undefined,
        avatarUrl: avatarUrl !== undefined ? avatarUrl?.trim() || null : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined
      }
    });

    return res.json({
      message: 'Cập nhật nhân viên thành công!',
      staff: updated
    });
  } catch (error) {
    return res.status(500).json({ error: 'Lỗi cập nhật nhân viên.' });
  }
});

/**
 * DELETE /api/staff/:id
 */
router.delete('/:id', requireManagerOrOwner, async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const tenantId = req.tenant!.id;
    const { id } = req.params;

    const existing = await prisma.staff.findFirst({
      where: { id, tenantId }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Không tìm thấy nhân viên.' });
    }

    await prisma.staff.delete({ where: { id } });

    return res.json({ message: 'Đã xóa nhân viên thành công!' });
  } catch (error) {
    return res.status(500).json({ error: 'Lỗi xóa nhân viên.' });
  }
});

export default router;
