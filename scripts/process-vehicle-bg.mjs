import sharp from 'sharp'
import { join } from 'path'

const src = 'C:\\Users\\whybe\\AppData\\Local\\Temp\\pm-assets\\vehicles-bg-raw2.png'
const out = join(process.cwd(), 'public', 'images', 'vehicles-bg.webp')

await sharp(src)
  .blur(14)
  .modulate({ saturation: 0.75, brightness: 0.98 })
  .webp({ quality: 78 })
  .toFile(out)

console.log('wrote', out)
