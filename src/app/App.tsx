import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import { router } from "./routes";
import { registerServiceWorker, setupInstallPrompt } from "./utils/pwa";

export default function App() {
  useEffect(() => {
    registerServiceWorker();
    setupInstallPrompt();
  }, []);

  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider> 
  );
}
