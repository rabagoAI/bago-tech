import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Header } from './Header'
import { Footer } from './Footer'
import { ToastContainer } from './ToastContainer'
import { CookieConsent } from './CookieConsent'
import { useAnalytics } from '@/hooks/useAnalytics'

const pageVariants = {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
}

const pageTransition = {
    duration: 0.28,
    ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
}

export const Layout = () => {
    useAnalytics()
    const location = useLocation()

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
            <Footer />
            <ToastContainer />
            <CookieConsent />
        </div>
    )
}
