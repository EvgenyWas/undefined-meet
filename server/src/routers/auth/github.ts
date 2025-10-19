import { Router } from 'express';
import path from 'node:path';

import { GITHUB_OAUTH_CALLBACK_PATH } from '@/constants';
import { AuthGithubController } from '@/controllers/AuthGithubContoller';

const whitelistPath = path.resolve(
  process.cwd(),
  process.env.SERVER_USERS_WHITELIST_PATH,
);
const redirectUrl = `${process.env.SERVER_URL}${GITHUB_OAUTH_CALLBACK_PATH}`;
const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

const authGithubRouter = Router();
const githubController = new AuthGithubController({
  clientId,
  clientSecret,
  whitelistPath,
  redirectUrl,
});

authGithubRouter.get('/', githubController.getGithub);
authGithubRouter.get('/callback', githubController.getGithubCallback);

export default authGithubRouter;
