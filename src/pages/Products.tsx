import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, Tag, ChevronDown } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { ProductGrid } from '@/components/ProductGrid'
import { SearchAutocomplete } from '@/components/SearchAutocomplete'
import { SEO } from '@/components/SEO'
import type { FilterOptions } from '@/types'

const CATEGORIES = ['all', 'Tecnología', 'Hogar', 'Accesorios']

const DEFAULT_PRICE_RANGE = { minPrice: 0, maxPrice: 1000 }

const PRICE_RANGES = [
    { label: 'Todos los precios', minPrice: 0, maxPrice: 1000 },
    { label: 'Menos de 25€', minPrice: 0, maxPrice: 25 },
    { label: '25€ - 50€', minPrice: 25, maxPrice: 50 },
    { label: '50€ - 100€', minPrice: 50, maxPrice: 100 },
    { label: 'Más de 100€', minPrice: 100, maxPrice: 1000 },
]

const RATING_OPTIONS = [
    { label: 'Cualquier valoración', minRating: 0 },
    { label: '4★ o más', minRating: 4 },
    { label: '4.5★ o más', minRating: 4.5 },
]

export const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [showFilters, setShowFilters] = useState(false)

    const [filters, setFilters] = useState<Partial<FilterOptions>>({
        searchQuery: searchParams.get('search') || '',
        category: searchParams.get('category') || 'all',
        minPrice: 0,
        maxPrice: 1000,
        minRating: 0,
        sortBy: 'popular',
        onlyOnSale: searchParams.get('sale') === '1',
    })

    const { products, allProducts, loading } = useProducts(filters)

    const seo = useMemo(() => {
        const cat = filters.category !== 'all' ? filters.category : null
        const q = filters.searchQuery?.trim()
        const sale = filters.onlyOnSale

        if (q) {
            return {
                title: `Resultados para "${q}"`,
                description: `Encuentra los mejores productos relacionados con "${q}" en Amazon, seleccionados por BagoTech.`,
            }
        }
        if (cat && sale) {
            return {
                title: `${cat} en Oferta`,
                description: `Los mejores productos de ${cat.toLowerCase()} con descuento en Amazon. Ofertas seleccionadas por BagoTech.`,
            }
        }
        if (cat) {
            return {
                title: `Productos de ${cat}`,
                description: `Explora los mejores productos de ${cat.toLowerCase()} en Amazon, recomendados por BagoTech.`,
            }
        }
        if (sale) {
            return {
                title: 'Productos en Oferta',
                description: 'Los mejores productos con descuento en Amazon. Aprovecha las ofertas seleccionadas por BagoTech.',
            }
        }
        return {
            title: 'Todos los Productos',
            description: 'Explora nuestra colección completa de productos seleccionados en Amazon. Tecnología, hogar y accesorios.',
        }
    }, [filters.category, filters.searchQuery, filters.onlyOnSale])

    useEffect(() => {
        const params = new URLSearchParams()
        if (filters.searchQuery) params.set('search', filters.searchQuery)
        if (filters.category && filters.category !== 'all') params.set('category', filters.category)
        if (filters.onlyOnSale) params.set('sale', '1')
        setSearchParams(params)
    }, [filters.searchQuery, filters.category, filters.onlyOnSale, setSearchParams])

    const set = (patch: Partial<FilterOptions>) => setFilters((f) => ({ ...f, ...patch }))

    const isDefaultPriceRange =
        (filters.minPrice ?? 0) === DEFAULT_PRICE_RANGE.minPrice &&
        (filters.maxPrice ?? 1000) === DEFAULT_PRICE_RANGE.maxPrice

    const activeFilterCount = [
        filters.category !== 'all',
        filters.onlyOnSale,
        (filters.minRating ?? 0) > 0,
        !isDefaultPriceRange,
    ].filter(Boolean).length

    return (
        <div className="space-y-8">
            <SEO title={seo.title} description={seo.description} canonical="/productos" />

            {/* Header */}
            <div className="animate-fade-in">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {seo.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Explora nuestra colección completa de productos seleccionados
                </p>
            </div>

            {/* Filters Bar */}
            <div className="glass-effect rounded-xl p-6 space-y-4 animate-slide-up">

                {/* Row 1: Search + Sort + Mobile toggle */}
                <div className="flex flex-col md:flex-row gap-3">
                    <SearchAutocomplete
                        value={filters.searchQuery || ''}
                        onChange={(v) => set({ searchQuery: v })}
                        allProducts={allProducts}
                    />

                    <select
                        value={filters.sortBy}
                        onChange={(e) => set({ sortBy: e.target.value as FilterOptions['sortBy'] })}
                        className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    >
                        <option value="popular">Más Popular</option>
                        <option value="price-asc">Precio: Menor a Mayor</option>
                        <option value="price-desc">Precio: Mayor a Menor</option>
                        <option value="rating">Mejor Valorados</option>
                    </select>

                    {/* Mobile toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="md:hidden flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        <SlidersHorizontal className="w-5 h-5" />
                        Filtros
                        {activeFilterCount > 0 && (
                            <span className="min-w-[20px] h-5 flex items-center justify-center bg-primary-600 text-white text-xs font-bold rounded-full px-1">
                                {activeFilterCount}
                            </span>
                        )}
                        <ChevronDown
                            className="w-4 h-4 transition-transform duration-300"
                            style={{ transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        />
                    </button>
                </div>

                {/* Row 2: Categorías — desktop siempre visible, mobile animada */}
                <div className="hidden md:flex flex-wrap items-center gap-2">
                    <CategoryRow
                        categories={CATEGORIES}
                        selected={filters.category || 'all'}
                        onCategory={(c) => set({ category: c })}
                    />
                </div>

                {/* Row 3: Precio + Valoración + Solo en oferta */}
                <div className="hidden md:flex flex-wrap items-center gap-2">
                    <SecondaryFilters
                        minPrice={filters.minPrice ?? 0}
                        maxPrice={filters.maxPrice ?? 1000}
                        onPriceRange={(minPrice, maxPrice) => set({ minPrice, maxPrice })}
                        minRating={filters.minRating ?? 0}
                        onRating={(minRating) => set({ minRating })}
                        onlyOnSale={filters.onlyOnSale || false}
                        onToggleSale={() => set({ onlyOnSale: !filters.onlyOnSale })}
                    />
                </div>

                {/* Mobile: accordion con todos los filtros */}
                <div
                    className="md:hidden overflow-hidden"
                    style={{
                        maxHeight: showFilters ? '500px' : '0',
                        opacity: showFilters ? 1 : 0,
                        transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease',
                    }}
                >
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                        <CategoryRow
                            categories={CATEGORIES}
                            selected={filters.category || 'all'}
                            onCategory={(c) => set({ category: c })}
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                        <SecondaryFilters
                            minPrice={filters.minPrice ?? 0}
                            maxPrice={filters.maxPrice ?? 1000}
                            onPriceRange={(minPrice, maxPrice) => set({ minPrice, maxPrice })}
                            minRating={filters.minRating ?? 0}
                            onRating={(minRating) => set({ minRating })}
                            onlyOnSale={filters.onlyOnSale || false}
                            onToggleSale={() => set({ onlyOnSale: !filters.onlyOnSale })}
                        />
                    </div>
                </div>
            </div>

            {/* Results info */}
            <div className="flex items-center justify-between text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                    {loading ? (
                        'Cargando productos...'
                    ) : (
                        <>
                            <span className="font-semibold text-gray-900 dark:text-white">{products.length}</span>{' '}
                            {products.length === 1 ? 'producto encontrado' : 'productos encontrados'}
                        </>
                    )}
                </p>
                {activeFilterCount > 0 && (
                    <button
                        onClick={() =>
                            set({
                                category: 'all',
                                onlyOnSale: false,
                                minRating: 0,
                                searchQuery: '',
                                ...DEFAULT_PRICE_RANGE,
                            })
                        }
                        className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                    >
                        Limpiar filtros
                    </button>
                )}
            </div>

            {/* Products Grid */}
            <ProductGrid products={products} loading={loading} />
        </div>
    )
}

/* ── Sub-component: pills de categoría ───────────────────────── */
interface CategoryRowProps {
    categories: string[]
    selected: string
    onCategory: (c: string) => void
}

const CategoryRow = ({ categories, selected, onCategory }: CategoryRowProps) => (
    <>
        {categories.map((category) => (
            <button
                key={category}
                onClick={() => onCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 ${
                    selected === category
                        ? 'bg-primary-600 text-white shadow-md shadow-primary-200 dark:shadow-primary-900/40'
                        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-300 dark:border-gray-600'
                }`}
            >
                {category === 'all' ? 'Todas' : category}
            </button>
        ))}
    </>
)

/* ── Sub-component: precio, valoración y oferta ──────────────── */
interface SecondaryFiltersProps {
    minPrice: number
    maxPrice: number
    onPriceRange: (minPrice: number, maxPrice: number) => void
    minRating: number
    onRating: (minRating: number) => void
    onlyOnSale: boolean
    onToggleSale: () => void
}

const SecondaryFilters = ({
    minPrice,
    maxPrice,
    onPriceRange,
    minRating,
    onRating,
    onlyOnSale,
    onToggleSale,
}: SecondaryFiltersProps) => (
    <>
        <select
            value={`${minPrice}-${maxPrice}`}
            onChange={(e) => {
                const range = PRICE_RANGES.find((r) => `${r.minPrice}-${r.maxPrice}` === e.target.value)
                if (range) onPriceRange(range.minPrice, range.maxPrice)
            }}
            className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        >
            {PRICE_RANGES.map((r) => (
                <option key={r.label} value={`${r.minPrice}-${r.maxPrice}`}>
                    {r.label}
                </option>
            ))}
        </select>

        <select
            value={minRating}
            onChange={(e) => onRating(Number(e.target.value))}
            className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        >
            {RATING_OPTIONS.map((r) => (
                <option key={r.label} value={r.minRating}>
                    {r.label}
                </option>
            ))}
        </select>

        {/* Separator */}
        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden md:block" />

        {/* Solo en oferta toggle */}
        <button
            onClick={onToggleSale}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 ${
                onlyOnSale
                    ? 'bg-red-500 text-white shadow-md shadow-red-200 dark:shadow-red-900/40'
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 border border-gray-300 dark:border-gray-600'
            }`}
        >
            <Tag className="w-3.5 h-3.5" />
            Solo en oferta
        </button>
    </>
)
