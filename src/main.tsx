
import React from 'react'
import ReactDOM from 'react-dom/client'
// Use SafeApp with comprehensive error handling
// import App from './App.tsx'
import SafeApp from './SafeApp.tsx'
import './index.css'
// Import voice-ui.css for voice component styling
import './styles/voice-ui.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SafeApp />
  </React.StrictMode>,
)
