import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ShoppingBag, CheckCircle, Info } from 'lucide-react'
import { useToast, type Toast } from '@/context/ToastContext'

const ICONS = {
    info: <Info className="w-5 h-5 text-primary-500" />,
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    warning: <ShoppingBag className="w-5 h-5 text-amber-500" />,
}

const ToastItem = ({ toast }: { toast: Toast }) => {
    const { dismissToast } = useToast()
    const icon = ICONS[toast.type ?? 'info']

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="flex items-start gap-3 min-w-[280px] max-w-sm w-full bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200/80 dark:border-slate-700/80 px-4 py-3.5 backdrop-blur-sm"
        >
            <div className="flex-shrink-0 mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">
                    {toast.message}
                </p>
                {toast.submessage && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {toast.submessage}
                    </p>
                )}
            </div>
            <button
                onClick={() => dismissToast(toast.id)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors mt-0.5"
            >
                <X className="w-4 h-4" />
            </button>

            {/* Progress bar */}
            <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-primary-500 rounded-full"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: (toast.duration ?? 2800) / 1000, ease: 'linear' }}
            />
        </motion.div>
    )
}

export const ToastContainer = () => {
    const { toasts } = useToast()

    return createPortal(
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end pointer-events-none">
            <AnimatePresence mode="sync">
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto relative">
                        <ToastItem toast={toast} />
                    </div>
                ))}
            </AnimatePresence>
        </div>,
        document.body
    )
}
