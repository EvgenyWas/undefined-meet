import { memo } from 'react';

import GithubIcon from '@/assets/github.svg?react';
import GoogleIcon from '@/assets/google.svg?react';

import styles from './SsoLinks.module.css';

const githubAuthHref = `${import.meta.env.WEB_AUTH_URL}/github`;
const googleAuthHref = `${import.meta.env.WEB_AUTH_URL}/google`;

const SsoLinks = () => {
  return (
    <div className={styles.links}>
      Sign In with
      <a href={githubAuthHref} aria-label="Github SSO" className={styles.link}>
        <GithubIcon />
      </a>
      or
      <a href={googleAuthHref} aria-label="Google SSO" className={styles.link}>
        <GoogleIcon />
      </a>
    </div>
  );
};

export default memo(SsoLinks);
