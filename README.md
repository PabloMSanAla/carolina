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

## Gestión de Contenido con CMS (Sveltia/Decap CMS)

La web cuenta con un gestor de contenidos git-based que permite a la artista añadir, editar o eliminar obras de forma completamente visual y automática sin necesidad de tocar código.

### Cómo actualizar la web a través del CMS:

1. **Accede al Panel de Control**:
   - **En producción**: Abre `https://pablomsanala.github.io/carolina/admin/` en tu navegador.
   - **En local**: Ejecuta `npm run dev` y abre `http://localhost:5173/carolina/admin/`.
2. **Identificación**:
   - En producción: Haz clic en **Log in with GitHub** y autoriza tu cuenta.
   - En local: Haz clic en **Work with Local Folder**, selecciona la carpeta raíz del repositorio en tu ordenador y concede permisos de edición al navegador.
3. **Añadir o Editar una Obra**:
   - En la barra lateral izquierda, selecciona **Colección Obras**.
   - Haz clic en **Nuevo Obras** (para añadir una nueva) o selecciona una obra existente de la lista para editarla.
   - Completa la información:
     - **Título**: Nombre de la obra.
     - **Slug**: Identificador único en la URL (ej. `rompiente-sur`).
     - **Técnica**: Técnica empleada (por defecto `Acrílico y texturas`).
     - **Disponible (Status)**: Selecciona `Disponible` o `Vendido`.
     - **Portada (Imagen Principal)**: Sube tu imagen en formato estándar (`.jpg`, `.jpeg` o `.png`).
     - **Imágenes de Detalles**: Sube fotos adicionales de detalles.
     - **Descripción**: Descripción de la obra.
     - **Tags**: Palabras clave (por defecto `Acrílico`, `Texturas`).
     - **Fecha**: Fecha de registro.
   - Haz clic en **Publish** (Publicar) en la esquina superior derecha.

---

### ¿Qué ocurre por detrás? (Flujo de Automatización)

Una vez que haces clic en **Publish** en el CMS, se activa de forma automática el siguiente pipeline:

1. **Actualización del Repositorio**:
   - Sveltia CMS sube las imágenes originales tal cual las has subido y crea un archivo individual en `public/data/obras/[slug].json` con los metadatos de la nueva obra, realizando un `commit` y un `push` a la rama `main` de tu repositorio de GitHub.
2. **Optimización Automática (GitHub Actions)**:
   - El push activa el workflow de GitHub Actions (`.github/workflows/optimize-and-deploy.yml`), que realiza los siguientes pasos en la nube:
     - **Conversión AVIF**: Convierte de forma automática las imágenes subidas (`.jpg`, `.jpeg`, o `.png`) al formato comprimido de última generación **AVIF** para ahorrar espacio, y elimina los archivos PNG/JPG originales.
     - **Generación de Miniaturas**: Genera automáticamente una miniatura optimizada en formato **WebP** de 700px de ancho a partir de la imagen de portada.
     - **Actualización de Base de Datos**: Actualiza todas las referencias de las imágenes en tu archivo JSON del CMS para que apunten a los archivos `.avif` y `-thumb.webp` generados.
     - **Compilación de Catálogo**: Ejecuta un script para recopilar y ordenar todos los JSON individuales de la carpeta `public/data/obras/` en el archivo maestro unificado `public/data/obras.json` utilizado por la web.
     - **Confirmación de Cambios**: Vuelve a confirmar (`commit` y `push`) de forma automática estos archivos optimizados a la rama `main`.
3. **Despliegue Automático**:
   - Finalmente, el workflow compila el proyecto React (`npm run build`) y publica la versión final en la rama `gh-pages`, actualizando la página web en producción en pocos minutos de forma transparente.