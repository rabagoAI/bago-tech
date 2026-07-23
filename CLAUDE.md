# BagoTech — Guía del proyecto

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework UI | React 18 + TypeScript |
| Bundler | Vite 5 |
| Estilos | Tailwind CSS 3 (dark mode via clase) |
| Animaciones | Framer Motion + CSS keyframes propios |
| Routing | React Router DOM 6 (SPA, client-side) |
| SEO | react-helmet-async |
| Iconos | Lucide React |
| Componentes accesibles | Headless UI |
| Despliegue | Vercel (rewrites configurados en `vercel.json`) |

## Comandos habituales

```bash
npm run dev        # servidor de desarrollo (localhost:5173)
npm run build      # compilación TypeScript + bundle de producción
npm run preview    # previsualiza el build en local
npm run lint       # ESLint con reglas TypeScript + React Hooks
npm run format     # Prettier sobre src/**/*.{ts,tsx,css}
```

## Arquitectura de carpetas

```
src/
├── components/
│   ├── ui/               # Átomos reutilizables: Button, Card, LoadingSkeleton, Modal
│   ├── Header.tsx        # Navegación sticky con badge de favoritos
│   ├── Footer.tsx        # Pie de página con disclaimer de afiliado
│   ├── Layout.tsx        # Shell: Header + Outlet animado + Footer + ToastContainer
│   ├── ProductCard.tsx   # Card individual: 3D tilt, favorito, compartir, toast
│   ├── ProductGrid.tsx   # Grid con stagger de Framer Motion
│   ├── SearchAutocomplete.tsx  # Buscador con dropdown de sugerencias
│   ├── SEO.tsx           # Helmet wrapper para meta tags dinámicos
│   └── ToastContainer.tsx      # Portal de notificaciones (bottom-right)
├── context/
│   ├── AppContext.tsx     # Favoritos + historial reciente (localStorage)
│   └── ToastContext.tsx   # Sistema de toasts global
├── data/
│   └── products.json     # Catálogo de productos — AQUÍ se añaden productos nuevos
├── hooks/
│   ├── useAnalytics.ts   # Tracking GA4 por ruta
│   ├── useProducts.ts    # Carga, filtrado y ordenación del catálogo
│   └── useScrollReveal.ts # IntersectionObserver con callback ref
├── pages/
│   ├── Home.tsx          # Hero, stats, destacados, más vendidos, categorías
│   ├── Products.tsx      # Catálogo completo con filtros y autocompletado
│   ├── ProductDetail.tsx # Ficha individual (/producto/:id): features, CTA, relacionados, JSON-LD
│   ├── Favorites.tsx     # Productos guardados (localStorage)
│   └── Legal.tsx         # Aviso de afiliado, privacidad, cookies
├── config/
│   └── site.ts           # SITE_URL: fuente única del dominio (canonical, OG, JSON-LD)
├── router/index.tsx      # Definición de rutas
├── types/index.ts        # Interfaces TypeScript compartidas
└── utils/
    ├── affiliateLinks.ts # Generador de URLs de afiliado Amazon
    └── analytics.ts      # Eventos GA4

scripts/
└── generate-sitemap.mjs  # Genera public/sitemap.xml desde products.json (corre en "prebuild")

public/
├── robots.txt            # Permite rastreo + apunta al sitemap
└── sitemap.xml           # Generado automáticamente (no editar a mano)
```

## Dominio y SEO

- **Dominio de producción actual:** `https://bago-tech.vercel.app` (provisional; se comprará un dominio propio si hay tráfico).
- **URL centralizada** en `src/config/site.ts` (`SITE_URL`). Al cambiar de dominio, actualizar en **4 sitios**: `src/config/site.ts`, `scripts/generate-sitemap.mjs`, `public/robots.txt` e `index.html`.
- **Sitemap:** se regenera solo en cada `npm run build` (script `prebuild`), también en Vercel. Incluye home, /productos, /legal y una entrada por producto.
- **Datos estructurados (JSON-LD):** `Organization` + `WebSite` (en `index.html`), `Product` (estrellas/precio) y `BreadcrumbList` (en `ProductDetail.tsx`). Se inyectan vía react-helmet (renderizado en cliente).
- **Pendiente SEO:** falta `public/og-image.jpg` (referenciada en `index.html` pero no existe). Registrar la web en Google Search Console y enviar el sitemap.

## Variables de entorno

Crea un archivo `.env.local` en la raíz con:

```env
VITE_AMAZON_TAG=bagotech-21          # Tu tag de afiliado de Amazon
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXX   # Opcional: ID de Google Analytics 4
```

Sin `VITE_AMAZON_TAG`, los enlaces usan `bagotech-21` como fallback.

---

## Cómo añadir productos nuevos

Todos los productos viven en `src/data/products.json`. Es un array de objetos JSON. Para añadir uno nuevo:

### 1. Obtén el ASIN del producto en Amazon

El ASIN es el código de 10 caracteres que aparece en la URL de Amazon:
```
https://www.amazon.es/dp/B0F638Z1FQ  →  ASIN = B0F638Z1FQ
```

### 2. Consigue la URL de la imagen

En la página del producto en Amazon, haz clic derecho en la imagen principal → "Copiar dirección de imagen". Tiene este formato:
```
https://m.media-amazon.com/images/I/81ubV8HiwaL._AC_SL1500_.jpg
```
También puedes usar una URL de Unsplash u otra imagen pública.

### 3. Añade el objeto al array en `products.json`

Copia esta plantilla y rellena los campos:

```json
{
    "id": "9",
    "title": "Nombre del producto tal como aparece en Amazon",
    "description": "Descripción breve del producto (1-2 frases).",
    "price": 49.99,
    "originalPrice": 79.99,
    "rating": 4.5,
    "reviewCount": 1234,
    "category": "Tecnología",
    "imageUrl": "https://m.media-amazon.com/images/I/XXXXXXXX._AC_SL1500_.jpg",
    "asin": "B0XXXXXXXX",
    "features": [
        "Primera característica clave",
        "Segunda característica clave",
        "Tercera característica clave"
    ],
    "isFeatured": false,
    "isBestSeller": false
}
```

### Referencia de campos

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | string | Sí | Número único. Usa el siguiente al último que haya en el array |
| `title` | string | Sí | Nombre del producto. Se muestra en la card y en el autocompletado |
| `description` | string | Sí | Descripción breve. Se usa en el filtro de búsqueda |
| `price` | number | Sí | Precio actual en euros (sin símbolo) |
| `originalPrice` | number | No | Precio original antes del descuento. Si se omite, no aparece tachado ni badge de % |
| `rating` | number | Sí | Valoración de 0 a 5 con un decimal (ej. `4.5`) |
| `reviewCount` | number | Sí | Número de valoraciones en Amazon |
| `category` | string | Sí | Debe ser exactamente una de: `"Tecnología"`, `"Hogar"`, `"Accesorios"` |
| `imageUrl` | string | Sí | URL pública de la imagen del producto |
| `asin` | string | Sí | Código ASIN de Amazon (10 caracteres). Genera el enlace de afiliado |
| `features` | string[] | No | Lista de características. Se muestran si se implementa página de detalle |
| `isFeatured` | boolean | No | `true` → aparece en "Productos Destacados" en la Home |
| `isBestSeller` | boolean | No | `true` → aparece en "Los Más Vendidos" y muestra badge amarillo |

### Reglas de negocio

- **Descuento**: se calcula automáticamente si `originalPrice > price`. El badge rojo `-%` aparece solo en ese caso.
- **Home — Destacados**: muestra hasta 4 productos con `isFeatured: true`, por orden de aparición en el JSON.
- **Home — Más vendidos**: muestra hasta 4 productos con `isBestSeller: true`, por orden de aparición en el JSON.
- **`id` único**: si dos productos tienen el mismo `id`, React mostrará warnings y el comportamiento de favoritos/historial será incorrecto.
- **Categorías**: si añades una categoría nueva que no sea las tres existentes, no aparecerá en los filtros de Productos ni en los bloques de la Home sin modificar el código.

### Añadir una categoría nueva (opcional)

Si quieres añadir una cuarta categoría (ej. `"Deporte"`):

1. **`src/pages/Products.tsx`** — añade la categoría al array `CATEGORIES`:
   ```ts
   const CATEGORIES = ['all', 'Tecnología', 'Hogar', 'Accesorios', 'Deporte']
   ```

2. **`src/pages/Home.tsx`** — añade el icono y el bloque en la sección "Explora por Categoría":
   ```ts
   const CATEGORY_ICONS = {
       'Tecnología': <Zap ... />,
       'Hogar': <Shield ... />,
       'Accesorios': <Star ... />,
       'Deporte': <Activity ... />,   // icono de Lucide
   }
   ```
   Y añade `'Deporte'` al array de categorías del `.map()`.

---

## Subida de productos: skill `/add-product`

Existe una skill propia en `.claude/skills/add-product/SKILL.md` que automatiza añadir productos al catálogo. Se invoca con `/add-product` (o pasando directamente una o varias URLs de Amazon). Funciona en dos modos:

- **Semiautomático (hoy):** le pasas la URL + los datos (captura o copiados) y hace el JSON, el `id`, `npm run build` y (si confirmas) el commit.
- **Automático (cuando la extensión de Chrome esté conectada):** detecta el navegador y extrae precio/imagen/valoraciones/título sola; tú solo pasas la URL.

## Automatizar la subida de productos con "Claude para Chrome" (pendiente)

> **Estado:** ✅ ACTIVA. La extensión "Claude para Chrome" ya está instalada y conectada.
> La skill `/add-product` funciona en modo automático: Claude navega Amazon y extrae los datos solo.

El objetivo es que, para añadir un producto, el usuario solo tenga que pasar **la URL de Amazon** (o varias) y Claude haga el resto automáticamente, sin copiar precio/imagen/valoraciones a mano.

### Requisitos previos
1. Instalar y conectar la extensión **"Claude para Chrome"** (MCP `mcp__Claude_in_Chrome__*`).
2. Tener Chrome **logueado con la cuenta de afiliado** de Amazon (Francisco García) para que precios y datos sean los de `amazon.es`.

### Flujo a ejecutar (cuando la extensión esté disponible)
1. El usuario pasa una o varias **URLs de producto de Amazon**.
2. Claude, vía la extensión de Chrome, **navega a cada página** y extrae del DOM: `title`, `price`, `originalPrice` (si hay descuento), `rating`, `reviewCount`, `features` e `imageUrl` (imagen principal). El `asin` se saca de la URL (`/dp/XXXXXXXXXX`).
3. Claude monta el objeto JSON con el siguiente `id` libre y lo muestra para que el usuario confirme `category` y si va como `isFeatured` / `isBestSeller`.
4. Inserta en `src/data/products.json`, valida con `npm run build` y (si el usuario lo pide) hace commit + push.

### Limitaciones conocidas
- Amazon puede mostrar **captchas** o **precios que varían por sesión/región**; en ese caso Claude lo avisa y el usuario confirma el dato manualmente.
- No es scraping masivo: abre cada página como lo haría una persona. Válido para añadir productos de uno en uno.
- El **tag de afiliado** lo añade siempre la web automáticamente (`bagotech-21`), no hay que tocarlo al añadir productos.

### Alternativa futura (Nivel 3)
Cuando la cuenta de afiliado esté consolidada (tras 3 ventas cualificadas), se puede usar la **Amazon Product Advertising API (PA-API)** para obtener todos los datos del producto a partir del ASIN de forma 100% automática, sin navegador.

---

## Estado del proyecto (última sesión: 2026-07-23)

### Hecho
- **Tag de afiliado** unificado a `bagotech-21` (cuenta de Francisco García) en código, `.env` y Vercel. La cuenta se había cerrado por inactividad y se reactivó.
- **Catálogo:** **20 productos reales** (ids 1, 2, 9–26). Reparto: Tecnología (10), Hogar (4), Accesorios (6). Eliminados los demo con ASIN falsos.
- **Skill `/add-product`** funcionando en modo automático con Claude para Chrome (extrae precio/imagen/valoraciones/features del DOM de Amazon).
- **Página de detalle** (`/producto/:id`) con features, CTA, relacionados y JSON-LD. Las cards navegan a ella.
- **SEO:** sitemap automático, robots.txt, datos estructurados (Product/BreadcrumbList/Organization) y dominio centralizado en `src/config/site.ts` (`https://bago-tech.vercel.app`).
- **Google Analytics 4 activado:** propiedad creada (ID `G-S0QKPXFK1F`, variable en Vercel para Production). Init temprano en `main.tsx`, sin doble conteo (`send_page_view:false`), y evento `affiliate_click` con `value` (precio) y categoría. Eventos: `page_view`, `view_item`, `affiliate_click`.
- **Banner de cookies (RGPD):** `src/components/CookieConsent.tsx` + `src/utils/consent.ts`. GA **solo carga tras aceptar**. Enlace "Configurar cookies" en el footer para cambiar la decisión.
- **Imagen Open Graph:** `public/og-image.jpg` (1200x630, generada con el logo real de la marca). `index.html` usa URLs absolutas para `og:image`/`twitter:image` (requisito del protocolo).
- **Sección de Ofertas + filtros:** nueva sección "Ofertas Especiales" en Home (4 mayores descuentos) y enlace "Ofertas" en el header (`/productos?sale=1`). Se arregló un bug donde `?sale=1` no se leía al cargar la URL. Se expusieron en la UI los filtros de precio (5 rangos) y valoración mínima que ya existían en `useProducts`.

### Próximos pasos (ideas, sin empezar)
1. **Google Search Console:** registrar `bago-tech.vercel.app` y enviar el sitemap.
2. **Afinar la página Legal** (`src/pages/Legal.tsx`) para mencionar explícitamente Google Analytics y el tratamiento de datos (el banner de cookies enlaza ahí).
3. **Optimización de imágenes:** lazy loading, tamaños, evitar saltos de layout (CLS) en las imágenes de producto.
4. **Verificar GA en producción:** confirmar eventos en Tiempo real/DebugView desde un navegador sin bloqueadores (los adblockers ocultan tráfico propio).
5. **(Futuro)** Comprar dominio propio si hay tráfico → cambiar `SITE_URL` en los 4 sitios indicados.
6. **(Futuro)** Prerender/SSR para que los datos estructurados no dependan de JS.

### Objetivo de negocio
Conseguir las **3 ventas cualificadas** (en 180 días) que validan la cuenta de afiliado, o Amazon la cierra por inactividad (ya pasó una vez).
