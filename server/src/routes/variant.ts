import express, { Request, Response } from 'express';
import { prisma } from '../prisma';

const router = express.Router();

router.get('/:elementId/metrics', async (req: Request, res: Response) => {
  try {
    const { elementId } = req.params;

    const variants = await prisma.variant.findMany({
      where: { elementId },
      select: { clicks: true, impressions: true },
    });

    if (!variants.length) {
      res.status(404).json({ error: 'No variants found for this element' });
      return;
    }

    const totalClicks = variants.reduce((sum, v) => sum + (v.clicks || 0), 0);
    const totalImpressions = variants.reduce((sum, v) => sum + (v.impressions || 0), 0);
    const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) + '%' : '0%';

    res.json({
      elementId,
      totalClicks,
      totalImpressions,
      ctr,
    });
  } catch (err) {
    console.error('Error fetching aggregated metrics:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:elementId', async (req: Request, res: Response) => {
  try {
    const { elementId } = req.params;

    const variants = await prisma.variant.findMany({
      where: { elementId },
    });

    if (!variants.length) {
      res.status(404).json({ error: 'No variants found for this element' });
      return;
    }

    const randomIndex = Math.floor(Math.random() * variants.length);
    const chosenVariant = variants[randomIndex];

    res.json(chosenVariant);
  } catch (err) {
    console.error('Error fetching variant:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, elementId, version } = req.body;

    if (!name || !elementId || typeof version !== 'number') {
      res.status(400).json({ error: 'Missing or invalid fields' });
      return;
    }

    const newVariant = await prisma.variant.create({
      data: { name, elementId, version },
    });

    res.status(201).json(newVariant);
  } catch (err) {
    console.error('Error creating variant:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, elementId, version } = req.body;

    const updated = await prisma.variant.update({
      where: { id: parseInt(id) },
      data: { name, elementId, version },
    });

    res.json(updated);
  } catch (err) {
    console.error('Error updating variant:', err);
    res.status(500).json({ error: 'Failed to update variant' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.variant.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (err) {
    console.error('Error deleting variant:', err);
    res.status(500).json({ error: 'Failed to delete variant' });
  }
});

router.post('/:id/impression', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.variant.update({
      where: { id: parseInt(id) },
      data: { impressions: { increment: 1 } },
    });

    res.status(204).send();
  } catch (err) {
    console.error('Error updating impressions:', err);
    res.status(500).json({ error: 'Failed to update impressions' });
  }
});

router.post('/:id/click', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.variant.update({
      where: { id: parseInt(id) },
      data: { clicks: { increment: 1 } },
    });

    res.status(204).send();
  } catch (err) {
    console.error('Error updating clicks:', err);
    res.status(500).json({ error: 'Failed to update clicks' });
  }
});

export default router;
