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
│   ├── admin/                  # Panel de control CMS (Sveltia / Decap)
│   │   ├── index.html
│   │   └── config.yml
│   ├── data/
│   │   ├── obras/              # Archivos individuales JSON por obra (CMS)
│   │   │   └── [slug].json
│   │   └── obras.json          # Base de datos maestra compilada para la web
│   └── images/obras/           # Imágenes locales servidas estáticamente
│       └── [slug]/ o [nombre].avif
├── scripts/
│   ├── compile-obras.js        # Compila los JSON individuales en obras.json
│   └── optimize-images.js      # Optimiza imágenes a AVIF, crea miniaturas y compila
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
        └── obras.js            # Carga y procesa dinámicamente obras.json
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
npm run build      # compila obras y genera dist/
npm run preview    # previsualiza el build
```

## Añadir una nueva obra

### Método 1: A través del CMS (Recomendado)

La web cuenta con **Sveltia CMS** integrado, lo que permite a la artista añadir, modificar o eliminar obras desde un panel visual sin necesidad de editar código ni optimizar imágenes a mano.

#### 1. Acceder al CMS:
- **En producción**: Abre `https://pablomsanala.github.io/carolina/admin/`
- **En local**: Ejecuta `npm run dev` y abre `http://localhost:5173/carolina/admin/`

#### 2. Identificación / Login:
- **En producción**:
  - Inicia sesión con tu cuenta de GitHub o mediante un **Personal Access Token (PAT)** de GitHub.
  - *Permisos requeridos para el Token*: 
    - **Fine-grained token** (recomendado): Seleccionar el repositorio `carolina`, con permisos `Contents: Read and write` y `Metadata: Read-only`.
    - **Classic token**: Seleccionar el scope `repo`.
- **En local**: Haz clic en **Work with Local Folder**, selecciona la carpeta raíz del proyecto y concede permisos de lectura/escritura al navegador.

#### 3. Crear o editar la obra:
1. En la barra lateral izquierda, entra en **Colección Obras**.
2. Pulsa en **Nuevo Obras** (o selecciona una obra existente para editarla).
3. Rellena los campos:
   - **Título**: Nombre de la obra.
   - **Slug**: Identificador único para la URL (ej: `rompiente-sur`, `nueva-obra`).
   - **Técnica**: Técnica utilizada (ej: `Acrílico y texturas`).
   - **Disponible (Status)**: Selecciona `Disponible` o `Vendido`.
   - **Portada (Imagen Principal)**: Sube tu imagen en formato estándar (`.jpg`, `.jpeg` o `.png`).
   - **Imágenes de Detalles**: Sube fotos de detalle o diferentes perspectivas (opcional).
   - **Descripción**: Texto descriptivo de la obra.
   - **Tags**: Etiquetas descriptivas (ej: `Acrílico`, `Texturas`, `Díptico`).
   - **Fecha**: Fecha de creación/publicación.
4. Haz clic en **Publish** (Publicar) en la esquina superior derecha.

---

#### 4. Automatización en segundo plano:

Al hacer clic en **Publish**, GitHub Actions ejecuta automáticamente el pipeline (`.github/workflows/optimize-and-deploy.yml`):
- **Conversión AVIF**: Convierte automáticamente las imágenes JPG/PNG a `.avif` de alta compresión y elimina los archivos originales.
- **Generación de Miniaturas**: Genera automáticamente una versión thumbnail optimizada en `.webp` (700px) a partir de la portada.
- **Actualización de Base de Datos**: Actualiza las rutas en `public/data/obras/[slug].json` con las extensiones optimizadas.
- **Compilación**: Agrupa y ordena todas las obras en el catálogo maestro `public/data/obras.json`.
- **Despliegue**: Compila la web y la publica en `gh-pages` en pocos minutos.

---

### Método 2: Manual vía código (Avanzado)

Si prefieres añadir obras manualmente sin usar el CMS:
1. Crea un archivo JSON en `public/data/obras/<slug>.json` con la estructura requerida.
2. Coloca las imágenes en `public/images/obras/`.
3. Ejecuta el script de optimización y compilación:
   ```bash
   npm run optimize
   ```
4. Haz commit y push a la rama `main` o ejecuta `npm run build`.