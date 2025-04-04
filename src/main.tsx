
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// Import voice-ui.css for voice component styling
import './styles/voice-ui.css'
// Import HelmetProvider for SEO
import { HelmetProvider } from 'react-helmet-async'
import { GeminiProvider } from '@/components/copilot/providers/GeminiProvider' // Re-enabled GeminiProvider

// Add error boundary for development debugging
if (import.meta.env.DEV) {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    // Check if this is a React-specific error
    const errorString = args.join(' ');
    if (errorString.includes('React') || errorString.includes('ReactDOM')) {
      console.warn('React Error:', ...args);
    } else {
      originalConsoleError(...args);
    }
  };
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <GeminiProvider> {/* Re-enabled GeminiProvider */} 
        <App />
      </GeminiProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
