import sharp from 'sharp'
import { join } from 'path'
import { mkdirSync } from 'fs'

const base = 'C:\\Users\\whybe\\AppData\\Local\\Temp\\pm-logos'
const outDir = join(process.cwd(), 'public', 'images', 'brands')
mkdirSync(outDir, { recursive: true })

const files = [
  { in: 'logo-pmc.jpg', out: 'pmc.png' },
  { in: 'logo-carDex.jpg', out: 'car-dex.png' },
  { in: 'logo-dashi.jpg', out: 'dashi.png' },
]

const BG = 240
const THRESHOLD = 14 // distance from the flat #f0f0f0 background before a pixel counts as artwork

for (const f of files) {
  const path = join(base, f.in)
  const img = sharp(path)
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const dist = Math.abs(r - BG) + Math.abs(g - BG) + Math.abs(b - BG)
    if (dist < THRESHOLD) {
      data[i + 3] = 0
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .trim()
    .png()
    .toFile(join(outDir, f.out))

  console.log('wrote', f.out)
}
