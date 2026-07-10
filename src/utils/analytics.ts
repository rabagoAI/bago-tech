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
        if (import.meta.env.DEV) {
            console.info(
                '[analytics] GA4 sin configurar (VITE_GA4_MEASUREMENT_ID). Los eventos solo se registran en consola.'
            )
        }
        return
    }

    // Evitar doble inicialización
    if (window.gtag) return

    // Cargar script de GA4
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    document.head.appendChild(script)

    // Inicializar gtag
    window.dataLayer = window.dataLayer || []
    window.gtag = function (...args: any[]) {
        window.dataLayer!.push(args)
    }

    window.gtag('js', new Date())
    // send_page_view: false → las vistas las envía useAnalytics en cada cambio de
    // ruta, evitando el doble conteo de la primera página en esta SPA.
    window.gtag('config', measurementId, { send_page_view: false })
}

/**
 * Rastrea un evento personalizado
 */
export const trackEvent = ({ eventName, eventParams }: AnalyticsEvent): void => {
    if (window.gtag) {
        window.gtag('event', eventName, eventParams)
    } else if (import.meta.env.DEV) {
        // Sin GA cargado (p. ej. sin consentimiento): log solo en desarrollo.
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
 * Rastrea un clic en un enlace de afiliado.
 * Incluye value (precio) y currency para poder medir el valor potencial de cada
 * clic en GA4, además de la categoría del producto.
 */
export const trackAffiliateClick = (product: {
    id: string
    title: string
    price?: number
    category?: string
}): void => {
    trackEvent({
        eventName: 'affiliate_click',
        eventParams: {
            product_id: product.id,
            product_name: product.title,
            ...(product.category ? { item_category: product.category } : {}),
            ...(product.price != null ? { value: product.price, currency: 'EUR' } : {}),
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
