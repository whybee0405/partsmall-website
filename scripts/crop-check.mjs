import sharp from 'sharp'
await sharp('C:\\Users\\whybe\\AppData\\Local\\Temp\\pm-assets\\vehicles-bg-raw2.png')
  .extract({ left: 780, top: 620, width: 500, height: 260 })
  .toFile('C:\\Users\\whybe\\AppData\\Local\\Temp\\pm-assets\\plate-crop.png')
console.log('done')
