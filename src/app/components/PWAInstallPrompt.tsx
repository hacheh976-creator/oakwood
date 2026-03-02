import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { promptInstall, isStandalone, isIOS, isAndroid } from '../utils/pwa';

export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (isStandalone()) {
      setShowPrompt(false);
      return;
    }

    // Check if beforeinstallprompt event is available
    const handler = () => {
      setIsInstallable(true);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // For iOS devices, show custom install instructions
    if (isIOS() && !isStandalone()) {
      // Show iOS instructions after 3 seconds
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = () => {
    if (isInstallable) {
      promptInstall();
      setShowPrompt(false);
    }
  };

  const handleClose = () => {
    setShowPrompt(false);
    // Don't show again for 7 days
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  // Check if user dismissed recently
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed) {
      const daysSince = (Date.now() - parseInt(dismissed)) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) {
        setShowPrompt(false);
      }
    }
  }, []);

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#4A3829] text-white shadow-2xl animate-slide-up">
      <div className="max-w-lg mx-auto p-4">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4 pr-8">
          <div className="flex-shrink-0 w-12 h-12 bg-[#F5EFE7] rounded-xl flex items-center justify-center">
            <span className="text-2xl font-black text-[#4A3829]">O</span>
          </div>

          <div className="flex-1">
            <h3 className="font-black text-lg mb-1">Install OAKWOOD App</h3>
            <p className="text-sm text-white/80 mb-3">
              Get quick access to our furniture store from your home screen!
            </p>

            {isIOS() ? (
              <div className="text-xs text-white/70 space-y-1 mb-3">
                <p>📱 To install on iPhone/iPad:</p>
                <ol className="list-decimal list-inside space-y-0.5 ml-2">
                  <li>Tap the Share button <span className="inline-block">⎙</span></li>
                  <li>Scroll down and tap "Add to Home Screen"</li>
                  <li>Tap "Add" in the top right corner</li>
                </ol>
              </div>
            ) : (
              <button
                onClick={handleInstall}
                className="flex items-center gap-2 bg-white text-[#4A3829] px-4 py-2.5 rounded-lg font-bold hover:bg-white/90 transition-colors"
              >
                <Download className="w-4 h-4" />
                Install App
              </button>
            )}
          </div>
        </div>

        {!isIOS() && (
          <div className="mt-3 pt-3 border-t border-white/20">
            <p className="text-xs text-white/60 text-center">
              Works offline • Fast loading • Home screen access
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
