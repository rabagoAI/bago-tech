import { useState, useEffect, useMemo } from 'react'
import type { Product, FilterOptions } from '@/types'
import productsData from '@/data/products.json'

export const useProducts = (filters?: Partial<FilterOptions>) => {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Simular carga de datos (en el futuro puede ser desde Firebase)
        const loadProducts = async () => {
            try {
                setLoading(true)
                // Simular delay de red
                await new Promise((resolve) => setTimeout(resolve, 300))
                setProducts(productsData as Product[])
                setError(null)
            } catch (err) {
                setError('Error al cargar productos')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        loadProducts()
    }, [])

    // Filtrar y ordenar productos
    const filteredProducts = useMemo(() => {
        if (!filters) return products

        let result = [...products]

        // Filtrar por búsqueda
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase()
            result = result.filter(
                (p) =>
                    p.title.toLowerCase().includes(query) ||
                    p.description.toLowerCase().includes(query)
            )
        }

        // Filtrar por categoría
        if (filters.category && filters.category !== 'all') {
            result = result.filter((p) => p.category === filters.category)
        }

        // Filtrar por precio
        if (filters.minPrice !== undefined) {
            result = result.filter((p) => p.price >= filters.minPrice!)
        }
        if (filters.maxPrice !== undefined) {
            result = result.filter((p) => p.price <= filters.maxPrice!)
        }

        // Filtrar por rating
        if (filters.minRating !== undefined) {
            result = result.filter((p) => p.rating >= filters.minRating!)
        }

        // Solo en oferta
        if (filters.onlyOnSale) {
            result = result.filter((p) => p.originalPrice !== undefined && p.originalPrice > p.price)
        }

        // Ordenar
        if (filters.sortBy) {
            switch (filters.sortBy) {
                case 'price-asc':
                    result.sort((a, b) => a.price - b.price)
                    break
                case 'price-desc':
                    result.sort((a, b) => b.price - a.price)
                    break
                case 'rating':
                    result.sort((a, b) => b.rating - a.rating)
                    break
                case 'popular':
                    result.sort((a, b) => b.reviewCount - a.reviewCount)
                    break
            }
        }

        return result
    }, [products, filters])

    return {
        products: filteredProducts,
        allProducts: products,
        loading,
        error,
    }
}
