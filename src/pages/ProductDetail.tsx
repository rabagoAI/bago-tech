import { useEffect, useMemo, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
    Star,
    ShoppingCart,
    TrendingUp,
    Heart,
    Share2,
    ChevronRight,
    ArrowLeft,
    Check,
    ShieldCheck,
} from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { useAppContext } from '@/context/AppContext'
import { useToast } from '@/context/ToastContext'
import { ProductGrid } from '@/components/ProductGrid'
import { Button } from '@/components/ui/Button'
import { SEO } from '@/components/SEO'
import { generateAmazonLink, formatPrice, calculateDiscount } from '@/utils/affiliateLinks'
import { trackAffiliateClick, trackProductView } from '@/utils/analytics'
import { SITE_URL } from '@/config/site'

export const ProductDetail = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { allProducts, loading } = useProducts()
    const { isFavorite, toggleFavorite, addToRecent } = useAppContext()
    const { showToast } = useToast()
    const [copied, setCopied] = useState(false)

    const product = useMemo(
        () => allProducts.find((p) => p.id === id),
        [allProducts, id]
    )

    const related = useMemo(() => {
        if (!product) return []
        return allProducts
            .filter((p) => p.category === product.category && p.id !== product.id)
            .slice(0, 4)
    }, [allProducts, product])

    // Scroll al inicio y registrar vista / historial al cargar el producto
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [id])

    useEffect(() => {
        if (product) {
            addToRecent(product.id)
            trackProductView(product.id, product.title)
        }
    }, [product?.id])

    // Estado de carga
    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            </div>
        )
    }

    // Producto no encontrado
    if (!product) {
        return (
            <div className="text-center py-24">
                <SEO title="Producto no encontrado" noindex />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Producto no encontrado
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    El producto que buscas no existe o ha sido retirado.
                </p>
                <Link to="/productos">
                    <Button variant="primary" size="lg">
                        Ver todos los productos
                    </Button>
                </Link>
            </div>
        )
    }

    const favorited = isFavorite(product.id)
    const discount = product.originalPrice
        ? calculateDiscount(product.originalPrice, product.price)
        : 0

    const handleAmazonClick = () => {
        addToRecent(product.id)
        trackAffiliateClick(product.id, product.title)
        showToast({
            message: 'Abriendo en Amazon...',
            submessage: product.title.length > 48 ? product.title.slice(0, 48) + '…' : product.title,
            type: 'warning',
            duration: 2500,
        })
        window.open(generateAmazonLink(product.asin), '_blank', 'noopener,noreferrer')
    }

    const handleShare = async () => {
        const url = generateAmazonLink(product.asin)
        if (navigator.share) {
            try {
                await navigator.share({ title: product.title, url })
            } catch {
                // cancelado por el usuario
            }
        } else {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    // Datos estructurados para SEO (rich results de Google)
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        image: product.imageUrl,
        description: product.description,
        sku: product.asin,
        category: product.category,
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
        },
        offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            url: `${SITE_URL}/producto/${product.id}`,
        },
    }

    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Productos', item: `${SITE_URL}/productos` },
            {
                '@type': 'ListItem',
                position: 3,
                name: product.category,
                item: `${SITE_URL}/productos?category=${encodeURIComponent(product.category)}`,
            },
            {
                '@type': 'ListItem',
                position: 4,
                name: product.title,
                item: `${SITE_URL}/producto/${product.id}`,
            },
        ],
    }

    return (
        <div className="space-y-12">
            <SEO
                title={product.title}
                description={product.description}
                canonical={`/producto/${product.id}`}
            />
            <Helmet>
                <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
                <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
            </Helmet>

            {/* Breadcrumb */}
            <nav className="flex items-center flex-wrap gap-1 text-sm text-gray-500 dark:text-gray-400 animate-fade-in">
                <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    Inicio
                </Link>
                <ChevronRight className="w-4 h-4" />
                <Link to="/productos" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    Productos
                </Link>
                <ChevronRight className="w-4 h-4" />
                <Link
                    to={`/productos?category=${product.category}`}
                    className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                    {product.category}
                </Link>
            </nav>

            {/* Botón volver */}
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors -mt-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Volver
            </button>

            {/* Bloque principal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-slide-up">
                {/* Imagen */}
                <div className="relative">
                    <div className="sticky top-24 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-8 overflow-hidden">
                        {/* Badges */}
                        <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                            {product.isBestSeller && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-semibold shadow-lg">
                                    <TrendingUp className="w-3 h-3" />
                                    Best Seller
                                </span>
                            )}
                            {discount > 0 && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-500 text-white text-xs font-semibold shadow-lg">
                                    -{discount}%
                                </span>
                            )}
                        </div>
                        <img
                            src={product.imageUrl}
                            alt={product.title}
                            className="w-full h-auto max-h-[480px] object-contain mx-auto"
                        />
                    </div>
                </div>

                {/* Información */}
                <div className="space-y-6">
                    <span className="inline-block px-3 py-1 text-xs font-medium rounded-md bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300">
                        {product.category}
                    </span>

                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                        {product.title}
                    </h1>

                    {/* Valoración */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-5 h-5 ${
                                        i < Math.floor(product.rating)
                                            ? 'fill-amber-400 text-amber-400'
                                            : 'text-gray-300 dark:text-gray-600'
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {product.rating} · {product.reviewCount.toLocaleString()} valoraciones
                        </span>
                    </div>

                    {/* Precio */}
                    <div className="flex items-baseline gap-3 flex-wrap">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                            {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                            <>
                                <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                                    {formatPrice(product.originalPrice)}
                                </span>
                                <span className="text-sm font-semibold text-red-500">
                                    Ahorras {formatPrice(product.originalPrice - product.price)}
                                </span>
                            </>
                        )}
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {product.description}
                    </p>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            variant="primary"
                            size="lg"
                            className="flex-1 active:scale-95"
                            onClick={handleAmazonClick}
                        >
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Ver en Amazon
                        </Button>

                        <button
                            onClick={() => toggleFavorite(product.id)}
                            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors active:scale-95"
                            aria-label={favorited ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                        >
                            <Heart
                                className="w-5 h-5"
                                style={{
                                    color: favorited ? '#ef4444' : 'currentColor',
                                    fill: favorited ? '#ef4444' : 'none',
                                }}
                            />
                            {favorited ? 'Guardado' : 'Guardar'}
                        </button>

                        <button
                            onClick={handleShare}
                            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors active:scale-95"
                            aria-label="Compartir producto"
                        >
                            {copied ? (
                                <Check className="w-5 h-5 text-green-500" />
                            ) : (
                                <Share2 className="w-5 h-5" />
                            )}
                            {copied ? 'Copiado' : 'Compartir'}
                        </button>
                    </div>

                    {/* Aviso de afiliado */}
                    <p className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        Como Afiliado de Amazon, BagoTech obtiene ingresos por las compras
                        adscritas que cumplen los requisitos. El precio para ti no cambia.
                    </p>

                    {/* Características */}
                    {product.features && product.features.length > 0 && (
                        <div className="pt-4">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Características principales
                            </h2>
                            <ul className="space-y-3">
                                {product.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Productos relacionados */}
            {related.length > 0 && (
                <section className="pt-8 border-t border-gray-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                        También te puede interesar
                    </h2>
                    <ProductGrid products={related} loading={false} />
                </section>
            )}
        </div>
    )
}
