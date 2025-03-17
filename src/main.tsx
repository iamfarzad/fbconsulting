
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// Import voice-ui.css for voice component styling
import './styles/voice-ui.css'

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
    <App />
  </React.StrictMode>,
)
