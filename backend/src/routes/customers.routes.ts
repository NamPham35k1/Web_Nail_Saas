import { Router, Response } from 'express';
import { prisma } from '../db/prisma.js';
import { authenticate, requireTenant, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

router.use(authenticate, requireTenant);

/**
 * GET /api/customers
 */
router.get('/', async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const tenantId = req.tenant!.id;
    const { search } = req.query;

    const where: any = { tenantId };
    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } }
      ];
    }

    const customers = await prisma.customer.findMany({
      where,
      orderBy: { updatedAt: 'desc' }
    });

    return res.json({ customers });
  } catch (error) {
    return res.status(500).json({ error: 'Không thể tải danh sách khách hàng.' });
  }
});

export default router;
