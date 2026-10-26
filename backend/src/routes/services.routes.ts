import { Router, Response } from 'express';
import { prisma } from '../db/prisma.js';
import { authenticate, requireTenant, requireManagerOrOwner, AuthenticatedRequest } from '../middleware/auth.js';
import { checkPlanLimit } from '../config/plans.js';

const router = Router();

router.use(authenticate, requireTenant);

/**
 * GET /api/services
 * Get all services for current tenant
 */
router.get('/', async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const tenantId = req.tenant!.id;
    const services = await prisma.service.findMany({
      where: { tenantId },
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }]
    });

    return res.json({ services });
  } catch (error) {
    return res.status(500).json({ error: 'Không thể tải danh sách dịch vụ.' });
  }
});

/**
 * POST /api/services
 * Create a new service
 */
router.post('/', requireManagerOrOwner, async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const tenantId = req.tenant!.id;
    const { name, category, durationMinutes, price, description, imageUrl } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Tên dịch vụ phải có ít nhất 2 ký tự.' });
    }

    // Check plan limits
    const currentCount = await prisma.service.count({ where: { tenantId } });
    const limitCheck = checkPlanLimit(req.tenant!.plan, 'services', currentCount);
    if (!limitCheck.allowed) {
      return res.status(403).json({ error: limitCheck.message });
    }

    const service = await prisma.service.create({
      data: {
        tenantId,
        name: name.trim(),
        category: category?.trim() || 'Móng cơ bản',
        durationMinutes: Number(durationMinutes) || 45,
        price: Number(price) || 0,
        description: description?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        isActive: true
      }
    });

    return res.status(201).json({
      message: 'Thêm dịch vụ thành công!',
      service
    });
  } catch (error) {
    console.error('create service error:', error);
    return res.status(500).json({ error: 'Lỗi thêm dịch vụ.' });
  }
});

/**
 * PUT /api/services/:id
 * Update a service (strictly scoped to this tenant)
 */
router.put('/:id', requireManagerOrOwner, async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const tenantId = req.tenant!.id;
    const { id } = req.params;
    const { name, category, durationMinutes, price, description, imageUrl, isActive } = req.body;

    const existing = await prisma.service.findFirst({
      where: { id, tenantId }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Không tìm thấy dịch vụ hoặc bạn không có quyền sửa.' });
    }

    const updated = await prisma.service.update({
      where: { id },
      data: {
        name: name !== undefined ? name.trim() : undefined,
        category: category !== undefined ? category.trim() : undefined,
        durationMinutes: durationMinutes !== undefined ? Number(durationMinutes) : undefined,
        price: price !== undefined ? Number(price) : undefined,
        description: description !== undefined ? description?.trim() || null : undefined,
        imageUrl: imageUrl !== undefined ? imageUrl?.trim() || null : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined
      }
    });

    return res.json({
      message: 'Cập nhật dịch vụ thành công!',
      service: updated
    });
  } catch (error) {
    return res.status(500).json({ error: 'Lỗi cập nhật dịch vụ.' });
  }
});

/**
 * DELETE /api/services/:id
 * Delete a service
 */
router.delete('/:id', requireManagerOrOwner, async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const tenantId = req.tenant!.id;
    const { id } = req.params;

    const existing = await prisma.service.findFirst({
      where: { id, tenantId }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Không tìm thấy dịch vụ hoặc bạn không có quyền xóa.' });
    }

    await prisma.service.delete({ where: { id } });

    return res.json({ message: 'Đã xóa dịch vụ thành công!' });
  } catch (error) {
    return res.status(500).json({ error: 'Lỗi xóa dịch vụ.' });
  }
});

export default router;
