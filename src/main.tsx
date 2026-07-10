import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { initGA4 } from './utils/analytics'
import './styles/index.css'

// Inicializar GA4 antes de renderizar, para que window.gtag exista antes de
// que los efectos de los componentes disparen el primer trackPageView.
initGA4()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
