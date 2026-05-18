import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { router } from './router'
import { initGA4 } from './utils/analytics'
import { AppProvider } from './context/AppContext'
import { ToastProvider } from './context/ToastContext'

function App() {
    useEffect(() => {
        initGA4()
    }, [])

    return (
        <HelmetProvider>
            <ToastProvider>
                <AppProvider>
                    <RouterProvider router={router} />
                </AppProvider>
            </ToastProvider>
        </HelmetProvider>
    )
}

export default App
