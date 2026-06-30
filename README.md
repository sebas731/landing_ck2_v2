# ComuniK2 — Tienda ecommerce (HTML/CSS/JS puro)

Tienda profesional de sillas ergonómicas, sin frameworks, sin backend y sin login.
Lista para desplegar en **Vercel** como sitio estático.

## 🧱 Stack

- HTML5 semántico
- CSS3 con variables (sin Tailwind ni Bootstrap)
- JavaScript vanilla (sin jQuery ni librerías)
- Google Fonts: Inter
- Iconos SVG inline
- Formularios: [Web3Forms](https://web3forms.com) (gratis, sin backend)

## 📁 Estructura

```
comunik2/
├── index.html              # Home (hero, oferta, productos, stats)
├── sitemap.xml
├── robots.txt
├── README.md
├── css/
│   ├── variables.css       # Paleta, tipografía, reset, utilidades
│   ├── components.css      # Header, ticker, carrito, footer, WhatsApp
│   ├── home.css            # Estilos exclusivos de la home
│   └── producto.css        # Página de producto + páginas internas
├── js/
│   ├── components.js        # Inyecta header/footer y carga cart.js + ui.js
│   ├── cart.js             # Carrito con localStorage + catálogo
│   ├── ui.js               # Slider, carrito, drawer, countdown, etc.
│   └── product.js          # Galería, lightbox y stepper de producto
├── pages/
│   ├── producto-gris.html
│   ├── producto-negro.html
│   ├── nosotros.html
│   ├── contacto.html       # Formulario Web3Forms
│   ├── blog.html
│   ├── terminos.html
│   ├── politica.html
│   ├── envios.html
│   └── reclamaciones.html  # Libro de reclamaciones (Web3Forms)
├── images/
│   ├── banners/            # hero-1.jpg, hero-2.jpg, blog-*.jpg
│   ├── logo.png
│   ├── libro.jpg           # Imagen del libro de reclamaciones
│   └── productos/
│       ├── gris/           # principal, detalle-1..3, thumbnail (.jpeg)
│       └── negro/          # principal, detalle-1..3, thumbnail (.jpeg)
└── video/
    ├── silla-gris.mp4
    └── silla-negro.mp4
```

## 🧩 Componentes reutilizables

Cada página solo necesita esto:

```html
<div id="site-header"></div>
<!-- contenido -->
<div id="site-footer"></div>
<script src="../js/components.js"></script>   <!-- index.html usa "js/..." sin ../ -->
```

`components.js` detecta automáticamente si estás en `/pages/` para resolver las rutas
relativas (`../`) y, tras inyectar el header/footer, carga `cart.js` y `ui.js`.
Las páginas de producto añaden además `<script src="../js/product.js"></script>`.

## 🛒 Carrito

- Persiste con `localStorage` entre páginas.
- Botón **Pedir por WhatsApp** genera el mensaje del pedido y abre `wa.me`.
- Se vacía automáticamente después de enviar el pedido.

Para cambiar el número de WhatsApp, edita `WA_NUMBER` en `js/cart.js` y
`js/components.js` (constante `WA`).

## 📨 Formularios (Web3Forms)

1. Crea una cuenta gratis en https://web3forms.com y copia tu **Access Key**.
2. Reemplaza `TU_ACCESS_KEY_DE_WEB3FORMS` en:
   - `pages/contacto.html`
   - `pages/reclamaciones.html`

## 🖼️ Imágenes y video

El proyecto referencia imágenes/videos que **debes añadir** en las rutas indicadas.
Mientras no existan, se muestran *placeholders* automáticos (vía `onerror`), por lo
que el sitio se ve correcto incluso sin los archivos reales.

Formatos esperados:
- Productos: `.jpeg` en `images/productos/gris|negro/`
- Banners hero/blog: `.jpg` en `images/banners/`
- Videos: `.mp4` en `video/`

## 🚀 Despliegue en Vercel

Al ser 100% estático no requiere configuración:

```bash
npm i -g vercel
vercel
```

O conecta el repositorio en https://vercel.com (framework preset: **Other**).
No hay paso de build: Vercel sirve los archivos tal cual.

## 🎨 Paleta

| Token        | Color     |
|--------------|-----------|
| `--red`      | `#CC0000` |
| `--red-dark` | `#A50000` |
| `--dark`     | `#1A1A1A` |
| `--green-wa` | `#25D366` |

---

© ComuniK2 Perú
