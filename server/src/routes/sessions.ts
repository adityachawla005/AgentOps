import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';

const sessionsRouter = Router();

sessionsRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("✅ /sessions endpoint hit");
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    
    const [sessions, total] = await Promise.all([
      prisma.session.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.session.count(),
    ]);
    
    res.status(200).json({
      page,
      limit,
      totalSessions: total,
      totalPages: Math.ceil(total / limit),
      data: sessions,
    });
  } catch (err) {
    console.error('Error fetching sessions:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

sessionsRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { session_id, page, events } = req.body;
    
    if (!session_id || !page || !Array.isArray(events)) {
      res.status(400).json({ error: 'Invalid payload' });
      return;
    }
    
    const newSession = await prisma.session.create({
      data: { session_id, page, events },
    });
    
    res.status(201).json(newSession);
  } catch (err) {
    console.error('Error saving session:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default sessionsRouter;