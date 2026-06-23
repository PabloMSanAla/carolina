/**
 * scripts/generate-thumbs.js
 *
 * Para cada obra en public/images/obras/[slug]/:
 *   - Genera thumb.webp (700px ancho, calidad 78) desde detalles/1.png
 *   - Elimina portada.png (baja resolución)
 *
 * Uso:  node scripts/generate-thumbs.js
 */

import sharp from 'sharp'
import { readdirSync, existsSync, unlinkSync } from 'fs'
import { join, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const OBRAS_DIR = resolve(__dirname, '../public/images/obras')

const slugs = readdirSync(OBRAS_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)

let ok = 0, skipped = 0

for (const slug of slugs) {
  const src    = join(OBRAS_DIR, slug, 'detalles', '1.png')
  const thumb  = join(OBRAS_DIR, slug, 'thumb.webp')
  const portada = join(OBRAS_DIR, slug, 'portada.png')

  // Remove low-res portada if it exists
  if (existsSync(portada)) {
    unlinkSync(portada)
    console.log(`  🗑  Deleted portada.png  →  ${slug}`)
  }

  if (!existsSync(src)) {
    console.warn(`  ⚠  detalles/1.png not found for: ${slug}`)
    skipped++
    continue
  }

  await sharp(src)
    .resize({ width: 700, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(thumb)

  const { size } = (await import('fs')).statSync(thumb)
  console.log(`  ✓  ${slug}  →  thumb.webp  (${(size / 1024).toFixed(0)} KB)`)
  ok++
}

console.log(`\nDone: ${ok} thumbs generated, ${skipped} skipped.`)
