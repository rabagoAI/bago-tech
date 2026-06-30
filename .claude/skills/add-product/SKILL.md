---
name: add-product
description: Añade uno o varios productos de Amazon al catálogo de BagoTech (src/data/products.json). Úsala cuando el usuario pase una o varias URLs de producto de Amazon, o pida "añadir producto", "subir producto", "add product" o similar.
---

# Añadir producto(s) al catálogo de BagoTech

Automatiza la inserción de productos de Amazon en `src/data/products.json`. Funciona en dos modos según haya o no un navegador de Claude para Chrome conectado.

## Paso 0 — Detectar el modo de trabajo

Comprueba si hay un navegador conectado con `mcp__Claude_in_Chrome__list_connected_browsers`.

- **Si devuelve uno o más navegadores → MODO AUTOMÁTICO** (extraes los datos tú).
- **Si devuelve `[]` o la herramienta no existe → MODO SEMIAUTOMÁTICO** (los datos los aporta el usuario).

## Paso 1 — Obtener los datos de cada producto

Para cada URL de Amazon que pase el usuario:

1. **Extrae el ASIN de la URL**: es el código de 10 caracteres tras `/dp/` (ej. `.../dp/B0BWCVYFLC/...` → `B0BWCVYFLC`).

2. **Consigue el resto de campos**:
   - **MODO AUTOMÁTICO**: navega a la URL con `mcp__Claude_in_Chrome__navigate` y lee la página con `get_page_text` / `read_page`. Extrae: `title`, `price`, `originalPrice` (solo si hay precio tachado/descuento), `rating`, `reviewCount`, `features` (de "Acerca de este producto") e `imageUrl` (la imagen principal de `m.media-amazon.com`). Si hay captcha o el precio no carga, avisa al usuario y pídele ese dato concreto.
   - **MODO SEMIAUTOMÁTICO**: pide al usuario que pegue una captura de la página del producto y/o estos datos: precio, precio original (si hay descuento), valoración, nº de reseñas e **URL de la imagen** (clic derecho en la foto → "Copiar dirección de imagen"). El título y las features puedes redactarlos a partir de la captura.

3. **Confirma con el usuario** los campos que no son extraíbles de forma fiable:
   - `category`: debe ser exactamente `"Tecnología"`, `"Hogar"` o `"Accesorios"`.
   - `isFeatured` (Home → Destacados) e `isBestSeller` (Home → Más Vendidos + badge amarillo). Por defecto ambos `false`.

## Paso 2 — Calcular el `id`

Lee `src/data/products.json`, busca el `id` numérico más alto y usa **el siguiente** (string). Nunca repitas un `id` existente.

## Paso 3 — Insertar en el JSON

Añade el objeto al final del array con esta forma (mantén el formato/indentación del archivo, 4 espacios):

```json
{
    "id": "<siguiente>",
    "title": "<título tal como aparece en Amazon>",
    "description": "<1-2 frases>",
    "price": 0.00,
    "originalPrice": 0.00,
    "rating": 0.0,
    "reviewCount": 0,
    "category": "Tecnología | Hogar | Accesorios",
    "imageUrl": "https://m.media-amazon.com/images/I/....jpg",
    "asin": "B0XXXXXXXX",
    "features": ["...", "...", "..."],
    "isFeatured": false,
    "isBestSeller": false
}
```

Reglas:
- **Omite `originalPrice`** si no hay descuento real (no pongas `originalPrice` igual a `price`; el badge de descuento solo debe salir si `originalPrice > price`).
- **No toques el tag de afiliado**: la web genera el enlace sola con `bagotech-21` a partir del `asin`. No añadas URLs de Amazon completas al JSON, solo el `asin`.
- Recuerda al usuario que la Home muestra **hasta 4** destacados y **hasta 4** más vendidos.

## Paso 4 — Validar y cerrar

1. Ejecuta `npm run build` y confirma que compila sin errores (valida también que el JSON es correcto).
2. Muestra al usuario un resumen de lo añadido (id, título, precio, categoría, flags).
3. Pregunta si quiere que hagas `commit` + `push`. **No hagas commit/push sin su confirmación.** Si trabajas en `main`, crea antes una rama.

## Notas

- Para sacar enlaces/ASIN, el usuario debe estar logueado en Amazon con su cuenta de afiliado (Francisco García) para que precios y datos sean de `amazon.es`.
- Ver también la sección "Cómo añadir productos nuevos" de `CLAUDE.md` para la referencia completa de campos y reglas de negocio.
