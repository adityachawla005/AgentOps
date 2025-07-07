import express, { Request, Response } from 'express';
import { optimizeElement } from '../ai/optimize';

const router = express.Router();

console.log(' Optimize router initialized');

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(' Optimize route hit with:', req.body);

    const { element, goal } = req.body;

    if (!element || !goal) {
      console.warn('Missing element or goal');
      res.status(400).json({ error: 'Element and goal are required' });
      return;
    }

    const result = await optimizeElement(element, goal);
    console.log('Optimization result:', result);

    res.json({ optimized: result });
  } catch (err) {
    console.error('Optimization error:', err);
    res.status(500).json({ error: 'Server error', details: err instanceof Error ? err.message : err });
  }
});

export default router;
