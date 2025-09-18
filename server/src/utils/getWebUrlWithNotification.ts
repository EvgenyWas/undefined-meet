import type { NotificationCode } from 'undefined-meet-shared';

export const getWebUrlWithNotification = (code: NotificationCode) => {
  return `${process.env.WEB_PUBLIC_URL}/?notification=${code}`;
};
