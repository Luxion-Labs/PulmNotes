import fs from "node:fs"
import path from "node:path"

const repoRoot = path.resolve(process.cwd())
const sourceDir = path.join(
  repoRoot,
  "node_modules",
  "emoji-datasource-apple",
  "img",
  "apple",
  "64"
)
const targetDir = path.join(repoRoot, "public", "emoji", "apple", "64")

if (!fs.existsSync(sourceDir)) {
  console.error(
    "[emoji] Source directory not found. Did you install emoji-datasource-apple?"
  )
  process.exit(1)
}

fs.mkdirSync(targetDir, { recursive: true })

const existingFiles = new Set(
  fs
    .readdirSync(targetDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
)

const sourceFiles = fs
  .readdirSync(sourceDir, { withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)

let copied = 0
let aliased = 0
for (const fileName of sourceFiles) {
  if (existingFiles.has(fileName)) continue
  fs.copyFileSync(
    path.join(sourceDir, fileName),
    path.join(targetDir, fileName)
  )
  existingFiles.add(fileName)
  copied++
}

for (const fileName of sourceFiles) {
  const aliasName = fileName.replace(/-fe0f/g, "")
  if (aliasName === fileName) continue
  if (existingFiles.has(aliasName)) continue
  fs.copyFileSync(
    path.join(sourceDir, fileName),
    path.join(targetDir, aliasName)
  )
  existingFiles.add(aliasName)
  aliased++
}

console.log(
  `[emoji] Copied ${copied} Apple emoji images into ${path.relative(
    repoRoot,
    targetDir
  )}. Added ${aliased} alias files`
)
