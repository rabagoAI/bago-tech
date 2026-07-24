/**
 * Ajusta el tamaño de una imagen alojada en el CDN de Amazon
 * (m.media-amazon.com) reescribiendo el token de tamaño de la URL, p. ej.
 * `._AC_SL1500_.jpg` → `._AC_SL400_.jpg`. Evita descargar imágenes de
 * 1500px para miniaturas de ~250px, reduciendo peso y mejorando LCP/CLS.
 *
 * Si la URL no sigue el patrón de Amazon (p. ej. una imagen de otro origen),
 * se devuelve tal cual.
 */
export const getResizedAmazonImage = (url: string, size: number): string => {
    if (!url.includes('media-amazon.com')) return url
    // Soporta tanto "._AC_SL1500_.jpg" como "._SL1500_.jpg" (sin prefijo de 2 letras)
    return url.replace(/\._(?:[A-Z]{2}_)?S[XYL]\d+_/, `._AC_SL${size}_`)
}
