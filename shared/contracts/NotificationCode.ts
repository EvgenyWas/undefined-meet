export const NOTIFICATION_CODES = {
  AuthSuccess: 'auth-success',
  AuthWhitelistingError: 'auth-whitelist-error',
  AuthGithubRetrieveError: 'auth-github-retrieve-error',
  AuthGoogleRetrieveError: 'auth-google-retrieve-error',
  ServerError: 'server-error',
};

export type NotificationCode =
  (typeof NOTIFICATION_CODES)[keyof typeof NOTIFICATION_CODES];
