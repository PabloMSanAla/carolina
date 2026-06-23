import sharp from 'sharp'
import { readdirSync, existsSync, unlinkSync, statSync } from 'fs'
import { join, resolve, extname, basename } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const OBRAS_DIR = resolve(__dirname, '../public/images/obras')

const slugs = readdirSync(OBRAS_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)

let ok = 0, errors = 0

for (const slug of slugs) {
  const detallesDir = join(OBRAS_DIR, slug, 'detalles')
  if (!existsSync(detallesDir)) continue

  const files = readdirSync(detallesDir)
    .filter(f => extname(f).toLowerCase() === '.png')

  for (const file of files) {
    const srcPath = join(detallesDir, file)
    const destName = basename(file, '.png') + '.avif'
    const destPath = join(detallesDir, destName)

    try {
      console.log(`Converting ${slug}/detalles/${file} to AVIF...`)
      await sharp(srcPath)
        .avif({ quality: 75 })
        .toFile(destPath)

      const originalSize = statSync(srcPath).size
      const avifSize = statSync(destPath).size
      console.log(`  ✓ Created ${destName} (${(avifSize / 1024).toFixed(0)} KB vs ${(originalSize / 1024).toFixed(0)} KB PNG, ratio: ${((avifSize / originalSize) * 100).toFixed(1)}%)`)
      
      // Delete the original PNG file
      unlinkSync(srcPath)
      console.log(`  🗑 Deleted original ${file}`)
      ok++
    } catch (err) {
      console.error(`  ✕ Error converting ${file}:`, err)
      errors++
    }
  }
}

// Also convert Carolina_portrait.png if it exists
const portraitSrc = join(OBRAS_DIR, 'Carolina_portrait.png')
const portraitDest = join(OBRAS_DIR, 'Carolina_portrait.avif')
if (existsSync(portraitSrc)) {
  try {
    console.log(`Converting Carolina_portrait.png to AVIF...`)
    await sharp(portraitSrc)
      .avif({ quality: 75 })
      .toFile(portraitDest)
    
    const originalSize = statSync(portraitSrc).size
    const avifSize = statSync(portraitDest).size
    console.log(`  ✓ Created Carolina_portrait.avif (${(avifSize / 1024).toFixed(0)} KB vs ${(originalSize / 1024).toFixed(0)} KB PNG, ratio: ${((avifSize / originalSize) * 100).toFixed(1)}%)`)
    
    unlinkSync(portraitSrc)
    console.log(`  🗑 Deleted original Carolina_portrait.png`)
    ok++
  } catch (err) {
    console.error(`  ✕ Error converting Carolina_portrait.png:`, err)
    errors++
  }
}

console.log(`\nDone: ${ok} images converted to AVIF successfully. Errors: ${errors}.`)
