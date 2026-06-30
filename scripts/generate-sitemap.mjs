/**
 * Genera public/sitemap.xml a partir de las rutas estáticas y de los productos
 * de src/data/products.json. Se ejecuta automáticamente antes de cada build
 * (script "prebuild" en package.json), por lo que el sitemap siempre está
 * sincronizado con el catálogo.
 *
 * Dominio definido en SITE_URL (debe coincidir con src/config/site.ts).
 * Al comprar un dominio propio, cámbialo aquí, en src/config/site.ts,
 * en public/robots.txt y en index.html.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const SITE_URL = 'https://bago-tech.vercel.app'

const products = JSON.parse(
    readFileSync(resolve(root, 'src/data/products.json'), 'utf-8')
)

// Rutas estáticas indexables (favoritos se omite: es privada/noindex)
const staticRoutes = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/productos', priority: '0.9', changefreq: 'daily' },
    { path: '/legal', priority: '0.3', changefreq: 'yearly' },
]

// Una entrada por ficha de producto
const productRoutes = products.map((p) => ({
    path: `/producto/${p.id}`,
    priority: '0.8',
    changefreq: 'weekly',
}))

const today = new Date().toISOString().split('T')[0]
const routes = [...staticRoutes, ...productRoutes]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
    .map(
        (r) => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
    )
    .join('\n')}
</urlset>
`

mkdirSync(resolve(root, 'public'), { recursive: true })
writeFileSync(resolve(root, 'public/sitemap.xml'), xml, 'utf-8')
console.log(`✓ sitemap.xml generado con ${routes.length} URLs`)
