
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App.tsx";
import "./index.css";
import "./styles/responsive.css";
import "./utils/consoleErrorFilter"; // Apply console filtering

// Handle browser extension errors gracefully
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (event.message?.includes('Could not establish connection') || 
        event.message?.includes('Receiving end does not exist') ||
        event.message?.includes('deferred DOM Node')) {
      // Suppress browser extension connection errors
      event.preventDefault();
      return false;
    }
  });

  // Handle unhandled promise rejections from browser extensions
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.message?.includes('Could not establish connection') ||
        event.reason?.message?.includes('Receiving end does not exist') ||
        event.reason?.message?.includes('deferred DOM Node')) {
      // Suppress browser extension connection errors
      event.preventDefault();
      return false;
    }
  });
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
  