import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import fs from 'node:fs';
import path from 'node:path';

import apiRouter from '@/routers/api';
import authRouter from '@/routers/auth';

const PORT = process.env.SERVER_PORT || 8080;
const MORGAN_PATH = path.resolve(
  process.cwd(),
  process.env.SERVER_MORGAN_STREAM_PATH,
);

const app = express();

const morganStream =
  process.env.NODE_ENV == 'production'
    ? fs.createWriteStream(MORGAN_PATH, 'utf8')
    : process.stdout;

app.use(
  cors({
    origin(requestOrigin, callback) {
      const isWeb = requestOrigin === process.env.WEB_PUBLIC_URL;
      if (isWeb || !requestOrigin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan('common', { stream: morganStream }));

app.use('/auth', authRouter);
app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
