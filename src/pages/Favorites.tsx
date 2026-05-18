import { Link } from 'react-router-dom'
import { Heart, ArrowRight } from 'lucide-react'
import { useAppContext } from '@/context/AppContext'
import { useProducts } from '@/hooks/useProducts'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { ProductGrid } from '@/components/ProductGrid'
import { Button } from '@/components/ui/Button'
import { SEO } from '@/components/SEO'

export const Favorites = () => {
    const { favoriteIds } = useAppContext()
    const { products, loading } = useProducts()
    const headerReveal = useScrollReveal(0)

    const favoriteProducts = products.filter((p) => favoriteIds.includes(p.id))

    return (
        <div className="space-y-10">
            <SEO
                title="Mis Favoritos"
                description="Tus productos favoritos guardados en BagoTech."
                canonical="/favoritos"
                noindex
            />
            <section
                ref={headerReveal.ref}
                className={`reveal ${headerReveal.isVisible ? 'visible' : ''}`}
            >
                <div className="flex items-center gap-3 mb-2">
                    <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                        Mis Favoritos
                    </h1>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                    {favoriteIds.length === 0
                        ? 'Todavía no has guardado ningún producto.'
                        : `${favoriteIds.length} producto${favoriteIds.length > 1 ? 's' : ''} guardado${favoriteIds.length > 1 ? 's' : ''}`}
                </p>
            </section>

            {favoriteIds.length === 0 ? (
                <div className="glass-effect rounded-3xl p-16 text-center">
                    <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
                    <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Aún no tienes favoritos
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                        Pulsa el corazón en cualquier producto para guardarlo aquí y encontrarlo rápidamente.
                    </p>
                    <Link to="/productos">
                        <Button variant="primary" size="lg">
                            Explorar Productos
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            ) : (
                <ProductGrid products={favoriteProducts} loading={loading} />
            )}
        </div>
    )
}
