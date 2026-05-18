/**
 * Genera un enlace de afiliado de Amazon con el tag configurado
 */
export const generateAmazonLink = (asin: string): string => {
    const amazonTag = import.meta.env.VITE_AMAZON_TAG || 'bagotech-21'
    const amazonDomain = 'amazon.es' // Cambiar según tu mercado (amazon.com, amazon.es, etc.)

    return `https://www.${amazonDomain}/dp/${asin}?tag=${amazonTag}`
}

/**
 * Formatea el precio en euros
 */
export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
    }).format(price)
}

/**
 * Calcula el porcentaje de descuento
 */
export const calculateDiscount = (originalPrice: number, currentPrice: number): number => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
}
