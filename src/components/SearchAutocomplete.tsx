import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import type { Product } from '@/types'
import { formatPrice } from '@/utils/affiliateLinks'

interface SearchAutocompleteProps {
    value: string
    onChange: (value: string) => void
    allProducts: Product[]
}

export const SearchAutocomplete = ({ value, onChange, allProducts }: SearchAutocompleteProps) => {
    const [open, setOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const suggestions =
        value.trim().length >= 1
            ? allProducts
                  .filter(
                      (p) =>
                          p.title.toLowerCase().includes(value.toLowerCase()) ||
                          p.category.toLowerCase().includes(value.toLowerCase())
                  )
                  .slice(0, 6)
            : []

    const showDropdown = open && suggestions.length > 0

    useEffect(() => {
        setActiveIndex(-1)
    }, [value])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showDropdown) return
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1))
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActiveIndex((i) => Math.max(i - 1, -1))
        } else if (e.key === 'Enter' && activeIndex >= 0) {
            e.preventDefault()
            onChange(suggestions[activeIndex].title)
            setOpen(false)
        } else if (e.key === 'Escape') {
            setOpen(false)
            inputRef.current?.blur()
        }
    }

    const handleSelect = (product: Product) => {
        onChange(product.title)
        setOpen(false)
        inputRef.current?.focus()
    }

    const highlight = (text: string) => {
        if (!value.trim()) return text
        const idx = text.toLowerCase().indexOf(value.toLowerCase())
        if (idx === -1) return text
        return (
            <>
                {text.slice(0, idx)}
                <mark className="bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded px-0.5">
                    {text.slice(idx, idx + value.length)}
                </mark>
                {text.slice(idx + value.length)}
            </>
        )
    }

    return (
        <div ref={containerRef} className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
            <input
                ref={inputRef}
                type="text"
                placeholder="Buscar productos..."
                value={value}
                autoComplete="off"
                onChange={(e) => {
                    onChange(e.target.value)
                    setOpen(true)
                }}
                onFocus={() => setOpen(true)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            {value && (
                <button
                    onClick={() => {
                        onChange('')
                        inputRef.current?.focus()
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    aria-label="Limpiar búsqueda"
                >
                    <X className="w-4 h-4" />
                </button>
            )}

            {/* Dropdown */}
            {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-scale-in origin-top">
                    {suggestions.map((product, index) => (
                        <button
                            key={product.id}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleSelect(product)}
                            onMouseEnter={() => setActiveIndex(index)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                                index === activeIndex
                                    ? 'bg-primary-50 dark:bg-primary-900/30'
                                    : 'hover:bg-gray-50 dark:hover:bg-slate-700/50'
                            } ${index < suggestions.length - 1 ? 'border-b border-gray-100 dark:border-slate-700/50' : ''}`}
                        >
                            <img
                                src={product.imageUrl}
                                alt=""
                                className="w-10 h-10 object-cover rounded-lg flex-shrink-0 bg-gray-100 dark:bg-slate-700"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {highlight(product.title)}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs px-1.5 py-0.5 rounded bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400">
                                        {product.category}
                                    </span>
                                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                        {formatPrice(product.price)}
                                    </span>
                                    {product.originalPrice && (
                                        <span className="text-xs text-red-500 font-medium">
                                            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                        </span>
                                    )}
                                </div>
                            </div>
                            <span className="text-xs text-gray-400 flex-shrink-0">↵</span>
                        </button>
                    ))}
                    <div className="px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-700/50">
                        <p className="text-xs text-gray-400">
                            {suggestions.length} resultado{suggestions.length !== 1 ? 's' : ''} · Usa ↑↓ para navegar
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
