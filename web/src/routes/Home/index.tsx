import { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import useSWRImmutable from 'swr/immutable';
import Toastify from 'toastify-js';

import TypingOutText from '@/components/TypingOutText';
import { apiEndpoints, asciiLogo, manifestItems } from '@/constants';
import { useBuyMeACoffeeWidget } from '@/hooks/useBuymeacoffee';
import type { IApiError } from '@/types/IApiError';
import type { IWhoAmIData } from '@/types/IWhoAmIData';
import { mapNotificationToMessage } from '@/utils';
import SsoLinks from '@/components/SsoLinks';

import styles from './Home.module.css';

export const Home = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, error, isLoading } = useSWRImmutable<IWhoAmIData, IApiError>(
    apiEndpoints.whoAmI,
  );

  const hasMeetingButton = data && !error;

  const toastInstance = useMemo(
    () =>
      Toastify({
        gravity: 'top',
        position: 'right',
        duration: 4000,
        stopOnFocus: true,
        onClick() {
          toastInstance.hideToast();
        },
      }),
    [],
  );

  useBuyMeACoffeeWidget();

  useEffect(() => {
    const code = searchParams.get('notification');
    searchParams;
    if (!code) {
      return;
    }

    const message = mapNotificationToMessage(code);
    if (!message) {
      searchParams.delete('notification');
      return setSearchParams(searchParams, { replace: true });
    }

    toastInstance.options.text = message;
    toastInstance.showToast();
    searchParams.delete('notification');
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, toastInstance]);

  return (
    <div className={styles.wrapper}>
      <main>
        <TypingOutText as="pre" text={asciiLogo} className={styles.logo} />

        <ul>
          {manifestItems.map((item) => (
            <TypingOutText key={item} as="li" text={item} />
          ))}
        </ul>

        {isLoading ? null : hasMeetingButton ? (
          <button onClick={() => navigate('/room')}>Join meeting</button>
        ) : (
          <SsoLinks />
        )}
      </main>

      <footer className={styles.footer}>
        <hr />
        <p className={styles.footerContent}>
          <span>
            Made by <a href="https://github.com/EvgenyWas">Yauheni</a>.
          </span>
          <span>Inspired by Undefined.</span>
          <span>
            Source code{' '}
            <a href="https://github.com/EvgenyWas/undefined-meet">here</a>.
          </span>
        </p>
      </footer>
    </div>
  );
};
