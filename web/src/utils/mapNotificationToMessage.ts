import { NOTIFICATION_CODES } from 'undefined-meet-shared';

export const mapNotificationToMessage = (code: string): string | null => {
  switch (code) {
    case NOTIFICATION_CODES.AuthGithubRetrieveError:
      return '😅 Oops! Couldn’t fetch your GitHub data. Try again?';
    case NOTIFICATION_CODES.AuthGoogleRetrieveError:
      return '😅 Oops! Couldn’t fetch your Google data. Try again?';
    case NOTIFICATION_CODES.AuthSuccess:
      return '🎉 You’re in! Welcome aboard 🚀';
    case NOTIFICATION_CODES.AuthWhitelistingError:
      return '🙈 Looks like you’re not on the guest list… yet!';
    case NOTIFICATION_CODES.ServerError:
      return '💥 Our server took a coffee break. Please retry soon!';
    default:
      return null;
  }
};
