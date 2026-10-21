import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { registerSW } from 'virtual:pwa-register';

// Instant PWA Auto-Update: Detects new builds and immediately refreshes on mobile
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('[Mihiracle PWA] New build detected, auto-refreshing...');
    updateSW(true);
  },
  onOfflineReady() {
    console.log('[Mihiracle PWA] Ready for offline use');
  },
  onRegistered(r) {
    if (r) {
      // Check for updates every 30 seconds
      setInterval(() => {
        r.update();
      }, 30 * 1000);

      // Check for updates when switching back to the app on mobile
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          r.update();
        }
      });
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
