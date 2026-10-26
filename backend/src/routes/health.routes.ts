import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'nailvibe-backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime())
  });
});

router.get('/db', async (req: Request, res: Response): Promise<any> => {
  try {
    const startTime = Date.now();
    // Execute a simple lightweight query to verify DB connectivity
    await prisma.$queryRaw`SELECT 1`;
    const latencyMs = Date.now() - startTime;

    return res.json({
      status: 'healthy',
      database: 'connected',
      latencyMs,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('health db error:', error);
    return res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: 'Không thể kết nối tới cơ sở dữ liệu'
    });
  }
});

export default router;
