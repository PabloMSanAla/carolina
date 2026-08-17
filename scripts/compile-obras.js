import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs'
import { join, resolve, extname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT_DIR = resolve(__dirname, '..')
const OBRAS_DIR = join(ROOT_DIR, 'public/data/obras')
const OUTPUT_PATH = join(ROOT_DIR, 'public/data/obras.json')

const PRESERVED_ORDER = [
  'irrupcion',
  'olas-de-lava',
  'rompiente-sur',
  'margenes-de-nieve',
  'marismas',
  'estratos-de-arena',
  'mar-en-dos-tiempos',
  'horizonte-dorado',
  'orillas',
  'tramontana',
  'reflejos',
  'las-marinas'
]

function compileObras() {
  if (!existsSync(OBRAS_DIR)) {
    console.warn(`Directory ${OBRAS_DIR} does not exist. Nothing to compile.`)
    return
  }

  console.log('📂 Compiling obras JSON files from:', OBRAS_DIR)
  const files = readdirSync(OBRAS_DIR).filter(f => extname(f).toLowerCase() === '.json')
  const obras = []

  for (const file of files) {
    const filePath = join(OBRAS_DIR, file)
    try {
      const data = JSON.parse(readFileSync(filePath, 'utf8'))
      obras.push(data)
    } catch (err) {
      console.error(`❌ Error parsing ${file}:`, err)
    }
  }

  // Sort by date / timestamp descending (newest first)
  obras.sort((a, b) => {
    const timeA = a.date ? new Date(a.date).getTime() : 0
    const timeB = b.date ? new Date(b.date).getTime() : 0

    if (timeB !== timeA) {
      return timeB - timeA // Newer dates appear first
    }

    // Tiebreaker for identical dates: use preserved legacy order if present
    const idxA = PRESERVED_ORDER.indexOf(a.slug)
    const idxB = PRESERVED_ORDER.indexOf(b.slug)

    if (idxA !== -1 && idxB !== -1) {
      return idxA - idxB
    }
    if (idxA !== -1) return 1
    if (idxB !== -1) return -1

    return (a.titulo || '').localeCompare(b.titulo || '')
  })

  writeFileSync(OUTPUT_PATH, JSON.stringify(obras, null, 2), 'utf8')
  console.log(`💾 Successfully compiled ${obras.length} obras to: ${OUTPUT_PATH}`)
}

compileObras()
