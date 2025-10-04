import { Router } from 'express';
import jwt from 'jsonwebtoken';

import { JITSI_JWT_EXPIRES_IN, JWT_NAME } from '@/constants';
import { logger } from '@/logger';
import type { IJwtPayload } from '@/types/IJwtPayload';
import { InternalServerErrorHttpError, UnauthorizedHttpError } from '@/utils';

const apiUsersRouter = Router();

apiUsersRouter.get('/whoami', (req, res) => {
  const token = req.cookies?.[JWT_NAME];
  if (!token) {
    return res.status(401).json(UnauthorizedHttpError);
  }

  let payload: IJwtPayload;
  try {
    payload = jwt.verify(token, process.env.SERVER_JWT_SECRET) as IJwtPayload;
  } catch (error) {
    logger.warn(`${req.path}: [Issue with verifying user JWT]`, error);

    return res.status(401).json(UnauthorizedHttpError);
  }

  try {
    payload.context.user.affiliation = 'member';
    const jitsiJwt = jwt.sign(
      { room: process.env.WEB_JITSI_ROOM_NAME, context: payload.context },
      process.env.JWT_APP_SECRET,
      {
        audience: process.env.JWT_APP_ID,
        issuer: process.env.JWT_APP_ID,
        expiresIn: JITSI_JWT_EXPIRES_IN,
        subject: process.env.SERVER_URL,
        algorithm: 'HS256',
      },
    );

    return res.json({ ...payload.context.user, jitsiJwt });
  } catch (error) {
    logger.error(`${req.path}: [Error with generating Jitsi JWT]`, error);

    return res.status(500).json(InternalServerErrorHttpError);
  }
});

export default apiUsersRouter;
