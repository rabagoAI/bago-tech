import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

const FAVORITES_KEY = 'bagotech_favorites'
const RECENT_KEY = 'bagotech_recently_viewed'
const MAX_RECENT = 6

interface AppContextType {
    favoriteIds: string[]
    toggleFavorite: (id: string) => void
    isFavorite: (id: string) => boolean
    recentIds: string[]
    addToRecent: (id: string) => void
}

const AppContext = createContext<AppContextType | null>(null)

const readStorage = <T,>(key: string, fallback: T): T => {
    try {
        const raw = localStorage.getItem(key)
        return raw ? (JSON.parse(raw) as T) : fallback
    } catch {
        return fallback
    }
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [favoriteIds, setFavoriteIds] = useState<string[]>(() =>
        readStorage(FAVORITES_KEY, [])
    )
    const [recentIds, setRecentIds] = useState<string[]>(() =>
        readStorage(RECENT_KEY, [])
    )

    useEffect(() => {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds))
    }, [favoriteIds])

    useEffect(() => {
        localStorage.setItem(RECENT_KEY, JSON.stringify(recentIds))
    }, [recentIds])

    const toggleFavorite = (id: string) =>
        setFavoriteIds((prev) =>
            prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
        )

    const isFavorite = (id: string) => favoriteIds.includes(id)

    const addToRecent = (id: string) =>
        setRecentIds((prev) =>
            [id, ...prev.filter((r) => r !== id)].slice(0, MAX_RECENT)
        )

    return (
        <AppContext.Provider value={{ favoriteIds, toggleFavorite, isFavorite, recentIds, addToRecent }}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    const ctx = useContext(AppContext)
    if (!ctx) throw new Error('useAppContext must be used within AppProvider')
    return ctx
}
