// src/routes/elements.ts
import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';

const router = Router();

router.get('/low-ctr', async (_req: Request, res: Response) => {
  try {
    const variants = await prisma.variant.findMany();

    const grouped: Record<string, { clicks: number; impressions: number }> = {};
    for (const v of variants) {
      if (!grouped[v.elementId]) grouped[v.elementId] = { clicks: 0, impressions: 0 };
      grouped[v.elementId].clicks += v.clicks || 0;
      grouped[v.elementId].impressions += v.impressions || 0;
    }

    const lowCtrElements = Object.entries(grouped)
      .map(([elementId, data]) => {
        const ctr = data.impressions > 0 ? (data.clicks / data.impressions) * 100 : 0;
        return { elementId, ctr };
      })
      .filter(({ ctr }) => ctr < 10); // you can tune this threshold

    res.json(lowCtrElements);
  } catch (err) {
    console.error('Error fetching low-CTR elements:', err);
    res.status(500).json({ error: 'Failed to fetch elements' });
  }
});

export default router;
