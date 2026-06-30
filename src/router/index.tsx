import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Home } from '@/pages/Home'
import { Products } from '@/pages/Products'
import { ProductDetail } from '@/pages/ProductDetail'
import { Legal } from '@/pages/Legal'
import { Favorites } from '@/pages/Favorites'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: 'productos',
                element: <Products />,
            },
            {
                path: 'producto/:id',
                element: <ProductDetail />,
            },
            {
                path: 'favoritos',
                element: <Favorites />,
            },
            {
                path: 'legal',
                element: <Legal />,
            },
            {
                path: '*',
                element: <Navigate to="/" replace />,
            },
        ],
    },
])
