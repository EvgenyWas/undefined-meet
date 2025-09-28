/// <reference types="./vite-env-override.d.ts" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly WEB_JITSI_DOMAIN: string;
  readonly WEB_JITSI_ROOM_NAME: string;
  readonly WEB_JITSI_WHITEBOARD_BASE_URL: string;
  readonly WEB_API_URL: string;
  readonly WEB_AUTH_URL: string;
  readonly WEB_GOOGLE_APP_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
