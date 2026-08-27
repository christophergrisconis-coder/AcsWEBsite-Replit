import { createRoot } from 'react-dom/client';

import { setBaseUrl } from '@workspace/api-client-react';
import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';
import { registerServiceWorker } from '@/lib/pwa';

import './index.css';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
if (apiBaseUrl) {
  setBaseUrl(apiBaseUrl);
} else if (typeof window !== 'undefined') {
  setBaseUrl(window.location.origin);
}

registerServiceWorker();

createRoot(document.getElementById('root')!, {
  // Keeps caught errors off reportError(), which would raise the dev overlay.
  onCaughtError: (error, errorInfo) => {
    console.error(error, errorInfo.componentStack);
  },
}).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
