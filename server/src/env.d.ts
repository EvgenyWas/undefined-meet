declare global {
  namespace NodeJS {
    interface ProcessEnv {
      WEB_JITSI_ROOM_NAME: string;
      WEB_PUBLIC_URL: string;
      SERVER_PORT: string;
      SERVER_URL: string;
      SERVER_MORGAN_STREAM_PATH: string;
      SERVER_JWT_SECRET: string;
      SERVER_GITHUB_WHITELIST_PATH: string;
      GITHUB_CLIENT_ID: string;
      GITHUB_CLIENT_SECRET: string;
      JWT_APP_ID: string;
      JWT_APP_SECRET: string;
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      PWD: string;
    }
  }
}

export {};
