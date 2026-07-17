import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import './components/MobileContactTopBar.css'
import './components/MobileFooterNav.css'
import App from './App.tsx'

const root = createRoot(document.getElementById('root')!)

root.render(
  <HelmetProvider>
    <App />
  </HelmetProvider>,
)

// Signal prerender plugin that the app has rendered
requestAnimationFrame(() => {
  setTimeout(() => {
    document.dispatchEvent(new Event('prerender-ready'))
  }, 1500)
})
