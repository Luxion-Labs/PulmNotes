import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

const args = process.argv.slice(2)
const argValue = (flag, fallback) => {
  const index = args.indexOf(flag)
  if (index === -1 || index + 1 >= args.length) return fallback
  return args[index + 1]
}

const rootDir = argValue('--root', 'src-tauri/target/release/bundle')
const outFile = argValue('--out', 'checksums.sha256')

const walk = (dir, files = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(fullPath, files)
    } else if (entry.isFile()) {
      files.push(fullPath)
    }
  }
  return files
}

if (!fs.existsSync(rootDir)) {
  console.error(`Checksum root not found: ${rootDir}`)
  process.exit(1)
}

const files = walk(rootDir)
if (files.length === 0) {
  console.error(`No files found under: ${rootDir}`)
  process.exit(1)
}

const lines = files
  .map((file) => {
    const data = fs.readFileSync(file)
    const hash = crypto.createHash('sha256').update(data).digest('hex')
    const relative = path.relative(rootDir, file).split(path.sep).join('/')
    return `${hash}  ${relative}`
  })
  .sort()

fs.writeFileSync(outFile, `${lines.join('\n')}\n`)
console.log(`Wrote ${lines.length} checksums to ${outFile}`)
