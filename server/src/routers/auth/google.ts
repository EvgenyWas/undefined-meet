import { Router } from 'express';
import path from 'node:path';

import { GOOGLE_OAUTH_CALLBACK_PATH } from '@/constants';
import { AuthGoogleController } from '@/controllers/AuthGoogleController';

const whitelistPath = path.resolve(
  process.cwd(),
  process.env.SERVER_USERS_WHITELIST_PATH,
);
const redirectUrl = `${process.env.SERVER_URL}${GOOGLE_OAUTH_CALLBACK_PATH}`;
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

const authGoogleRouter = Router();
const googleController = new AuthGoogleController({
  clientId,
  clientSecret,
  whitelistPath,
  redirectUrl,
});

authGoogleRouter.get('/', googleController.getGoogle);
authGoogleRouter.get('/callback', googleController.getGoogleCallback);

export default authGoogleRouter;
