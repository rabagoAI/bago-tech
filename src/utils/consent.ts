/**
 * Gestión del consentimiento de cookies (RGPD).
 *
 * Google Analytics NO se carga hasta que el usuario acepta. La decisión se
 * guarda en localStorage para no volver a preguntar en cada visita.
 */
const STORAGE_KEY = 'bagotech-cookie-consent'

export type ConsentValue = 'granted' | 'denied'

/** Devuelve la decisión guardada, o null si el usuario aún no ha decidido. */
export const getConsent = (): ConsentValue | null => {
    try {
        const value = localStorage.getItem(STORAGE_KEY)
        return value === 'granted' || value === 'denied' ? value : null
    } catch {
        return null
    }
}

/** Guarda la decisión del usuario. */
export const setConsent = (value: ConsentValue): void => {
    try {
        localStorage.setItem(STORAGE_KEY, value)
    } catch {
        // localStorage no disponible (modo privado, etc.): se ignora.
    }
}

/**
 * Reabre el banner para que el usuario pueda cambiar su decisión.
 * El componente CookieConsent escucha este evento.
 */
export const openCookieSettings = (): void => {
    window.dispatchEvent(new CustomEvent('open-cookie-settings'))
}
