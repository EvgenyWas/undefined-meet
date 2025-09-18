import { Router } from 'express';

import apiUsersRouter from './users';

const apiRouter = Router();

apiRouter.use('/users', apiUsersRouter);

export default apiRouter;
