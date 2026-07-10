import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { initGA4 } from './utils/analytics'
import { getConsent } from './utils/consent'
import './styles/index.css'

// Cargar GA4 solo si el usuario ya aceptó las cookies en una visita anterior
// (RGPD). Si acepta ahora, el banner llama a initGA4() al pulsar "Aceptar".
if (getConsent() === 'granted') {
    initGA4()
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
