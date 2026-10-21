import React, { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('mihiracle_pwa_dismissed') === 'true';
  });

  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (isStandalone || isDismissed) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else if (isIos) {
      setShowIosGuide(true);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('mihiracle_pwa_dismissed', 'true');
  };

  // Only show if either Android prompt is captured or on iOS Safari
  if (!deferredPrompt && !isIos) return null;

  return (
    <>
      <aside 
        aria-label="Install App"
        className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:w-96 z-40 bg-brand-navy text-white p-4 rounded-2xl shadow-xl flex items-center justify-between border border-brand-mint/30 animate-in fade-in slide-in-from-bottom-5 duration-300"
      >
        <div className="flex items-center gap-3 pr-2">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Download className="w-5 h-5 text-brand-mint" />
          </div>
          <div>
            <h4 className="text-xs font-bold leading-tight">Install Mihiracle</h4>
            <p className="text-[11px] text-white/70 leading-tight mt-0.5">
              Read offline & launch directly from your home screen.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 bg-brand-mint hover:bg-brand-mint-dark text-brand-navy font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="p-1.5 text-white/60 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Dismiss install banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* iOS Add to Home Screen Instructions */}
      <Modal
        isOpen={showIosGuide}
        onClose={() => setShowIosGuide(false)}
        title="Add Mihiracle to iPhone Home Screen"
      >
        <div className="space-y-4 text-sm text-brand-text dark:text-dark-text py-1">
          <p className="text-brand-muted dark:text-dark-muted text-xs">
            Follow these simple steps in Safari to install Mihiracle as a standalone mobile app:
          </p>

          <ol className="space-y-3">
            <li className="flex items-start gap-3 p-3 bg-brand-bg dark:bg-dark-card rounded-xl">
              <span className="w-6 h-6 rounded-full bg-brand-navy dark:bg-brand-mint text-white dark:text-brand-navy font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div>
                <p className="font-semibold text-xs">Tap the Share icon</p>
                <p className="text-[11px] text-brand-muted dark:text-dark-muted mt-0.5 flex items-center gap-1">
                  Located at the bottom of Safari's toolbar: <Share className="w-3.5 h-3.5 inline text-blue-500" />
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-3 bg-brand-bg dark:bg-dark-card rounded-xl">
              <span className="w-6 h-6 rounded-full bg-brand-navy dark:bg-brand-mint text-white dark:text-brand-navy font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div>
                <p className="font-semibold text-xs">Select "Add to Home Screen"</p>
                <p className="text-[11px] text-brand-muted dark:text-dark-muted mt-0.5 flex items-center gap-1">
                  Scroll down the share sheet and tap <PlusSquare className="w-3.5 h-3.5 inline text-stone-700 dark:text-stone-300" />
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-3 bg-brand-bg dark:bg-dark-card rounded-xl">
              <span className="w-6 h-6 rounded-full bg-brand-navy dark:bg-brand-mint text-white dark:text-brand-navy font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div>
                <p className="font-semibold text-xs">Confirm "Add"</p>
                <p className="text-[11px] text-brand-muted dark:text-dark-muted mt-0.5">
                  Tap "Add" in the top-right corner to place the app on your home screen.
                </p>
              </div>
            </li>
          </ol>

          <Button 
            variant="primary" 
            className="w-full mt-2" 
            onClick={() => setShowIosGuide(false)}
          >
            Got It
          </Button>
        </div>
      </Modal>
    </>
  );
};
