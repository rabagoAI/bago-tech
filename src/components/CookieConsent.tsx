import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Cookie } from 'lucide-react'
import { Button } from './ui/Button'
import { getConsent, setConsent } from '@/utils/consent'
import { initGA4 } from '@/utils/analytics'

export const CookieConsent = () => {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        // Mostrar el banner si el usuario todavía no ha decidido
        if (getConsent() === null) setVisible(true)

        // Permitir reabrirlo desde el enlace del footer
        const reopen = () => setVisible(true)
        window.addEventListener('open-cookie-settings', reopen)
        return () => window.removeEventListener('open-cookie-settings', reopen)
    }, [])

    const handleAccept = () => {
        setConsent('granted')
        initGA4() // carga GA inmediatamente (tiene guard anti-doble-init)
        setVisible(false)
    }

    const handleReject = () => {
        setConsent('denied')
        setVisible(false)
    }

    if (!visible) return null

    return (
        <div
            className="fixed bottom-0 inset-x-0 z-50 p-4 animate-slide-up"
            role="dialog"
            aria-live="polite"
            aria-label="Consentimiento de cookies"
        >
            <div className="max-w-3xl mx-auto glass-effect rounded-2xl border border-gray-200 dark:border-slate-700 shadow-xl p-5 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-start gap-3 flex-1">
                        <Cookie className="w-6 h-6 text-primary-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Usamos cookies de analítica (Google Analytics) para entender cómo se
                            usa la web y mejorarla. No se cargan hasta que aceptas. Consulta{' '}
                            <Link
                                to="/legal"
                                className="text-primary-600 dark:text-primary-400 underline hover:no-underline"
                            >
                                nuestra política
                            </Link>
                            .
                        </p>
                    </div>
                    <div className="flex gap-3 flex-shrink-0">
                        <button
                            onClick={handleReject}
                            className="flex-1 md:flex-none px-5 py-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors active:scale-95"
                        >
                            Rechazar
                        </button>
                        <Button
                            variant="primary"
                            size="md"
                            className="flex-1 md:flex-none active:scale-95"
                            onClick={handleAccept}
                        >
                            Aceptar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
