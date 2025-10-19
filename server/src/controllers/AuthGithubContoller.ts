import { OAuthApp, Options } from '@octokit/oauth-app';
import { request as octokitRequest } from '@octokit/request';
import type { Request, RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';
import fs from 'node:fs/promises';
import { NOTIFICATION_CODES } from 'undefined-meet-shared';

import { JWT_EXPIRES_IN, JWT_NAME } from '@/constants';
import { logger } from '@/logger';
import { IJwtPayload } from '@/types/IJwtPayload';
import { getWebUrlWithNotification } from '@/utils';

interface AuthGithubControllerParams {
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
  whitelistPath: string;
}

type TGithubUser = Awaited<
  ReturnType<typeof octokitRequest<'GET /user'>>
>['data'];

export class AuthGithubController {
  private readonly oauthClient: OAuthApp<Options<'oauth-app'>>;
  private readonly whitelistPath: string;
  private readonly redirectUrl: string;

  constructor({
    clientId,
    clientSecret,
    redirectUrl,
    whitelistPath,
  }: AuthGithubControllerParams) {
    this.oauthClient = new OAuthApp({
      clientType: 'oauth-app',
      allowSignup: true,
      clientId,
      clientSecret,
      redirectUrl,
    });
    this.whitelistPath = whitelistPath;
    this.redirectUrl = redirectUrl;
  }

  getGithub: RequestHandler = (_, res) => {
    const webFlow = this.oauthClient.getWebFlowAuthorizationUrl({
      allowSignup: true,
      redirectUrl: this.redirectUrl,
    });

    res.redirect(webFlow.url);
  };

  getGithubCallback: RequestHandler = async (req: Request, res: Response) => {
    const { code, state } = req.query;
    if (!code) {
      logger.warn(
        `${req.path}: '[User is redirected to the auth/github/callback endpoint without code]`,
        { query: req.query },
      );

      return res.redirect(
        getWebUrlWithNotification(NOTIFICATION_CODES.AuthGithubRetrieveError),
      );
    }

    // #1 Create Github access token and receive user data
    let user: TGithubUser;
    try {
      const { authentication: auth } = await this.oauthClient.createToken({
        code: code.toString(),
        state: state?.toString(),
      });
      const response = await octokitRequest('GET /user', {
        headers: { authorization: `${auth.type} ${auth.token}` },
      });
      user = response.data;
    } catch (error) {
      logger.error(
        `${req.path}: [Error with creating github access token and receiving user data]`,
        error,
      );

      return res.redirect(
        getWebUrlWithNotification(NOTIFICATION_CODES.AuthGithubRetrieveError),
      );
    }

    // #2 Verify if this Github user is whitelisted
    try {
      const file = await fs.readFile(this.whitelistPath, 'utf8');
      const list = file.split('\n');
      const isWhitelisted = list.some(
        (username) => username === user.login || username === user.email,
      );
      if (!isWhitelisted) {
        logger.info(`${req.path}: [User is not whitelisted]`, {
          login: user.login,
          name: user.name,
        });

        return res.redirect(
          getWebUrlWithNotification(NOTIFICATION_CODES.AuthWhitelistingError),
        );
      }
    } catch (error) {
      logger.error(
        `${req.path}: [Error with verifying user is whitelisted]`,
        error,
      );

      return res.redirect(
        getWebUrlWithNotification(NOTIFICATION_CODES.ServerError),
      );
    }

    // #3 Generate JWT
    try {
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

      logger.info(`✅ User ${user.name} signed in with Github successfully`);

      return res.redirect(
        getWebUrlWithNotification(NOTIFICATION_CODES.AuthSuccess),
      );
    } catch (error) {
      logger.error(`${req.path}: [Error with generating user JWT]`, error);
      res.redirect(getWebUrlWithNotification(NOTIFICATION_CODES.ServerError));
    }
  };
}
