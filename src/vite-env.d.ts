/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_AMAZON_TAG: string
    readonly VITE_GA4_MEASUREMENT_ID?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

declare namespace React {
    interface ImgHTMLAttributes<T> {
        /** No tipado aún en esta versión de @types/react. Prioriza la descarga de la imagen LCP. */
        fetchpriority?: 'high' | 'low' | 'auto'
    }
}
