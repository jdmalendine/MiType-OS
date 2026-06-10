import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { NoiseProvider } from './components/NoiseProvider';

// Shim process for environments where it's not globally defined
// Added type assertion to (window as any) to resolve TypeScript error regarding 'process'
if (typeof window !== 'undefined' && !(window as any).process) {
  (window as any).process = { env: {} };
}

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <NoiseProvider>
          <App />
        </NoiseProvider>
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Mounting error:", error);
    rootElement.innerHTML = `
      <div style="padding: 2rem; color: white; background: #111827; height: 100vh; font-family: sans-serif; display: flex; align-items: center; justify-content: center;">
        <div style="max-width: 600px; background: #1f2937; padding: 2rem; border-radius: 1rem; border: 1px solid #374151;">
          <h1 style="color: #ef4444;">System Boot Error</h1>
          <p style="color: #9ca3af;">The OS failed to initialize. Check the browser console (F12) for details.</p>
          <pre style="background: rgba(0,0,0,0.5); padding: 1rem; border-radius: 0.5rem; color: #f87171; overflow: auto;">${error instanceof Error ? error.message : String(error)}</pre>
        </div>
      </div>`;
  }
}