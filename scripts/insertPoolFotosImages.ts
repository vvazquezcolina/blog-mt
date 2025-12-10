import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, readdirSync, statSync } from 'fs';

/**
 * Script para insertar imágenes de PoolFotos en cada post
 * - Mínimo 3 imágenes por post
 * - Las imágenes deben hacer sentido (Cancún -> fotos de Cancún)
 * - No repetir imágenes hasta que todas se hayan usado al menos una vez
 */

interface ImageInfo {
  path: string;
  venue?: string;
  destination?: string;
  fullPath: string;
}

interface PostInfo {
  id: string;
  category: string;
  content: {
    es?: { body?: string };
    en?: { body?: string };
    fr?: { body?: string };
    pt?: { body?: string };
  };
}

// Mapeo de categorías a códigos de destino en PoolFotos
const CATEGORY_TO_DESTINATION: Record<string, string> = {
  'cancun': 'CUN',
  'tulum': 'TULUM',
  'playa-del-carmen': 'VTA',
  'los-cabos': 'CSL',
  'puerto-vallarta': 'VTA',
  'general': 'CUN', // Por defecto Cancún para general
};

// Mapeo de nombres de venues a carpetas en PoolFotos
const VENUE_KEYWORDS: Record<string, string[]> = {
  'mandala': ['MANDALA', 'MB_DAY', 'MB_NIGHT'],
  'mandala beach': ['MANDALA', 'MB_DAY', 'MB_NIGHT'],
  'd\'cave': ['Dcave'],
  'dcave': ['Dcave'],
  'la vaquita': ['VAQUITA', 'VAQUITAA'],
  'vaquita': ['VAQUITA', 'VAQUITAA'],
  'rakata': ['RAKATA'],
  'house of fiesta': ['HOF'],
  'hof': ['HOF'],
  'chicabal': ['CHICABAL'],
  'señor frogs': ['SEÑOR_FROGS'],
  'santa': ['SANTA'],
};

// Tracking de imágenes usadas por destino y venue
const imageUsageTracker: Map<string, Set<string>> = new Map();

/**
 * Obtiene todas las imágenes de PoolFotos organizadas por destino y venue
 */
function getAllPoolFotosImages(): Map<string, Map<string, ImageInfo[]>> {
  const poolFotosPath = join(process.cwd(), 'public', 'assets', 'PoolFotos');
  const imagesByDest: Map<string, Map<string, ImageInfo[]>> = new Map();

  if (!existsSync(poolFotosPath)) {
    console.error('❌ Carpeta PoolFotos no encontrada');
    return imagesByDest;
  }

  function scanDirectory(dir: string, relativePath: string = ''): void {
    const items = readdirSync(dir);
    
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        const newRelativePath = relativePath ? `${relativePath}/${item}` : item;
        scanDirectory(fullPath, newRelativePath);
      } else if (stat.isFile()) {
        const ext = item.toLowerCase().split('.').pop();
        if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) {
          const path = `/assets/PoolFotos/${relativePath}/${item}`;
          const pathParts = relativePath.split('/');
          
          const destination = pathParts[0] || '';
          const venue = pathParts[1] || '';
          
          if (!imagesByDest.has(destination)) {
            imagesByDest.set(destination, new Map());
          }
          
          const destMap = imagesByDest.get(destination)!;
          if (!destMap.has(venue)) {
            destMap.set(venue, []);
          }
          
          destMap.get(venue)!.push({
            path,
            venue,
            destination,
            fullPath: path,
          });
        }
      }
    }
  }

  scanDirectory(poolFotosPath);
  return imagesByDest;
}

/**
 * Encuentra imágenes relevantes para un post sin repetir hasta que todas se hayan usado
 */
function findRelevantImages(
  post: PostInfo, 
  allImagesByDest: Map<string, Map<string, ImageInfo[]>>, 
  minImages: number = 3
): ImageInfo[] {
  const selected: ImageInfo[] = [];
  
  // Obtener destino según categoría
  const destination = CATEGORY_TO_DESTINATION[post.category] || 'CUN';
  const destMap = allImagesByDest.get(destination);
  
  if (!destMap || destMap.size === 0) {
    console.log(`   ⚠️  No hay imágenes para destino ${destination}, usando CUN`);
    const fallbackDest = allImagesByDest.get('CUN');
    if (!fallbackDest) return selected;
    return selectImagesFromDestination(fallbackDest, minImages);
  }
  
  // Extraer venues del contenido
  const content = (post.content.es?.body || '').toLowerCase();
  const foundVenues: string[] = [];
  
  for (const [keyword, folders] of Object.entries(VENUE_KEYWORDS)) {
    if (content.includes(keyword)) {
      foundVenues.push(...folders);
    }
  }
  
  // Si encontramos venues específicos, priorizar esas imágenes
  if (foundVenues.length > 0) {
    for (const venue of foundVenues) {
      const venueImages = destMap.get(venue) || [];
      if (venueImages.length > 0) {
        const key = `${destination}/${venue}`;
        const used = imageUsageTracker.get(key) || new Set();
        
        // Filtrar imágenes no usadas
        const unused = venueImages.filter(img => !used.has(img.path));
        
        if (unused.length > 0) {
          // Seleccionar imagen no usada
          const selectedImg = unused[Math.floor(Math.random() * unused.length)];
          selected.push(selectedImg);
          
          // Marcar como usada
          if (!imageUsageTracker.has(key)) {
            imageUsageTracker.set(key, new Set());
          }
          imageUsageTracker.get(key)!.add(selectedImg.path);
          
          if (selected.length >= minImages) break;
        } else {
          // Todas usadas, resetear y empezar de nuevo
          imageUsageTracker.set(key, new Set());
          const img = venueImages[Math.floor(Math.random() * venueImages.length)];
          selected.push(img);
          imageUsageTracker.get(key)!.add(img.path);
          if (selected.length >= minImages) break;
        }
      }
    }
  }
  
  // Si aún no tenemos suficientes, usar cualquier imagen del destino
  if (selected.length < minImages) {
    return selectImagesFromDestination(destMap, minImages - selected.length, selected);
  }
  
  return selected.slice(0, minImages);
}

/**
 * Selecciona imágenes de un destino sin repetir
 */
function selectImagesFromDestination(
  destMap: Map<string, ImageInfo[]>,
  count: number,
  alreadySelected: ImageInfo[] = []
): ImageInfo[] {
  const selected: ImageInfo[] = [...alreadySelected];
  const allImages: ImageInfo[] = [];
  
  // Recopilar todas las imágenes del destino
  for (const images of destMap.values()) {
    allImages.push(...images);
  }
  
  if (allImages.length === 0) return selected;
  
  // Obtener clave para tracking (usar el primer destino disponible)
  const firstVenue = Array.from(destMap.keys())[0] || 'general';
  const destination = allImages[0]?.destination || 'CUN';
  const key = `${destination}/${firstVenue}`;
  const used = imageUsageTracker.get(key) || new Set();
  
  // Filtrar imágenes no usadas
  const unused = allImages.filter(img => !used.has(img.path));
  
  while (selected.length < count && (unused.length > 0 || allImages.length > 0)) {
    if (unused.length > 0) {
      // Usar imagen no usada
      const randomIndex = Math.floor(Math.random() * unused.length);
      const img = unused[randomIndex];
      selected.push(img);
      used.add(img.path);
      unused.splice(randomIndex, 1);
    } else {
      // Todas usadas, resetear tracking
      imageUsageTracker.set(key, new Set());
      const img = allImages[Math.floor(Math.random() * allImages.length)];
      selected.push(img);
      imageUsageTracker.get(key)!.add(img.path);
      break; // Solo una vez al resetear
    }
  }
  
  if (!imageUsageTracker.has(key)) {
    imageUsageTracker.set(key, used);
  }
  
  return selected;
}

/**
 * Inserta imágenes en el contenido HTML
 */
function insertImagesIntoContent(content: string, images: ImageInfo[]): string {
  if (images.length === 0) return content;
  
  // Remover imágenes existentes que no sean de PoolFotos
  let cleanedContent = content
    .replace(/<div class="post-image-wrapper"[^>]*>.*?<\/div>/gs, '')
    .replace(/<img[^>]*src="[^"]*blog-images[^"]*"[^>]*>/gi, '')
    .replace(/<img[^>]*src="[^"]*blog-images[^"]*"[^>]*\/>/gi, '');
  
  // Generar HTML de imágenes
  const imagesHtml = images.map(img => {
    const altText = img.venue ? `${img.venue} event image` : 'Event image';
    return `<div class="post-image-wrapper" style="margin: 2rem 0;">\n  <img\n    src="${img.path}"\n    alt="${altText}"\n    style="width: 100%; height: auto; border-radius: 8px;"\n    loading="lazy"\n  />\n</div>`;
  }).join('\n\n');
  
  // Buscar el primer H1 y insertar después
  const h1Match = cleanedContent.match(/<h1>.*?<\/h1>/i);
  if (h1Match) {
    const h1End = h1Match.index! + h1Match[0].length;
    const before = cleanedContent.substring(0, h1End);
    const after = cleanedContent.substring(h1End);
    return before + '\n\n' + imagesHtml + '\n\n' + after;
  }
  
  // Si no hay H1, buscar el primer párrafo
  const firstPMatch = cleanedContent.match(/<p>/i);
  if (firstPMatch) {
    const pIndex = firstPMatch.index!;
    const before = cleanedContent.substring(0, pIndex);
    const after = cleanedContent.substring(pIndex);
    return before + imagesHtml + '\n\n' + after;
  }
  
  // Si no hay nada, insertar al inicio
  return imagesHtml + '\n\n' + cleanedContent;
}

/**
 * Función principal
 */
async function insertPoolFotosImages() {
  console.log('🖼️  Iniciando inserción de imágenes de PoolFotos...\n');
  
  // Obtener todas las imágenes organizadas
  console.log('📂 Escaneando carpeta PoolFotos...');
  const allImagesByDest = getAllPoolFotosImages();
  
  let totalImages = 0;
  for (const destMap of allImagesByDest.values()) {
    for (const images of destMap.values()) {
      totalImages += images.length;
    }
  }
  
  console.log(`✅ Encontradas ${totalImages} imágenes en ${allImagesByDest.size} destinos\n`);
  
  if (totalImages === 0) {
    console.error('❌ No se encontraron imágenes en PoolFotos');
    return;
  }
  
  // Leer blogPosts.ts
  const blogPostsPath = join(process.cwd(), 'data', 'blogPosts.ts');
  let blogPostsContent = await readFile(blogPostsPath, 'utf-8');
  
  // Extraer posts - buscar por patrón id: 'X' o id: "X" (con espacios o sin espacios)
  const posts: PostInfo[] = [];
  const postIdPattern = /id\s*:\s*['"]([^'"]+)['"]/g;
  const postIds: string[] = [];
  let idMatch;
  
  while ((idMatch = postIdPattern.exec(blogPostsContent)) !== null) {
    postIds.push(idMatch[1]);
  }
  
  console.log(`📝 Encontrados ${postIds.length} posts\n`);
  
  if (postIds.length === 0) {
    console.error('❌ No se encontraron posts. Verificando formato del archivo...');
    // Intentar otro patrón
    const altPattern = /['"](\d+)['"]/g;
    const altMatches = blogPostsContent.match(altPattern);
    if (altMatches) {
      console.log(`   Encontrados ${altMatches.length} posibles IDs con patrón alternativo`);
    }
    return;
  }
  
  // Extraer información de cada post
  for (const postId of postIds) {
    // Buscar el inicio del objeto del post
    const postStartPattern = new RegExp(`id:\\s*['"]${postId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'i');
    const postStartMatch = blogPostsContent.match(postStartPattern);
    
    if (!postStartMatch) continue;
    
    const startIndex = postStartMatch.index!;
    
    // Buscar el final del objeto del post (próximo }, que cierra el objeto del array)
    let braceCount = 0;
    let inTemplateString = false;
    let inString = false;
    let stringChar = '';
    let endIndex = startIndex;
    let foundStart = false;
    
    for (let i = startIndex; i < blogPostsContent.length; i++) {
      const char = blogPostsContent[i];
      const prevChar = i > 0 ? blogPostsContent[i - 1] : '';
      const nextChar = i < blogPostsContent.length - 1 ? blogPostsContent[i + 1] : '';
      
      if (!inString && !inTemplateString && char === '`') {
        inTemplateString = true;
      } else if (inTemplateString && char === '`' && prevChar !== '\\') {
        inTemplateString = false;
      } else if (!inTemplateString && !inString && (char === '"' || char === "'")) {
        inString = true;
        stringChar = char;
      } else if (inString && char === stringChar && prevChar !== '\\') {
        inString = false;
      } else if (!inString && !inTemplateString) {
        if (char === '{') {
          braceCount++;
          foundStart = true;
        }
        if (char === '}') {
          braceCount--;
          if (braceCount === 0 && foundStart) {
            endIndex = i + 1;
            break;
          }
        }
      }
    }
    
    // Buscar category ANTES de extraer el postSection completo (más eficiente)
    // Buscar en una ventana más pequeña primero
    const categorySearchWindow = blogPostsContent.substring(startIndex, Math.min(startIndex + 500, blogPostsContent.length));
    
    let category = 'general';
    const categoryIdsMatch = categorySearchWindow.match(/category:\s*CATEGORY_IDS\.(\w+)/i);
    if (categoryIdsMatch) {
      const catId = categoryIdsMatch[1];
      // Convertir CANCUN -> cancun, LOS_CABOS -> los-cabos, etc.
      category = catId.toLowerCase().replace(/_/g, '-');
    } else {
      const categoryStringMatch = categorySearchWindow.match(/category:\s*['"]([^'"]+)['"]/i);
      if (categoryStringMatch) {
        category = categoryStringMatch[1].toLowerCase();
      }
    }
    
    const postSection = blogPostsContent.substring(startIndex, endIndex);
    
    // Extraer bodies - usar un método más robusto
    const esBodyMatch = postSection.match(/es:\s*\{[^}]*body:\s*`([^`]*)`/s);
    const enBodyMatch = postSection.match(/en:\s*\{[^}]*body:\s*`([^`]*)`/s);
    const frBodyMatch = postSection.match(/fr:\s*\{[^}]*body:\s*`([^`]*)`/s);
    const ptBodyMatch = postSection.match(/pt:\s*\{[^}]*body:\s*`([^`]*)`/s);
    
    posts.push({
      id: postId,
      category,
      content: {
        es: { body: esBodyMatch ? esBodyMatch[1] : '' },
        en: { body: enBodyMatch ? enBodyMatch[1] : '' },
        fr: { body: frBodyMatch ? frBodyMatch[1] : '' },
        pt: { body: ptBodyMatch ? ptBodyMatch[1] : '' },
      },
    });
  }
  
  if (posts.length === 0) {
    console.error('❌ No se encontraron posts');
    return;
  }
  
  let totalInserted = 0;
  let postsProcessed = 0;
  
  console.log('📝 Procesando posts...\n');
  
  // Procesar cada post
  for (const post of posts) {
    const images = findRelevantImages(post, allImagesByDest, 3);
    
    if (images.length === 0) {
      console.log(`⚠️  Post ${post.id}: No se encontraron imágenes relevantes`);
      continue;
    }
    
    // Insertar imágenes en cada idioma
    const locales: Array<'es' | 'en' | 'fr' | 'pt'> = ['es', 'en', 'fr', 'pt'];
    
    for (const locale of locales) {
      const content = post.content[locale]?.body || '';
      if (!content || content.trim().length === 0) continue;
      
      // Verificar si ya tiene imágenes de PoolFotos
      const hasPoolFotos = content.includes('/assets/PoolFotos/');
      
      // Si ya tiene imágenes de PoolFotos, reemplazarlas con las nuevas (rotación)
      // Esto asegura que todas las imágenes se usen antes de repetir
      let newContent = content;
      
      if (hasPoolFotos) {
        // Remover imágenes existentes de PoolFotos para reemplazarlas
        newContent = newContent.replace(/<div class="post-image-wrapper"[^>]*>.*?<\/div>/gs, '');
        newContent = newContent.replace(/<img[^>]*src="[^"]*PoolFotos[^"]*"[^>]*>/gi, '');
      } else {
        // Remover imágenes antiguas de blog-images
        newContent = newContent
          .replace(/<div class="post-image-wrapper"[^>]*>.*?<\/div>/gs, '')
          .replace(/<img[^>]*src="[^"]*blog-images[^"]*"[^>]*>/gi, '');
      }
      
      // Insertar nuevas imágenes (ya se limpió arriba)
      newContent = insertImagesIntoContent(newContent, images);
      
      // Buscar y reemplazar el body del locale específico para este post
      const postIdPattern = new RegExp(`id:\\s*['"]${post.id}['"]`, 'i');
      const postIdMatch = blogPostsContent.match(postIdPattern);
      
      if (postIdMatch) {
        const postStartIndex = postIdMatch.index!;
        let postEndIndex = blogPostsContent.indexOf('\n  },', postStartIndex);
        if (postEndIndex === -1) {
          postEndIndex = blogPostsContent.length;
        }
        
        const postSection = blogPostsContent.substring(postStartIndex, postEndIndex);
        const localeBodyPattern = new RegExp(
          `(${locale}:\\s*\\{[^}]*body:\\s*\`)([^\`]*)(\`)`,
          's'
        );
        
        const localeBodyMatch = postSection.match(localeBodyPattern);
        
        if (localeBodyMatch) {
          const beforeBody = localeBodyMatch[1];
          const afterBody = localeBodyMatch[3];
          
          // Escapar backticks y $ en el contenido nuevo
          const escapedContent = newContent.replace(/`/g, '\\`').replace(/\${/g, '\\${');
          
          const newPostSection = postSection.replace(
            localeBodyPattern,
            `${beforeBody}${escapedContent}${afterBody}`
          );
          
          blogPostsContent = blogPostsContent.substring(0, postStartIndex) + 
                           newPostSection + 
                           blogPostsContent.substring(postEndIndex);
        }
      }
      
      // Contar solo si realmente insertamos
      if (newContent !== content) {
        totalInserted += images.length;
      }
    }
    
    postsProcessed++;
    const imageNames = images.map(img => img.path.split('/').pop()).join(', ');
    console.log(`✅ Post ${post.id} (${post.category}): ${images.length} imágenes - ${imageNames}`);
  }
  
  // Guardar archivo
  console.log(`\n💾 Guardando cambios...`);
  await writeFile(blogPostsPath, blogPostsContent, 'utf-8');
  
  console.log(`\n✅ COMPLETADO`);
  console.log(`   Posts procesados: ${postsProcessed}`);
  console.log(`   Total imágenes insertadas: ${totalInserted}`);
  console.log(`   Promedio por post: ${(totalInserted / (postsProcessed * 4)).toFixed(1)} por idioma`);
}

if (require.main === module) {
  insertPoolFotosImages().catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}

export { insertPoolFotosImages };










