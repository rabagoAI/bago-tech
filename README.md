# MundoGumi - Plataforma de Afiliados Amazon

Plataforma moderna de marketing de afiliados construida con React, TypeScript y Tailwind CSS.

## 🚀 Stack Tecnológico

- **Frontend**: React 18 + TypeScript
- **Bundler**: Vite
- **Estilos**: Tailwind CSS
- **Routing**: React Router DOM
- **UI Components**: Headless UI + Lucide React
- **Analytics**: Google Analytics 4
- **Hosting**: Vercel (recomendado)

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de producción
npm run preview
```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Amazon Affiliate Tag (REQUERIDO)
VITE_AMAZON_TAG=mundogumi-21

# Google Analytics 4 Measurement ID (OPCIONAL)
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Personalización

#### Cambiar Productos

Edita `src/data/products.json` para añadir, modificar o eliminar productos. Cada producto debe tener:

- `id`: Identificador único
- `title`: Título del producto
- `description`: Descripción
- `price`: Precio actual
- `originalPrice`: Precio original (opcional, para mostrar descuento)
- `rating`: Valoración (0-5)
- `reviewCount`: Número de reseñas
- `category`: Categoría
- `imageUrl`: URL de la imagen
- `asin`: ASIN de Amazon (código del producto)
- `features`: Array de características (opcional)
- `isFeatured`: Destacar en home (opcional)
- `isBestSeller`: Marcar como best seller (opcional)

#### Cambiar Colores

Edita `tailwind.config.js` para personalizar la paleta de colores:

```js
colors: {
  primary: { /* tus colores */ },
  accent: { /* tus colores */ },
}
```

## 📁 Estructura del Proyecto

```
src/
├── components/        # Componentes React
│   ├── ui/           # Componentes UI base
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Layout.tsx
├── pages/            # Páginas
│   ├── Home.tsx
│   ├── Products.tsx
│   └── Legal.tsx
├── hooks/            # Custom hooks
├── utils/            # Utilidades
├── data/             # Datos JSON
├── types/            # TypeScript types
├── router/           # Configuración de rutas
└── styles/           # Estilos globales
```

## 🎨 Características

- ✅ Diseño mobile-first responsive
- ✅ Modo oscuro
- ✅ Búsqueda y filtros de productos
- ✅ Enlaces de afiliado automáticos
- ✅ Tracking de analytics
- ✅ SEO optimizado
- ✅ Cumplimiento legal Amazon
- ✅ Animaciones suaves
- ✅ Carga lazy de imágenes

## 📊 Analytics

El sitio está configurado para rastrear:

- Vistas de página
- Clics en productos
- Clics en enlaces de afiliado
- Búsquedas

## 🚀 Deployment

### Vercel (Recomendado)

1. Instala Vercel CLI:
```bash
npm i -g vercel
```

2. Despliega:
```bash
vercel
```

3. Configura las variables de entorno en el dashboard de Vercel

### Otros Servicios

El proyecto es compatible con:
- Netlify
- GitHub Pages (con configuración adicional)
- Firebase Hosting

## 📝 Legal

Asegúrate de:

1. ✅ Tener una cuenta de Amazon Associates activa
2. ✅ Incluir el aviso de afiliado (ya incluido en `/legal`)
3. ✅ Cumplir con las políticas de Amazon Associates
4. ✅ No usar enlaces acortados
5. ✅ No promocionar en DMs

## 🔄 Migración a Firebase

Para escalar a Firebase Firestore:

1. Instala Firebase:
```bash
npm install firebase
```

2. Crea `src/lib/firebase.ts` con tu configuración

3. Modifica `src/hooks/useProducts.ts` para cargar desde Firestore

## 📞 Soporte

Para preguntas o problemas, contacta: info@mundogumi.com

## 📄 Licencia

MIT License - Libre para uso personal y comercial
