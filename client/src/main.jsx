/**
 * Main Entry Point
 * 
 * React uygulamasının giriş noktası. Root DOM element'ine
 * App component'ini render eder ve StrictMode ile sarmalar.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
