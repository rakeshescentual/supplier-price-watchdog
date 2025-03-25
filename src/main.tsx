
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ensureCompatibility } from './lib/compatibility';

// Ensure compatibility fixes are applied before the app starts
ensureCompatibility();

// Handle any initialization errors gracefully
try {
  // Mount the application
  createRoot(document.getElementById("root")!).render(<App />);
} catch (error) {
  console.error("Failed to initialize application:", error);
  
  // Show a basic error fallback if something goes wrong during initialization
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: sans-serif;">
        <h2>Application Initialization Error</h2>
        <p>We're sorry, but there was a problem starting the application.</p>
        <p>Please try refreshing the page or contact support if the issue persists.</p>
        <p style="color: #666; font-size: 0.8em; margin-top: 20px;">Error details: ${error instanceof Error ? error.message : String(error)}</p>
      </div>
    `;
  }
}
