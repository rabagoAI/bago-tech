import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Zap, Heart } from 'lucide-react'
import { useAppContext } from '@/context/AppContext'

export const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { favoriteIds } = useAppContext()
    const location = useLocation()

    const navigation = [
        { name: 'Inicio', href: '/' },
        { name: 'Productos', href: '/productos' },
        { name: 'Ofertas', href: '/productos?sale=1' },
        { name: 'Legal', href: '/legal' },
    ]

    const isActive = (href: string) =>
        href === '/'
            ? location.pathname === '/'
            : href.includes('?')
              ? location.pathname + location.search === href
              : location.pathname.startsWith(href) && location.search === ''

    return (
        <header className="sticky top-0 z-40 glass-effect border-b border-white/20 dark:border-slate-700/50">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="relative">
                            <Zap className="h-8 w-8 text-primary-600 group-hover:text-primary-500 transition-colors duration-200" fill="currentColor" />
                        </div>
                        <span className="text-2xl font-bold gradient-text tracking-tight">BagoTech</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`font-medium transition-colors relative pb-0.5 ${
                                    isActive(item.href)
                                        ? 'text-primary-600 dark:text-primary-400'
                                        : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                                }`}
                            >
                                {item.name}
                                {isActive(item.href) && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-full" />
                                )}
                            </Link>
                        ))}

                        {/* Favorites link */}
                        <Link
                            to="/favoritos"
                            className={`relative flex items-center gap-1.5 font-medium transition-colors ${
                                isActive('/favoritos')
                                    ? 'text-red-500'
                                    : 'text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400'
                            }`}
                        >
                            <Heart
                                className="w-5 h-5 transition-transform hover:scale-110"
                                fill={favoriteIds.length > 0 ? 'currentColor' : 'none'}
                            />
                            <span>Favoritos</span>
                            {favoriteIds.length > 0 && (
                                <span className="absolute -top-2 -right-3 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 animate-scale-in">
                                    {favoriteIds.length}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile: favorites icon + hamburger */}
                    <div className="flex md:hidden items-center gap-2">
                        <Link to="/favoritos" className="relative p-2">
                            <Heart
                                className="w-6 h-6 text-gray-700 dark:text-gray-300"
                                fill={favoriteIds.length > 0 ? '#ef4444' : 'none'}
                                stroke={favoriteIds.length > 0 ? '#ef4444' : 'currentColor'}
                            />
                            {favoriteIds.length > 0 && (
                                <span className="absolute top-0 right-0 min-w-[16px] h-[16px] flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full">
                                    {favoriteIds.length}
                                </span>
                            )}
                        </Link>
                        <button
                            type="button"
                            className="rounded-lg p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 animate-slide-up">
                        <div className="flex flex-col space-y-4">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`font-medium transition-colors px-2 ${
                                        isActive(item.href)
                                            ? 'text-primary-600 dark:text-primary-400'
                                            : 'text-gray-700 dark:text-gray-300'
                                    }`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <Link
                                to="/favoritos"
                                className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300 px-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Heart className="w-4 h-4" />
                                Favoritos {favoriteIds.length > 0 && `(${favoriteIds.length})`}
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    )
}
