import type { AnalyticsEvent } from '@/types'

declare global {
    interface Window {
        gtag?: (...args: any[]) => void
        dataLayer?: any[]
    }
}

/**
 * Inicializa Google Analytics 4
 */
export const initGA4 = (): void => {
    const measurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID

    if (!measurementId) {
        console.warn('GA4 Measurement ID no configurado')
        return
    }

    // Cargar script de GA4
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    document.head.appendChild(script)

    // Inicializar gtag
    window.gtag = function (...args: any[]) {
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push(args)
    }

    window.gtag('js', new Date())
    window.gtag('config', measurementId)
}

/**
 * Rastrea un evento personalizado
 */
export const trackEvent = ({ eventName, eventParams }: AnalyticsEvent): void => {
    if (window.gtag) {
        window.gtag('event', eventName, eventParams)
    } else {
        console.log('Analytics event:', eventName, eventParams)
    }
}

/**
 * Rastrea una vista de página
 */
export const trackPageView = (path: string, title: string): void => {
    trackEvent({
        eventName: 'page_view',
        eventParams: {
            page_path: path,
            page_title: title,
        },
    })
}

/**
 * Rastrea un clic en un enlace de afiliado
 */
export const trackAffiliateClick = (productId: string, productName: string): void => {
    trackEvent({
        eventName: 'affiliate_click',
        eventParams: {
            product_id: productId,
            product_name: productName,
        },
    })
}

/**
 * Rastrea una vista de producto
 */
export const trackProductView = (productId: string, productName: string): void => {
    trackEvent({
        eventName: 'view_item',
        eventParams: {
            product_id: productId,
            product_name: productName,
        },
    })
}
