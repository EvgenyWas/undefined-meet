import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ErrorBoundary } from '@/components/ErrorBoundary.tsx';
import '@/styles/main.css';
import '@/styles/terminal.css';
import '@/styles/toastify.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallback="Something went wrong :(">
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
