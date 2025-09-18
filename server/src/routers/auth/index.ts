import { Router } from 'express';

import authGithubRouter from './github';

const authRouter = Router();

authRouter.use('/github', authGithubRouter);

export default authRouter;
