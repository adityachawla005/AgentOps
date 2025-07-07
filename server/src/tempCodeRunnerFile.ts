
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import trackRouter from './routes/track';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use('/track', trackRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
