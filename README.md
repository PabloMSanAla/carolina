# Carolina Peñacoba — Pintora

Portfolio web para [Carolina Peñacoba](https://estudiodecarolina.com), pintora especializada en acrílico con texturas y acuarela desde Madrid.

## Stack

| Librería | Versión | Uso |
|---|---|---|
| React | 18 | UI |
| Vite | 5 | Bundler / dev server |
| React Router | v6 | Enrutado SPA |
| Framer Motion | 11 | Transiciones y animaciones |

## Rutas

| Ruta | Página |
|---|---|
| `/` | Home — hero, galería editorial, sobre mí y CTA encargos |
| `/galeria` | Galería filtrable (todas / disponibles / vendidas) |
| `/obras/:slug` | Detalle de obra — imágenes, descripción, lightbox, navegación anterior/siguiente |
| `/sobre` | Biografía completa |
| `/encargos` | Proceso de encargo en 3 pasos |
| `/contacto` | Formulario de contacto |

## Estructura del proyecto

```
carolina/
├── public/
│   └── images/obras/           # Imágenes locales servidas estáticamente
│       └── [slug]/
│           ├── portada.png
│           └── detalles/
│               └── 1.png … n.png
└── src/
    ├── main.jsx                # Entry point
    ├── App.jsx                 # Router + AnimatePresence
    ├── index.css               # Variables CSS y estilos base
    ├── components/
    │   ├── Nav.jsx             # Navbar fija, hamburger en móvil
    │   ├── Footer.jsx
    │   ├── Marquee.jsx         # Banda animada de técnicas
    │   ├── ObraCard.jsx        # Tarjeta de obra (link a detalle)
    │   ├── PageTransition.jsx  # Fade/slide entre páginas
    │   └── ScrollToTop.jsx
    ├── pages/
    │   ├── Home.jsx
    │   ├── Galeria.jsx
    │   ├── ObraDetail.jsx
    │   ├── SobreMi.jsx
    │   ├── Encargos.jsx
    │   ├── Contacto.jsx
    │   └── NotFound.jsx
    └── data/
        └── obras.js            # Catálogo completo — añadir obras aquí
```

## Obras incluidas

| Título | Slug | Estado |
|---|---|---|
| Irrupción | `irrupcion` | Disponible |
| Olas de lava | `olas-de-lava` | Disponible |
| Márgenes de nieve | `margenes-de-nieve` | Disponible |
| Marismas | `marismas` | Disponible |
| Estratos de arena | `estratos-de-arena` | Disponible |
| Horizonte dorado | `horizonte-dorado` | Disponible |
| Orillas | `orillas` | Disponible |
| Rompiente Sur | `rompiente-sur` | Vendido |
| Mar en dos tiempos | `mar-en-dos-tiempos` | Vendido |
| Tramontana | `tramontana` | Vendido |
| Reflejos | `reflejos` | Vendido |
| Las Marinas | `las-marinas` | Vendido |

## Instalación y desarrollo

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build para producción

```bash
npm run build      # genera dist/
npm run preview    # previsualiza el build
```

## Añadir una nueva obra

1. Crea `public/images/obras/<slug>/portada.png` y `public/images/obras/<slug>/detalles/1.png…`
2. Añade la entrada en `src/data/obras.js` siguiendo la misma estructura que las existentes.
3. La ruta `/obras/<slug>` se genera automáticamente.

## Despliegue

Compatible con **Vercel**, **Netlify** y **GitHub Pages**.

Para GitHub Pages añade `base: '/nombre-repo/'` en `vite.config.js`.  
Para Vercel/Netlify no requiere ningún cambio adicional.
