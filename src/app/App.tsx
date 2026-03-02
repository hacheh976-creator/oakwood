import { RouterProvider } from "react-router";
import { AppProvider } from "./contexts/AppContext";
import { router } from "./routes";
import { useEffect } from "react";
import { registerServiceWorker, setupInstallPrompt } from "./utils/pwa";

export default function App() {
  useEffect(() => {
    // Register service worker for PWA functionality
    registerServiceWorker();
    
    // Setup install prompt handler
    setupInstallPrompt();
  }, []);

  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}