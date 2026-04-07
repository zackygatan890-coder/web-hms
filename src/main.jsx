import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

// Register Service Worker (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        console.log('[HMS PWA] Service Worker registered:', reg.scope);
        reg.addEventListener('updatefound', () => {
          console.log('[HMS PWA] New version available, updating cache...');
        });
      })
      .catch(err => console.warn('[HMS PWA] SW registration failed:', err));
  });
}
