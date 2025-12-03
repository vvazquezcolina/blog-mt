import * as fs from 'fs';
import * as path from 'path';
import imageMapData from '../data/imageMap.json';

// Mapeo de códigos de destino
const DEST_MAP: Record<string, string> = {
  'CUN': 'CUN',
  'TULUM': 'TULUM',
  'PDC': 'PDC',
  'PLAYA': 'PDC',
  'CSL': 'CSL',
  'CABOS': 'CSL',
  'VTA': 'VTA',
  'VALLARTA': 'VTA',
};

// Mapeo de venues
const VENUE_MAP: Record<string, string> = {
  'MANDALA': 'MANDALA',
  'BAGATELLE': 'BAGATELLE',
  'BONBONNIERE': 'BONBONNIERE',
  'TEHMPLO': 'TEHMPLO',
  'VAGALUME': 'VAGALUME',
  'VAQUITA': 'VAQUITA',
  'VAQUITAA': 'VAQUITAA',
  'RAKATA': 'RAKATA',
  'CHICABAL': 'CHICABAL',
  'SANTA': 'SANTA',
  'SANTITO': 'SANTITO',
  'DCAVE': 'Dcave',
  'HOF': 'HOF',
};

const imageMap = imageMapData as any;

function getRandomImage(dest: string, venue: string, index: number): string | null {
  const normalizedDest = DEST_MAP[dest] || dest;
  const normalizedVenue = VENUE_MAP[venue] || venue;
  
  const venues = imageMap[normalizedDest];
  if (!venues) return null;
  
  const images = venues[normalizedVenue];
  if (!images || images.length === 0) {
    // Intentar con el primer venue disponible
    const firstVenue = Object.keys(venues)[0];
    if (firstVenue) {
      const firstImages = venues[firstVenue];
      if (firstImages && firstImages.length > 0) {
        return firstImages[index % firstImages.length];
      }
    }
    return null;
  }
  
  return images[index % images.length];
}

function fixImagePaths(content: string): string {
  // Patrón: /assets/PoolFotos/DEST/VENUE/NUMBER.jpg
  const pattern = /\/assets\/PoolFotos\/([^\/]+)\/([^\/]+)\/(\d+)\.jpg/g;
  
  return content.replace(pattern, (match, dest, venue, numStr) => {
    const num = parseInt(numStr, 10);
    const image = getRandomImage(dest, venue, num - 1);
    
    if (image) {
      return image;
    }
    
    // Si no se encuentra, mantener la ruta original pero con el primer número disponible
    console.warn(`No image found for ${dest}/${venue}/${numStr}.jpg`);
    return match;
  });
}

// Leer el archivo
const blogPostsPath = path.join(__dirname, '../data/blogPosts.ts');
let content = fs.readFileSync(blogPostsPath, 'utf-8');

// Aplicar las correcciones
content = fixImagePaths(content);

// Escribir el archivo
fs.writeFileSync(blogPostsPath, content, 'utf-8');

console.log('✅ Image paths fixed!');

