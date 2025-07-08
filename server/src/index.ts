import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import trackRouter from './routes/track';
import sessionsRouter from './routes/sessions';
import variantRouter from './routes/variant';
import optimizeRouter from './routes/optimize';
import crawlRouter from './routes/crawl';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500','http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

app.get('/ping', (_req: Request, res: Response) => {
  res.send('pong');
});

app.use('/track', trackRouter);
app.use('/sessions', sessionsRouter);
app.use('/variant', variantRouter);
app.use('/optimize', optimizeRouter);
app.use('/crawl', crawlRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});