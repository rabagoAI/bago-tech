import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export interface Toast {
    id: string
    message: string
    submessage?: string
    type?: 'info' | 'success' | 'warning'
    duration?: number
}

interface ToastContextType {
    toasts: Toast[]
    showToast: (toast: Omit<Toast, 'id'>) => void
    dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([])

    const dismissToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    const showToast = useCallback(
        (toast: Omit<Toast, 'id'>) => {
            const id = crypto.randomUUID()
            const duration = toast.duration ?? 2800
            setToasts((prev) => [...prev, { ...toast, id }])
            setTimeout(() => dismissToast(id), duration)
        },
        [dismissToast]
    )

    return (
        <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
            {children}
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast must be used within ToastProvider')
    return ctx
}
