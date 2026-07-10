import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, ShoppingCart, TrendingUp, Heart, Share2, Check } from 'lucide-react'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import type { Product } from '@/types'
import { generateAmazonLink, formatPrice, calculateDiscount } from '@/utils/affiliateLinks'
import { trackAffiliateClick } from '@/utils/analytics'
import { useAppContext } from '@/context/AppContext'
import { useToast } from '@/context/ToastContext'

interface ProductCardProps {
    product: Product
    onClick?: () => void
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null)
    const [tilt, setTilt] = useState({ x: 0, y: 0 })
    const [isHovered, setIsHovered] = useState(false)
    const [copied, setCopied] = useState(false)

    const navigate = useNavigate()
    const { isFavorite, toggleFavorite, addToRecent } = useAppContext()
    const { showToast } = useToast()
    const favorited = isFavorite(product.id)

    const handleCardClick = () => {
        onClick?.()
        navigate(`/producto/${product.id}`)
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current
        if (!card) return
        const rect = card.getBoundingClientRect()
        const rotateX = ((e.clientY - rect.top - rect.height / 2) / rect.height) * -10
        const rotateY = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 10
        setTilt({ x: rotateX, y: rotateY })
    }

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 })
        setIsHovered(false)
    }

    const handleAmazonClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        addToRecent(product.id)
        trackAffiliateClick(product)
        showToast({
            message: 'Abriendo en Amazon...',
            submessage: product.title.length > 48 ? product.title.slice(0, 48) + '…' : product.title,
            type: 'warning',
            duration: 2500,
        })
        window.open(generateAmazonLink(product.asin), '_blank', 'noopener,noreferrer')
    }

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        toggleFavorite(product.id)
    }

    const handleShare = async (e: React.MouseEvent) => {
        e.stopPropagation()
        const url = generateAmazonLink(product.asin)
        if (navigator.share) {
            try {
                await navigator.share({ title: product.title, url })
            } catch {
                // cancelled by user
            }
        } else {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const discount = product.originalPrice
        ? calculateDiscount(product.originalPrice, product.price)
        : 0

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={() => setIsHovered(true)}
            style={{
                transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${isHovered ? 'translateY(-4px)' : ''}`,
                transition: isHovered
                    ? 'transform 0.1s ease-out, box-shadow 0.3s ease'
                    : 'transform 0.4s ease-out, box-shadow 0.3s ease',
                boxShadow: isHovered ? '0 20px 40px -10px rgba(0,0,0,0.2)' : undefined,
            }}
            className="rounded-xl"
        >
            <Card
                hover
                className="group relative overflow-hidden animate-fade-in h-full"
                onClick={handleCardClick}
            >
                {/* Top-left badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    {product.isBestSeller && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500 text-white text-xs font-semibold shadow-lg">
                            <TrendingUp className="w-3 h-3" />
                            Best Seller
                        </span>
                    )}
                    {discount > 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-500 text-white text-xs font-semibold shadow-lg">
                            -{discount}%
                        </span>
                    )}
                </div>

                {/* Top-right actions */}
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                    {/* Favorite */}
                    <button
                        onClick={handleFavoriteClick}
                        className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-150"
                        aria-label={favorited ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                    >
                        <Heart
                            className="w-4 h-4 transition-colors duration-200"
                            style={{
                                color: favorited ? '#ef4444' : '#9ca3af',
                                fill: favorited ? '#ef4444' : 'none',
                                transform: favorited ? 'scale(1.15)' : 'scale(1)',
                                transition: 'transform 0.2s ease, color 0.2s ease, fill 0.2s ease',
                            }}
                        />
                    </button>

                    {/* Share */}
                    <button
                        onClick={handleShare}
                        className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-150"
                        aria-label="Compartir producto"
                    >
                        {copied ? (
                            <Check className="w-4 h-4 text-green-500" />
                        ) : (
                            <Share2 className="w-4 h-4 text-gray-400" />
                        )}
                    </button>
                </div>

                {/* Image */}
                <div className="relative h-48 mb-4 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                    <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>

                {/* Content */}
                <div className="space-y-3">
                    <span className="inline-block px-2 py-1 text-xs font-medium rounded-md bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300">
                        {product.category}
                    </span>

                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 min-h-[3rem]">
                        {product.title}
                    </h3>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                        i < Math.floor(product.rating)
                                            ? 'fill-amber-400 text-amber-400'
                                            : 'text-gray-300 dark:text-gray-600'
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {product.rating} ({product.reviewCount.toLocaleString()})
                        </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                            <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                {formatPrice(product.originalPrice)}
                            </span>
                        )}
                    </div>

                    <Button
                        variant="primary"
                        size="md"
                        className="w-full active:scale-95"
                        onClick={handleAmazonClick}
                    >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Ver en Amazon
                    </Button>
                </div>
            </Card>
        </div>
    )
}
