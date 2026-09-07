import sharp from 'sharp'
await sharp('C:\\Users\\whybe\\AppData\\Local\\Temp\\pm-assets\\vehicles-bg-raw2.png')
  .extract({ left: 600, top: 560, width: 350, height: 150 })
  .resize(700, 300)
  .toFile('C:\\Users\\whybe\\AppData\\Local\\Temp\\pm-assets\\badge-crop2.png')
console.log('done')
