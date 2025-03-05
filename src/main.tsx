
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ensureCompatibility } from './lib/compatibility';

// Ensure compatibility fixes are applied before the app starts
ensureCompatibility();

// Mount the application
createRoot(document.getElementById("root")!).render(<App />);
