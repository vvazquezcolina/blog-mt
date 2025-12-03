import { readdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

interface ImageMap {
  [destination: string]: {
    [venue: string]: string[];
  };
}

async function getAllImages(): Promise<ImageMap> {
  const poolFotosPath = join(process.cwd(), 'public', 'assets', 'PoolFotos');
  const imageMap: ImageMap = {};

  if (!existsSync(poolFotosPath)) {
    console.error('PoolFotos directory not found');
    return imageMap;
  }

  // Leer todos los destinos
  const destinations = await readdir(poolFotosPath, { withFileTypes: true });

  for (const dest of destinations) {
    if (!dest.isDirectory()) continue;

    const destination = dest.name;
    const destinationPath = join(poolFotosPath, destination);
    imageMap[destination] = {};

    // Leer todos los venues del destino
    const venues = await readdir(destinationPath, { withFileTypes: true });

    for (const venue of venues) {
      if (!venue.isDirectory()) continue;

      const venueName = venue.name;
      const venuePath = join(destinationPath, venueName);

      // Leer todas las imágenes del venue
      const files = await readdir(venuePath);
      const imageFiles = files
        .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
        .map(file => `/blog/assets/PoolFotos/${destination}/${venueName}/${file}`)
        .sort(); // Ordenar para consistencia

      if (imageFiles.length > 0) {
        imageMap[destination][venueName] = imageFiles;
      }
    }
  }

  return imageMap;
}

async function generateImageMap() {
  try {
    console.log('Generating image map...');
    const imageMap = await getAllImages();
    
    const outputPath = join(process.cwd(), 'data', 'imageMap.json');
    await writeFile(outputPath, JSON.stringify(imageMap, null, 2), 'utf-8');
    
    // Contar total de imágenes
    let totalImages = 0;
    Object.values(imageMap).forEach(dest => {
      Object.values(dest).forEach(images => {
        totalImages += images.length;
      });
    });

    console.log(`✅ Image map generated successfully!`);
    console.log(`   Destinations: ${Object.keys(imageMap).length}`);
    console.log(`   Total images: ${totalImages}`);
    console.log(`   Output: ${outputPath}`);
  } catch (error) {
    console.error('Error generating image map:', error);
    process.exit(1);
  }
}

generateImageMap();

