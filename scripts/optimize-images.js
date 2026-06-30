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

async function main() {
  console.log('🔍 Scanning for JPG, JPEG, and PNG images in:', OBRAS_DIR)
  const targets = getFilesRecursively(OBRAS_DIR, ['.jpg', '.jpeg', '.png'])

  if (targets.length === 0) {
    console.log('✨ No JPG/PNG images found. Nothing to optimize.')
    // Still run the compiler to ensure everything is in sync
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
