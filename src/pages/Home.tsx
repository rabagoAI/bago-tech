import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp, Sparkles, Zap, Shield, Star, Clock, Tag } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useAppContext } from '@/context/AppContext'
import { ProductGrid } from '@/components/ProductGrid'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { SEO } from '@/components/SEO'
import { calculateDiscount } from '@/utils/affiliateLinks'

const ROTATING_WORDS = ['Tecnología', 'Innovación', 'Calidad', 'Ofertas']

interface StatConfig {
    label: string
    target: number
    decimals?: number
    prefix?: string
    suffix?: string
}

const STATS: StatConfig[] = [
    { label: 'Productos', target: 500, suffix: '+' },
    { label: 'Valoración media', target: 4.7, decimals: 1, suffix: ' ⭐' },
    { label: 'Categorías', target: 3 },
    { label: 'Ofertas activas', target: 120, suffix: '+' },
]

const AnimatedStat = ({ stat, isActive, delay }: { stat: StatConfig; isActive: boolean; delay: number }) => {
    const [value, setValue] = useState(0)
    const rafRef = useRef<number>(0)

    useEffect(() => {
        if (!isActive) return
        const duration = 1400
        const startTime = performance.now()

        const tick = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(stat.target * eased)
            if (progress < 1) rafRef.current = requestAnimationFrame(tick)
        }

        const timer = setTimeout(() => {
            rafRef.current = requestAnimationFrame(tick)
        }, delay)

        return () => {
            clearTimeout(timer)
            cancelAnimationFrame(rafRef.current)
        }
    }, [isActive, stat.target, delay])

    const display = stat.decimals
        ? value.toFixed(stat.decimals)
        : Math.floor(value).toString()

    return (
        <span>
            {stat.prefix ?? ''}{display}{stat.suffix ?? ''}
        </span>
    )
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    'Tecnología': <Zap className="w-10 h-10 text-primary-500" />,
    'Hogar': <Shield className="w-10 h-10 text-accent-500" />,
    'Accesorios': <Star className="w-10 h-10 text-amber-500" />,
}

export const Home = () => {
    const { products, loading } = useProducts()
    const { recentIds } = useAppContext()

    const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4)
    const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4)
    const dealProducts = products
        .filter((p) => p.originalPrice && p.originalPrice > p.price)
        .sort((a, b) => calculateDiscount(b.originalPrice!, b.price) - calculateDiscount(a.originalPrice!, a.price))
        .slice(0, 4)
    const recentProducts = recentIds
        .map((id) => products.find((p) => p.id === id))
        .filter(Boolean) as typeof products

    // Typewriter / word rotator
    const [wordIndex, setWordIndex] = useState(0)
    const [wordVisible, setWordVisible] = useState(true)

    useEffect(() => {
        const cycle = setInterval(() => {
            setWordVisible(false)
            setTimeout(() => {
                setWordIndex((i) => (i + 1) % ROTATING_WORDS.length)
                setWordVisible(true)
            }, 300)
        }, 2200)
        return () => clearInterval(cycle)
    }, [])

    // Scroll reveal refs
    const heroReveal = useScrollReveal(0)
    const featuredReveal = useScrollReveal()
    const dealsReveal = useScrollReveal()
    const bestSellersReveal = useScrollReveal()
    const categoriesReveal = useScrollReveal()
    const statsReveal = useScrollReveal()
    const recentReveal = useScrollReveal()

    return (
        <div className="space-y-20">
            <SEO
                title="Inicio"
                description="Descubre los mejores productos tech en Amazon con ofertas exclusivas y recomendaciones curadas por BagoTech."
                canonical="/"
            />

            {/* Hero Section */}
            <section
                ref={heroReveal.ref}
                className={`relative overflow-hidden rounded-3xl glass-effect p-8 md:p-16 reveal ${heroReveal.isVisible ? 'visible' : ''}`}
            >
                <div className="relative z-10 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6 animate-fade-in">
                        <Sparkles className="w-4 h-4 animate-pulse-slow" />
                        Ofertas Exclusivas Amazon
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-3 text-balance leading-tight">
                        Descubre la Mejor{' '}
                        <span
                            className="gradient-text inline-block"
                            style={{
                                opacity: wordVisible ? 1 : 0,
                                transform: wordVisible ? 'translateY(0)' : 'translateY(8px)',
                                transition: 'opacity 0.3s ease, transform 0.3s ease',
                            }}
                        >
                            {ROTATING_WORDS[wordIndex]}
                        </span>
                    </h1>
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 text-balance">
                        en Amazon
                    </h2>

                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 text-balance">
                        Recomendaciones curadas, ofertas increíbles y productos de calidad seleccionados
                        especialmente para ti por{' '}
                        <span className="gradient-text font-semibold">BagoTech</span>.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Link to="/productos">
                            <Button size="lg" variant="primary">
                                Ver Todos los Productos
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Link to="/productos?category=Tecnología">
                            <Button size="lg" variant="outline">
                                <Zap className="mr-2 w-5 h-5" />
                                Solo Tech
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-400/20 to-accent-400/20 rounded-full blur-3xl -z-0 animate-pulse-slow" />
                <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-gradient-to-br from-accent-400/10 to-primary-400/10 rounded-full blur-3xl -z-0 animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
            </section>

            {/* Stats strip */}
            <section
                ref={statsReveal.ref}
                className={`reveal ${statsReveal.isVisible ? 'visible' : ''}`}
            >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {STATS.map((stat, i) => (
                        <div
                            key={stat.label}
                            className="glass-effect rounded-2xl p-6 text-center"
                            style={{
                                opacity: statsReveal.isVisible ? 1 : 0,
                                transform: statsReveal.isVisible ? 'translateY(0)' : 'translateY(24px)',
                                transition: `opacity 0.6s ease ${i * 120}ms, transform 0.6s ease ${i * 120}ms`,
                            }}
                        >
                            <div className="text-3xl font-bold gradient-text mb-1">
                                <AnimatedStat stat={stat} isActive={statsReveal.isVisible} delay={i * 120} />
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            {featuredProducts.length > 0 && (
                <section
                    ref={featuredReveal.ref}
                    className={`reveal ${featuredReveal.isVisible ? 'visible' : ''}`}
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Productos Destacados
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Nuestras mejores recomendaciones para ti
                            </p>
                        </div>
                        <Link to="/productos">
                            <Button variant="outline">
                                Ver Todos
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                    <ProductGrid products={featuredProducts} loading={loading} />
                </section>
            )}

            {/* Ofertas Especiales */}
            {dealProducts.length > 0 && (
                <section
                    ref={dealsReveal.ref}
                    className={`reveal ${dealsReveal.isVisible ? 'visible' : ''}`}
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <Tag className="w-8 h-8 text-red-500" />
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    Ofertas Especiales
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Los mayores descuentos seleccionados para ti
                                </p>
                            </div>
                        </div>
                        <Link to="/productos?sale=1">
                            <Button variant="outline">
                                Ver Todas
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                    <ProductGrid products={dealProducts} loading={loading} />
                </section>
            )}

            {/* Best Sellers */}
            {bestSellers.length > 0 && (
                <section
                    ref={bestSellersReveal.ref}
                    className={`reveal ${bestSellersReveal.isVisible ? 'visible' : ''}`}
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="w-8 h-8 text-amber-500" />
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    Los Más Vendidos
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Productos favoritos de nuestros usuarios
                                </p>
                            </div>
                        </div>
                    </div>
                    <ProductGrid products={bestSellers} loading={loading} />
                </section>
            )}

            {/* Categories Preview */}
            <section
                ref={categoriesReveal.ref}
                className={`reveal ${categoriesReveal.isVisible ? 'visible' : ''}`}
            >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    Explora por Categoría
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['Tecnología', 'Hogar', 'Accesorios'].map((category, i) => (
                        <Link key={category} to={`/productos?category=${category}`}>
                            <div
                                style={{
                                    opacity: categoriesReveal.isVisible ? 1 : 0,
                                    transform: categoriesReveal.isVisible ? 'translateY(0)' : 'translateY(24px)',
                                    transition: `opacity 0.6s ease ${i * 150}ms, transform 0.6s ease ${i * 150}ms`,
                                }}
                            >
                                <Card hover glass className="text-center p-8 group">
                                    <div className="flex justify-center mb-4 group-hover:animate-float">
                                        {CATEGORY_ICONS[category]}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        {category}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        Descubre productos de {category.toLowerCase()}
                                    </p>
                                    <Button variant="ghost" size="sm">
                                        Ver Categoría
                                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Card>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Vistos recientemente */}
            {recentProducts.length > 0 && (
                <section
                    ref={recentReveal.ref}
                    className={`reveal ${recentReveal.isVisible ? 'visible' : ''}`}
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <Clock className="w-7 h-7 text-gray-400" />
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    Vistos Recientemente
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Continúa donde lo dejaste
                                </p>
                            </div>
                        </div>
                    </div>
                    <ProductGrid products={recentProducts} loading={false} />
                </section>
            )}
        </div>
    )
}
