import { RequestHandler } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { NOTIFICATION_CODES } from 'undefined-meet-shared';
import jwt from 'jsonwebtoken';
import fs from 'node:fs/promises';

import { logger } from '@/logger';
import { GoogleUserInfoResponse } from '@/types/GoogleUserInfoResponse';
import { getWebUrlWithNotification } from '@/utils';
import { IJwtPayload } from '@/types/IJwtPayload';
import { JWT_EXPIRES_IN, JWT_NAME } from '@/constants';

interface AuthGoogleControllerParams {
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
  whitelistPath: string;
}

export class AuthGoogleController {
  private readonly oauthClient: OAuth2Client;
  private readonly whitelistPath: string;
  private readonly redirectUrl: string;

  constructor({
    clientId,
    clientSecret,
    redirectUrl,
    whitelistPath,
  }: AuthGoogleControllerParams) {
    this.oauthClient = new OAuth2Client({
      clientId,
      clientSecret,
      redirectUri: redirectUrl,
    });
    this.whitelistPath = whitelistPath;
    this.redirectUrl = redirectUrl;
  }

  getGoogle: RequestHandler = (_, res) => {
    const url = this.oauthClient.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      include_granted_scopes: true,
      redirect_uri: this.redirectUrl,
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ],
    });

    res.redirect(url);
  };

  getGoogleCallback: RequestHandler = async (req, res) => {
    const { code, error } = req.query;
    if (error) {
      logger.error(
        `${req.path}: '[User is redirected to the auth/google/callback endpoint with error]`,
        { error },
      );

      return res.redirect(
        getWebUrlWithNotification(NOTIFICATION_CODES.AuthGoogleRetrieveError),
      );
    }

    if (!code) {
      logger.warn(
        `${req.path}: '[User is redirected to the auth/google/callback endpoint without code]`,
        { query: req.query },
      );

      return res.redirect(
        getWebUrlWithNotification(NOTIFICATION_CODES.AuthGoogleRetrieveError),
      );
    }

    // #1 Get Google access token and receive user data
    let user: GoogleUserInfoResponse;
    try {
      const { tokens } = await this.oauthClient.getToken(code as string);
      const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      user = (await res.json()) as GoogleUserInfoResponse;
    } catch (error) {
      logger.error(
        `${req.path}: [Error with creating google access token and receiving user data]`,
        error,
      );

      return res.redirect(
        getWebUrlWithNotification(NOTIFICATION_CODES.AuthGoogleRetrieveError),
      );
    }

    // #2 Verify if this Google user is whitelisted
    try {
      const file = await fs.readFile(this.whitelistPath, 'utf8');
      const list = file.split('\n');
      const isWhitelisted = list.some((username) => username === user.email);
      if (!isWhitelisted) {
        logger.info(`${req.path}: [User is not whitelisted]`, {
          login: user.email,
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
            avatar: user.picture || '',
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

      logger.info(`✅ User ${user.name} signed in with Google successfully`);

      return res.redirect(
        getWebUrlWithNotification(NOTIFICATION_CODES.AuthSuccess),
      );
    } catch (error) {
      logger.error(`${req.path}: [Error with generating user JWT]`, error);
      res.redirect(getWebUrlWithNotification(NOTIFICATION_CODES.ServerError));
    }
  };
}
