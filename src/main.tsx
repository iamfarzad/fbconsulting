
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// Import HelmetProvider for SEO
import { HelmetProvider } from 'react-helmet-async'
import { GeminiProvider } from '@/components/copilot/providers/GeminiProvider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <GeminiProvider>
        <App />
      </GeminiProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
