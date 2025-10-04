import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import apiRouter from '@/routers/api';
import authRouter from '@/routers/auth';
import { loggerMiddleware } from './logger';

const PORT = process.env.SERVER_PORT || 8080;

const app = express();

app.use(cors({ origin: process.env.WEB_PUBLIC_URL }));
app.use(express.json());
app.use(cookieParser());
app.use(loggerMiddleware);

app.use('/auth', authRouter);
app.use('/api', apiRouter);

app.listen(PORT, (error) => {
  if (error) {
    return console.error('Failed to start server:', error);
  }

  console.log(`Listening on port ${PORT}...`);
});
