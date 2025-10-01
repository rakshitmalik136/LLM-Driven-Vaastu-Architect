import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Switch between SimpleApp (working) and App (full 3D features)
import SimpleApp from './SimpleApp.jsx'
// import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SimpleApp />
  </StrictMode>,
)
