import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT_DIR = resolve(__dirname, '..')
const JSON_PATH = join(ROOT_DIR, 'public/data/obras.json')
const OBRAS_DIR = join(ROOT_DIR, 'public/data/obras')

function splitObras() {
  if (!existsSync(JSON_PATH)) {
    console.error('Error: public/data/obras.json not found.')
    return
  }

  if (!existsSync(OBRAS_DIR)) {
    mkdirSync(OBRAS_DIR, { recursive: true })
    console.log('Created directory:', OBRAS_DIR)
  }

  const obras = JSON.parse(readFileSync(JSON_PATH, 'utf8'))
  console.log(`Splitting ${obras.length} obras into separate JSON files...`)

  for (const obra of obras) {
    const filePath = join(OBRAS_DIR, `${obra.slug}.json`)
    writeFileSync(filePath, JSON.stringify(obra, null, 2), 'utf8')
    console.log(`  ✓ Created: ${obra.slug}.json`)
  }

  console.log('🎉 Done splitting obras!')
}

splitObras()
