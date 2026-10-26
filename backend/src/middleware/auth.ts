import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../db/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'nailvibe_dev_secret_key_123456789';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
}

export interface TenantContext {
  id: string;
  name: string;
  slug: string;
  plan: string;
  subscriptionStatus: string;
  isPublished: boolean;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
  tenant?: TenantContext;
  tenantRole?: string;
}

/**
 * Verifies JWT token and attaches user
 */
export async function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Vui lòng đăng nhập để tiếp tục.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; tenantId?: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, fullName: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Tài khoản không tồn tại hoặc đã bị xóa.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.' });
  }
}

/**
 * Strict Multi-Tenant Isolation Middleware:
 * Resolves active tenant from header `x-tenant-id` or query/body, and VERIFIES that
 * the authenticated user is an authorized member of that tenant in the database.
 * NEVER trusts client-sent tenant ID without DB membership verification!
 */
export async function requireTenant(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Chưa xác thực người dùng.' });
    }

    // Determine target tenant ID from header or query param
    const requestedTenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string);

    let membership;

    if (requestedTenantId) {
      // User explicitly requested this tenant: verify user is actually a member of this tenant!
      membership = await prisma.tenantMembership.findUnique({
        where: {
          userId_tenantId: {
            userId: req.user.id,
            tenantId: requestedTenantId
          }
        },
        include: {
          tenant: true
        }
      });
    } else {
      // Fallback: pick the first tenant the user belongs to (usually the primary salon)
      membership = await prisma.tenantMembership.findFirst({
        where: { userId: req.user.id },
        include: { tenant: true },
        orderBy: { createdAt: 'asc' }
      });
    }

    if (!membership || !membership.tenant) {
      return res.status(403).json({
        error: 'Bạn không có quyền truy cập tiệm nail này hoặc tiệm không tồn tại.'
      });
    }

    req.tenant = {
      id: membership.tenant.id,
      name: membership.tenant.name,
      slug: membership.tenant.slug,
      plan: membership.tenant.plan,
      subscriptionStatus: membership.tenant.subscriptionStatus,
      isPublished: membership.tenant.isPublished
    };
    req.tenantRole = membership.role;

    next();
  } catch (error) {
    console.error('requireTenant error:', error);
    return res.status(500).json({ error: 'Lỗi kiểm tra quyền truy cập tiệm.' });
  }
}

/**
 * Requires OWNER or MANAGER role
 */
export function requireManagerOrOwner(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.tenantRole || !['OWNER', 'MANAGER'].includes(req.tenantRole)) {
    return res.status(403).json({ error: 'Bạn cần quyền Quản lý hoặc Chủ tiệm để thực hiện thao tác này.' });
  }
  next();
}
