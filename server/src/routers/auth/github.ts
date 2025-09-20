import { OAuthApp } from '@octokit/oauth-app';
import { request as octokitRequest } from '@octokit/request';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import fs from 'node:fs/promises';
import path from 'node:path';
import { NOTIFICATION_CODES } from 'undefined-meet-shared';

import {
  GITHUB_OAUTH_CALLBACK_PATH,
  JWT_EXPIRES_IN,
  JWT_NAME,
} from '@/constants';
import type { IJwtPayload } from '@/types/IJwtPayload';
import { getWebUrlWithNotification } from '@/utils';

type TGithubUser = Awaited<
  ReturnType<typeof octokitRequest<'GET /user'>>
>['data'];

const githubUsersWhitelistPath = path.resolve(
  process.cwd(),
  process.env.SERVER_GITHUB_WHITELIST_PATH,
);

const octokitOAuthApp = new OAuthApp({
  clientType: 'oauth-app',
  allowSignup: true,
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  redirectUrl: `${process.env.SERVER_URL}${GITHUB_OAUTH_CALLBACK_PATH}`,
});

const authGithubRouter = Router();

authGithubRouter.get('/', async (_, res) => {
  const webFlow = octokitOAuthApp.getWebFlowAuthorizationUrl({
    allowSignup: true,
    redirectUrl: `${process.env.SERVER_URL}${GITHUB_OAUTH_CALLBACK_PATH}`,
  });

  res.redirect(webFlow.url);
});

authGithubRouter.get('/callback', async (req, res) => {
  const { code, state } = req.query;
  if (!code) {
    return res.redirect(
      getWebUrlWithNotification(NOTIFICATION_CODES.AuthGithubRetrieveError),
    );
  }

  // Create Github access token and receive user data
  let user: TGithubUser;
  try {
    const { authentication: auth } = await octokitOAuthApp.createToken({
      code: code.toString(),
      state: state?.toString(),
    });
    const response = await octokitRequest('GET /user', {
      headers: { authorization: `${auth.type} ${auth.token}` },
    });
    user = response.data;
  } catch (error) {
    return res.redirect(
      getWebUrlWithNotification(NOTIFICATION_CODES.AuthGithubRetrieveError),
    );
  }

  try {
    // Verify if this GitHub user is whitelisted
    const file = await fs.readFile(githubUsersWhitelistPath, 'utf8');
    const list = file.split('\n');
    const isWhitelisted = list.some((username) => username === user.login);
    if (!isWhitelisted) {
      return res.redirect(
        getWebUrlWithNotification(NOTIFICATION_CODES.AuthWhitelistingError),
      );
    }

    // Generate JWT
    const payload: IJwtPayload = {
      context: {
        user: {
          avatar: user.avatar_url,
          name: user.name || '',
          email: user.email || '',
        },
      },
    };
    const token = jwt.sign(payload, process.env.SERVER_JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      audience: 'undefined-meet',
      issuer: 'undefined-meet',
      subject: process.env.SERVER_URL,
    });

    res.cookie(JWT_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: JWT_EXPIRES_IN,
    });
    return res.redirect(
      getWebUrlWithNotification(NOTIFICATION_CODES.AuthSuccess),
    );
  } catch (error) {
    console.error(error);
    res.redirect(getWebUrlWithNotification(NOTIFICATION_CODES.ServerError));
  }
});

export default authGithubRouter;
