import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';

const envPrefix = 'WEB_';
const envDir = '../';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, envDir, envPrefix);

  return {
    plugins: [react(), svgr({ include: '**/*.svg?react' })],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    envPrefix,
    envDir,
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
      },
    },
    server: {
      proxy: {
        '/api': {
          target: env.WEB_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    build: {
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            toastify: ['toastify-js'],
          },
        },
      },
    },
  };
});
