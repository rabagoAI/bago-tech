export interface Product {
    id: string
    title: string
    description: string
    price: number
    originalPrice?: number
    rating: number
    reviewCount: number
    category: string
    imageUrl: string
    asin: string
    features?: string[]
    specifications?: Record<string, string>
    isFeatured?: boolean
    isBestSeller?: boolean
}

export interface Category {
    id: string
    name: string
    slug: string
    icon?: string
}

export interface FilterOptions {
    searchQuery: string
    category: string
    minPrice: number
    maxPrice: number
    minRating: number
    sortBy: 'price-asc' | 'price-desc' | 'rating' | 'popular'
    onlyOnSale: boolean
}

export interface AnalyticsEvent {
    eventName: string
    eventParams?: Record<string, string | number | boolean>
}
