import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '@/utils/analytics'

export const useAnalytics = () => {
    const location = useLocation()

    useEffect(() => {
        // Rastrear vista de página en cada cambio de ruta
        trackPageView(location.pathname, document.title)
    }, [location])
}
