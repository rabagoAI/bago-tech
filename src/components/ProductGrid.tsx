import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'
import type { Product } from '@/types'
import { ProductCard } from './ProductCard'
import { LoadingSkeleton } from './ui/LoadingSkeleton'

interface ProductGridProps {
    products: Product[]
    loading?: boolean
    onProductClick?: (product: Product) => void
}

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            delay: i * 0.07,
            ease: 'easeOut',
        },
    }),
}

export const ProductGrid = ({ products, loading, onProductClick }: ProductGridProps) => {
    if (loading) return <LoadingSkeleton />

    if (products.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-xl text-gray-600 dark:text-gray-400">
                    No se encontraron productos
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
                {products.map((product, i) => (
                    <motion.div
                        key={product.id}
                        custom={i}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
                        layout
                    >
                        <ProductCard
                            product={product}
                            onClick={() => onProductClick?.(product)}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}
