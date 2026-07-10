import { RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { router } from './router'
import { AppProvider } from './context/AppContext'
import { ToastProvider } from './context/ToastContext'

function App() {
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
