import fs from 'fs'
import path from 'path'

const maxKb = Number.parseInt(process.env.NEXT_MAIN_BUNDLE_MAX_KB || '2048', 10)
const chunksDir = path.join(process.cwd(), '.next', 'static', 'chunks')

const walk = (dir, files = []) => {
  if (!fs.existsSync(dir)) return files
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(fullPath, files)
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(fullPath)
    }
  }
  return files
}

if (!fs.existsSync(chunksDir)) {
  console.warn(`Next.js chunks directory not found: ${chunksDir}`)
  console.warn('Skipping bundle size check.')
  process.exit(0)
}

const files = walk(chunksDir)
if (files.length === 0) {
  console.warn('No JS chunk files found to analyze.')
  console.warn('Skipping bundle size check.')
  process.exit(0)
}

const pickMainBundle = (candidates) => {
  const patterns = [/^main-.*\.js$/, /^main-app-.*\.js$/, /^app-.*\.js$/]
  for (const pattern of patterns) {
    const match = candidates.find((file) => pattern.test(path.basename(file)))
    if (match) return match
  }
  return null
}

const mainBundle = pickMainBundle(files)
const targetFile =
  mainBundle ||
  files.reduce((largest, current) =>
    fs.statSync(current).size > fs.statSync(largest).size ? current : largest
  )

const sizeBytes = fs.statSync(targetFile).size
const sizeKb = Math.round(sizeBytes / 1024)
const relative = path.relative(process.cwd(), targetFile)

console.log(`Main bundle candidate: ${relative}`)
console.log(`Size: ${sizeKb} KB (limit ${maxKb} KB)`)

if (sizeKb > maxKb) {
  console.error('Bundle size budget exceeded.')
  process.exit(1)
}
