import { Router } from 'express';

import authGithubRouter from './github';
import authGoogleRouter from './google';

const authRouter = Router();

authRouter.use('/github', authGithubRouter);
authRouter.use('/google', authGoogleRouter);

export default authRouter;
