import sharp from 'sharp'
import { readdirSync, statSync, existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs'
import { join, resolve, extname, relative } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT_DIR = resolve(__dirname, '..')
const OBRAS_DIR = join(ROOT_DIR, 'public/images/obras')
const DATA_DIR = join(ROOT_DIR, 'public/data/obras')

// Helper function to recursively find files matching extensions
function getFilesRecursively(dir, extensions) {
  let files = []
  if (!existsSync(dir)) return files

  const items = readdirSync(dir)
  for (const item of items) {
    const fullPath = join(dir, item)
    if (statSync(fullPath).isDirectory()) {
      files = files.concat(getFilesRecursively(fullPath, extensions))
    } else {
      const ext = extname(item).toLowerCase()
      if (extensions.includes(ext)) {
        files.push(fullPath)
      }
    }
  }
  return files
}

async function generateThumbnails() {
  console.log('\n🔍 Checking for missing or outdated thumbnails...')
  
  if (!existsSync(DATA_DIR)) return

  const dbFiles = readdirSync(DATA_DIR)
    .filter(f => extname(f).toLowerCase() === '.json')
    .map(f => join(DATA_DIR, f))

  let createdThumbsCount = 0

  for (const dbFile of dbFiles) {
    try {
      const data = JSON.parse(readFileSync(dbFile, 'utf8'))
      const { portada, slug } = data

      if (!portada) {
        continue
      }

      const portadaExt = extname(portada)
      const portadaFullPath = join(ROOT_DIR, 'public', portada)
      
      // Get the base name of the portada (e.g. "1" or "my-artwork")
      const lastSlashIdx = portada.lastIndexOf('/')
      const portadaFileName = lastSlashIdx !== -1 
        ? portada.substring(lastSlashIdx + 1, portada.length - portadaExt.length)
        : portada.substring(0, portada.length - portadaExt.length)

      const currentThumb = data.thumb
      const currentThumbFullPath = currentThumb ? join(ROOT_DIR, 'public', currentThumb) : null
      const thumbFileExists = currentThumbFullPath ? existsSync(currentThumbFullPath) : false

      // A thumbnail is considered valid if:
      // 1. It physically exists on disk.
      // 2. AND either:
      //    a) It is one of the legacy thumbnails and the portada hasn't changed (still details/1.avif)
      //    b) Or it contains the filename base of the current portada image
      const isLegacyPortada = portada.startsWith(`/images/obras/${slug}/detalles/1.`)
      const isLegacyThumb = currentThumb === `/images/obras/${slug}/thumb.webp`
      const isLegacyValid = isLegacyPortada && isLegacyThumb
      const matchesPortada = currentThumb && currentThumb.includes(portadaFileName)
      
      const isThumbValid = thumbFileExists && (isLegacyValid || matchesPortada)

      if (!isThumbValid) {
        if (!existsSync(portadaFullPath)) {
          console.warn(`  ⚠ Cannot generate thumbnail. Portada not found: ${portadaFullPath}`)
          continue
        }

        // Delete old non-legacy thumbnail file if it exists to clean up space
        if (thumbFileExists && currentThumbFullPath && !isLegacyThumb) {
          try {
            unlinkSync(currentThumbFullPath)
            console.log(`  🗑 Deleted outdated thumbnail file: ${currentThumb}`)
          } catch (e) {}
        }

        // Determine where the new thumbnail should go
        const portadaBase = portada.substring(0, portada.length - portadaExt.length)
        const targetThumbRelative = `${portadaBase}-thumb.webp`
        const thumbFullPath = join(ROOT_DIR, 'public', targetThumbRelative)

        console.log(`  📸 Generating thumbnail for "${data.titulo}" from ${portada}`)

        await sharp(portadaFullPath)
          .resize({ width: 700, withoutEnlargement: true })
          .webp({ quality: 78 })
          .toFile(thumbFullPath)

        console.log(`    ✓ Created: ${targetThumbRelative}`)
        createdThumbsCount++

        // Update JSON with new thumb path
        data.thumb = targetThumbRelative
        writeFileSync(dbFile, JSON.stringify(data, null, 2), 'utf8')
        console.log(`    ✍ Updated thumb reference in: ${relative(ROOT_DIR, dbFile)}`)
      }
    } catch (err) {
      console.error(`  ❌ Error processing thumbnails for ${dbFile}:`, err)
    }
  }

  console.log(`✨ Thumbnail check complete. Generated ${createdThumbsCount} new thumbnail(s).`)
}

async function main() {
  console.log('🔍 Scanning for JPG, JPEG, and PNG images in:', OBRAS_DIR)
  const targets = getFilesRecursively(OBRAS_DIR, ['.jpg', '.jpeg', '.png'])

  if (targets.length === 0) {
    console.log('✨ No JPG/PNG images found. Nothing to optimize.')
    // Check for thumbnails anyway (e.g. if files were already optimized but thumb was missing)
    await generateThumbnails()
    runCompiler()
    return
  }

  console.log(`📸 Found ${targets.length} image(s) to optimize.`)

  // Find all individual JSON database files
  const dbFiles = readdirSync(DATA_DIR)
    .filter(f => extname(f).toLowerCase() === '.json')
    .map(f => join(DATA_DIR, f))

  let convertedCount = 0

  for (const filePath of targets) {
    const ext = extname(filePath)
    const outputPath = filePath.substring(0, filePath.length - ext.length) + '.avif'

    // Get the relative path starting from /images/obras/
    const relativeToPublic = '/' + relative(join(ROOT_DIR, 'public'), filePath).replace(/\\/g, '/')
    const relativeToPublicAvif = relativeToPublic.substring(0, relativeToPublic.length - ext.length) + '.avif'

    console.log(`🔄 Converting: ${relativeToPublic} -> .avif`)

    try {
      // Convert to AVIF using sharp
      await sharp(filePath)
        .avif({ quality: 80 })
        .toFile(outputPath)

      console.log(`  ✓ Converted to: ${outputPath}`)

      // Delete the original file
      unlinkSync(filePath)
      console.log(`  🗑 Deleted original: ${relativeToPublic}`)

      // Update references in all JSON database files
      for (const dbFile of dbFiles) {
        let content = readFileSync(dbFile, 'utf8')
        const before = content
        content = content.replaceAll(relativeToPublic, relativeToPublicAvif)
        if (before !== content) {
          writeFileSync(dbFile, content, 'utf8')
          console.log(`  ✍ Updated references in: ${relative(ROOT_DIR, dbFile)}`)
        }
      }

      convertedCount++
    } catch (err) {
      console.error(`  ❌ Error processing ${relativeToPublic}:`, err)
    }
  }

  console.log(`\n🎉 Done! ${convertedCount} image(s) optimized to AVIF.`)
  
  // Check and generate thumbnails
  await generateThumbnails()
  
  // Compile all individual JSONs into public/data/obras.json
  runCompiler()
}

function runCompiler() {
  try {
    console.log('⚙ Running compile-obras script...')
    execSync('node scripts/compile-obras.js', { stdio: 'inherit' })
  } catch (err) {
    console.error('❌ Error executing compile-obras:', err)
  }
}

main().catch(err => {
  console.error('Fatal error in optimization script:', err)
  process.exit(1)
})
