import { useEffect, useState, useCallback } from 'react'

export const useScrollReveal = (threshold = 0.12) => {
    const [isVisible, setIsVisible] = useState(false)
    const [element, setElement] = useState<HTMLElement | null>(null)

    // Callback ref: se llama cada vez que el elemento se monta o desmonta
    const ref = useCallback((node: HTMLElement | null) => {
        setElement(node)
    }, [])

    useEffect(() => {
        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.unobserve(entry.target)
                }
            },
            { threshold }
        )

        observer.observe(element)
        return () => observer.disconnect()
    }, [element, threshold])

    return { ref, isVisible }
}
