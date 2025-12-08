import { writeFile, mkdir, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { blogPosts } from '../data/blogPosts';

/**
 * Script para descargar todas las imágenes de blog desde Google Custom Search API
 * Analiza los posts, identifica venues y descarga imágenes apropiadas
 */

interface GoogleImageResult {
  link: string;
  title: string;
  image: {
    contextLink: string;
    height: number;
    width: number;
    byteSize?: number;
  };
}

interface GoogleSearchResponse {
  items?: GoogleImageResult[];
  error?: {
    message: string;
    code: number;
  };
}

interface SearchImageOptions {
  minYear?: number;
  maxResults?: number;
  imgSize?: 'large' | 'medium' | 'icon' | 'xlarge' | 'xxlarge' | 'huge';
  imgType?: 'clipart' | 'face' | 'lineart' | 'stock' | 'photo' | 'animated';
  fileType?: 'jpg' | 'png' | 'gif' | 'bmp' | 'svg' | 'webp' | 'ico';
  colorType?: 'color' | 'gray' | 'trans';
}

interface ImageDownloadTask {
  postId: string;
  locale: string;
  imageNumber: string;
  venueName: string;
  destination: string;
  query: string;
  savePath: string;
}

/**
 * Carga variables de entorno desde .env.local
 */
async function loadEnvFile() {
  const envPath = join(process.cwd(), '.env.local');
  if (existsSync(envPath)) {
    const content = await readFile(envPath, 'utf-8');
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim();
          process.env[key.trim()] = value;
        }
      }
    }
  }
}

/**
 * Mapeo de nombres de venues a queries de búsqueda
 */
const VENUE_QUERIES: Record<string, (destination: string) => string> = {
  'Mandala Beach': (dest) => `"Mandala Beach" ${dest} -"Coco Bongo" -"Coco Beach" -hotel -resort -booking -expedia -"Señor Frog"`,
  'Mandala Beach Day': (dest) => `"Mandala Beach Day" ${dest} -"Coco Bongo" -"Coco Beach" -hotel -resort`,
  'Mandala Beach Night': (dest) => `"Mandala Beach Night" ${dest} OR "Mandala Beach" ${dest} pool party night -hotel -resort`,
  'D\'Cave': (dest) => `"D'Cave" ${dest} club underground -hotel -resort`,
  'Dcave': (dest) => `"D'Cave" ${dest} club underground -hotel -resort`,
  'La Vaquita': (dest) => `"La Vaquita" ${dest} antro -hotel -resort`,
  'VAQUITA': (dest) => `"La Vaquita" ${dest} antro -hotel -resort`,
  'House Of Fiesta': (dest) => `"House Of Fiesta" ${dest} OR "HOF" ${dest} -hotel -resort`,
  'HOF': (dest) => `"House Of Fiesta" ${dest} OR "HOF" ${dest} -hotel -resort`,
  'Rakata': (dest) => `"Rakata" ${dest} reggaeton club -hotel -resort`,
  'RAKATA': (dest) => `"Rakata" ${dest} reggaeton club -hotel -resort`,
};

/**
 * Mapeo de categorías a destinos
 */
const CATEGORY_TO_DESTINATION: Record<string, string> = {
  'cancun': 'Cancun',
  'tulum': 'Tulum',
  'playa-del-carmen': 'Playa del Carmen',
  'los-cabos': 'Los Cabos',
  'puerto-vallarta': 'Puerto Vallarta',
  'general': 'Cancun', // Default
};

/**
 * Extrae nombres de venues del contenido del post
 */
function extractVenuesFromContent(content: string): Array<{ name: string; section: string }> {
  const venues: Array<{ name: string; section: string }> = [];
  
  // Buscar secciones con h3 que mencionen venues
  const h3Pattern = /<h3>(\d+)\.\s*([^<]+)<\/h3>/g;
  let match;
  
  while ((match = h3Pattern.exec(content)) !== null) {
    const sectionNumber = match[1];
    const sectionTitle = match[2];
    
    // Buscar venues conocidos en el título de la sección
    for (const [venueKey, queryFn] of Object.entries(VENUE_QUERIES)) {
      if (sectionTitle.toLowerCase().includes(venueKey.toLowerCase())) {
        venues.push({ name: venueKey, section: sectionNumber });
        break;
      }
    }
  }
  
  return venues;
}

/**
 * Busca una imagen usando Google Custom Search API con filtros
 */
async function searchImage(
  query: string, 
  apiKey: string, 
  searchEngineId: string,
  options?: SearchImageOptions
): Promise<string | null> {
  try {
    const {
      minYear = 2022,
      maxResults = 10,
      imgSize = 'xxlarge', // Cambiado a xxlarge para imágenes más grandes
      imgType = 'photo',
      fileType = 'jpg',
      colorType = 'color',
    } = options || {};

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    const currentDay = String(currentDate.getDate()).padStart(2, '0');
    const endDate = `${currentYear}${currentMonth}${currentDay}`;
    const startDate = `${minYear}0101`;
    
    const params = new URLSearchParams({
      key: apiKey,
      cx: searchEngineId,
      q: query,
      searchType: 'image',
      num: String(maxResults),
      safe: 'active',
      imgSize: imgSize,
      imgType: imgType,
      imgColorType: colorType,
      sort: `date:r:${startDate}:${endDate}`,
    });

    if (fileType) {
      params.append('fileType', fileType);
    }

    const url = `https://www.googleapis.com/customsearch/v1?${params.toString()}`;
    
    const response = await fetch(url);
    const data: GoogleSearchResponse = await response.json();
    
    if (data.error) {
      console.error(`❌ Error de API: ${data.error.message}`);
      return null;
    }
    
    if (!data.items || data.items.length === 0) {
      return null;
    }
    
    // Filtrar resultados
    const filteredResults = data.items.filter(item => {
      const url = item.link.toLowerCase();
      const title = (item.title || '').toLowerCase();
      const contextLink = (item.image?.contextLink || '').toLowerCase();
      
      // Excluir thumbnails pequeños (Instagram, Facebook)
      const isThumbnail = url.includes('lookaside.fbsbx.com') || 
                         url.includes('instagram.com') ||
                         url.includes('thumbnail') ||
                         (item.image.width && item.image.width < 800) ||
                         (item.image.height && item.image.height < 600);
      
      // Excluir URLs específicas problemáticas
      const excludeUrls = [
        'lokuradespedidas.es', // Pack de despedidas, no es el venue
        'lookaside.fbsbx.com', // Thumbnails de Facebook/Instagram
      ];
      
      const excludeTerms = [
        '/hotel', '/resort', 'booking.com', 'expedia', 'tripadvisor.com/hotels',
        'agoda', 'priceline', 'hotels.com', 'marriott', 'hilton', 'hyatt',
        'bstatic.com/xdata/images/hotel'
      ];
      
      const competitors = [
        'coco bongo', 'coco beach', 'señor frog', 'senor frog',
        'cancun beach club', 'grand oasis', 'oasis', 'palace resorts'
      ];
      
      const isExcludedUrl = excludeUrls.some(term => url.includes(term));
      const isHotelUrl = excludeTerms.some(term => url.includes(term));
      const isHotelTitle = title.includes('hotel') && !title.includes('beach club') && !title.includes('mandala');
      const isCompetitor = competitors.some(comp => 
        title.includes(comp) || contextLink.includes(comp) || url.includes(comp.replace(' ', '-'))
      );
      
      const isRelevant = (title.includes('mandala') || contextLink.includes('mandala') ||
                          title.includes('vaquita') || contextLink.includes('vaquita') ||
                          title.includes('rakata') || contextLink.includes('rakata') ||
                          title.includes('d\'cave') || contextLink.includes('d\'cave') ||
                          title.includes('house of fiesta') || contextLink.includes('house of fiesta')) &&
                        !title.includes('coco') && !contextLink.includes('coco');
      
      return !isThumbnail && !isExcludedUrl && !isHotelUrl && !isHotelTitle && !isCompetitor && isRelevant;
    });
    
    const resultsToUse = filteredResults.length > 0 ? filteredResults : data.items;
    if (resultsToUse.length === 0) return null;
    
    // Evitar duplicados: usar un hash de la URL para seleccionar consistentemente
    // pero variar entre los primeros resultados
    const seenUrls = new Set<string>();
    const uniqueResults = resultsToUse.filter(item => {
      const baseUrl = item.link.split('?')[0]; // Sin parámetros de query
      if (seenUrls.has(baseUrl)) return false;
      seenUrls.add(baseUrl);
      return true;
    });
    
    const finalResults = uniqueResults.length > 0 ? uniqueResults : resultsToUse;
    const randomIndex = Math.floor(Math.random() * Math.min(3, finalResults.length));
    return finalResults[randomIndex].link;
  } catch (error) {
    console.error(`❌ Error al buscar imagen:`, error);
    return null;
  }
}

/**
 * Descarga una imagen desde una URL
 */
async function downloadImage(imageUrl: string, savePath: string): Promise<boolean> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const dir = join(savePath, '..');
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }
    
    await writeFile(savePath, buffer);
    return true;
  } catch (error) {
    console.error(`❌ Error al descargar:`, error);
    return false;
  }
}

/**
 * Genera tareas de descarga analizando los posts
 * Busca secciones con h3 que mencionen venues y genera imágenes para ellas
 */
function generateDownloadTasks(): ImageDownloadTask[] {
  const tasks: ImageDownloadTask[] = [];
  
  console.log(`📊 Procesando ${blogPosts.length} posts...\n`);
  
  for (const post of blogPosts) {
    const destination = CATEGORY_TO_DESTINATION[post.category] || 'Cancun';
    const content = post.content.es?.body || '';
    
    if (!content) {
      continue; // Saltar posts sin contenido
    }
    
    // Buscar secciones con h3 que mencionen venues
    const h3Pattern = /<h3>(\d+)\.\s*([^<]+)<\/h3>/g;
    const venues: Array<{ name: string; section: string; index: number }> = [];
    let match;
    
    // Reset regex lastIndex
    h3Pattern.lastIndex = 0;
    while ((match = h3Pattern.exec(content)) !== null) {
      const sectionNumber = match[1];
      const sectionTitle = match[2];
      const index = match.index;
      
      // Buscar venues conocidos en el título de la sección
      for (const [venueKey] of Object.entries(VENUE_QUERIES)) {
        if (sectionTitle.toLowerCase().includes(venueKey.toLowerCase())) {
          venues.push({ name: venueKey, section: sectionNumber, index });
          break;
        }
      }
    }
    
    // Si no se encontraron venues con el patrón exacto, buscar en todo el contenido
    if (venues.length === 0) {
      // Buscar menciones de venues en el contenido
      for (const [venueKey] of Object.entries(VENUE_QUERIES)) {
        if (content.toLowerCase().includes(venueKey.toLowerCase())) {
          venues.push({ name: venueKey, section: '1', index: 0 });
          break; // Solo el primero encontrado
        }
      }
    }
    
    // Para cada venue encontrado, generar una tarea de descarga
    // Usar hasta 3 imágenes por post (image-1, image-2, image-3)
    const maxImages = Math.min(3, venues.length || 1); // Si no hay venues, usar 1 imagen genérica
    
    for (let i = 0; i < maxImages; i++) {
      const venue = venues[i] || { name: 'Mandala Beach', section: '1', index: 0 };
      
      const queryFn = VENUE_QUERIES[venue.name] || VENUE_QUERIES['Mandala Beach'];
      const query = queryFn(destination);
      
      const imageNumber = String(i + 1);
      const savePath = join(
        process.cwd(),
        'public',
        'assets',
        'blog-images',
        post.id,
        'es',
        `image-${imageNumber}.jpg`
      );
      
      // Agregar tarea (descargar incluso si existe para actualizar con nuevos filtros)
      tasks.push({
        postId: post.id,
        locale: 'es',
        imageNumber,
        venueName: venue.name,
        destination,
        query,
        savePath,
      });
    }
  }
  
  return tasks;
}

/**
 * Función principal
 */
async function downloadAllBlogImages() {
  await loadEnvFile();
  
  const apiKey = process.env.GOOGLE_API_KEY;
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
  
  if (!apiKey || !searchEngineId) {
    console.error('❌ Error: Faltan variables de entorno GOOGLE_API_KEY y GOOGLE_SEARCH_ENGINE_ID');
    process.exit(1);
  }
  
  console.log('📋 Analizando posts para generar tareas de descarga...\n');
  const tasks = generateDownloadTasks();
  
  console.log(`✅ Encontradas ${tasks.length} imágenes para descargar\n`);
  
  // Cargar estado previo si existe
  const statePath = join(process.cwd(), 'scripts', 'ESTADO_PARA_MANANA.json');
  let startIndex = 0;
  let previousSuccess = 0;
  let previousFail = 0;
  const processedTasks = new Set<string>();
  
  if (existsSync(statePath)) {
    try {
      const stateContent = await readFile(statePath, 'utf-8');
      const state = JSON.parse(stateContent);
      if (state.progreso) {
        previousSuccess = state.progreso.exitosas || 0;
        previousFail = state.progreso.fallidas || 0;
        console.log(`📂 Estado previo encontrado: ${previousSuccess} exitosas, ${previousFail} fallidas\n`);
        
        // Cargar reporte para saber cuáles ya se procesaron
        const reportPath = join(process.cwd(), 'scripts', 'image-download-report.json');
        if (existsSync(reportPath)) {
          const reportContent = await readFile(reportPath, 'utf-8');
          const report = JSON.parse(reportContent);
          for (const entry of report) {
            const key = `${entry.task.postId}-${entry.task.locale}-${entry.task.imageNumber}`;
            processedTasks.add(key);
          }
        }
      }
    } catch (e) {
      // Si no se puede leer el estado, empezar desde el principio
    }
  }
  
  // Filtrar tareas ya procesadas
  const pendingTasks = tasks.filter(task => {
    const key = `${task.postId}-${task.locale}-${task.imageNumber}`;
    return !processedTasks.has(key);
  });
  
  if (pendingTasks.length < tasks.length) {
    console.log(`📊 Tareas pendientes: ${pendingTasks.length} de ${tasks.length}\n`);
  }
  
  console.log('='.repeat(60));
  
  let successCount = previousSuccess;
  let failCount = previousFail;
  const results: Array<{ task: ImageDownloadTask; success: boolean; url?: string }> = [];
  
  // Cargar resultados previos si existen
  const reportPath = join(process.cwd(), 'scripts', 'image-download-report.json');
  if (existsSync(reportPath)) {
    try {
      const reportContent = await readFile(reportPath, 'utf-8');
      const prevResults = JSON.parse(reportContent);
      results.push(...prevResults);
    } catch (e) {
      // Ignorar si no se puede leer
    }
  }
  
  for (let i = 0; i < pendingTasks.length; i++) {
    const task = pendingTasks[i];
    const globalIndex = tasks.findIndex(t => 
      t.postId === task.postId && 
      t.locale === task.locale && 
      t.imageNumber === task.imageNumber
    ) + 1;
    console.log(`\n[${globalIndex}/${tasks.length}] Post ${task.postId}, ${task.locale}, imagen ${task.imageNumber}`);
    console.log(`   Venue: ${task.venueName} en ${task.destination}`);
    console.log(`   Query: "${task.query}"`);
    
    // Buscar imagen
    const imageUrl = await searchImage(task.query, apiKey, searchEngineId, {
      minYear: 2022,
      maxResults: 10,
      imgSize: 'xxlarge', // Cambiado a xxlarge
      imgType: 'photo',
      fileType: 'jpg',
      colorType: 'color',
    });
    
    if (!imageUrl) {
      console.log(`   ⚠️  No se encontró imagen`);
      failCount++;
      results.push({ task, success: false });
      continue;
    }
    
    console.log(`   ✅ Imagen encontrada: ${imageUrl.substring(0, 80)}...`);
    
    // Descargar imagen
    const success = await downloadImage(imageUrl, task.savePath);
    
    if (success) {
      console.log(`   ✅ Descargada: ${task.savePath}`);
      successCount++;
      results.push({ task, success: true, url: imageUrl });
    } else {
      console.log(`   ❌ Error al descargar`);
      failCount++;
      results.push({ task, success: false });
    }
    
    // Pausa para no exceder quota
    if (i < pendingTasks.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 segundo entre requests
    }
  }
  
  // Resumen
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN');
  console.log('='.repeat(60));
  console.log(`✅ Exitosas: ${successCount}`);
  console.log(`❌ Fallidas: ${failCount}`);
  console.log(`📁 Total: ${tasks.length}`);
  
  // Guardar reporte
  const reportPath = join(process.cwd(), 'scripts', 'image-download-report.json');
  await writeFile(reportPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`\n📄 Reporte guardado en: ${reportPath}`);
  
  // Guardar estado para continuar mañana
  const statePath = join(process.cwd(), 'scripts', 'ESTADO_PARA_MANANA.json');
  const completed = (successCount + failCount) === tasks.length;
  const state = {
    fecha: new Date().toISOString().split('T')[0],
    estado: completed ? "Completado" : "Quota agotada - Continuar mañana",
    progreso: {
      totalTareas: tasks.length,
      completadas: successCount + failCount,
      exitosas: successCount,
      fallidas: failCount,
      ultimaProcesada: tasks.length,
    },
    quota: {
      agotada: !completed,
      mensaje: completed ? "N/A" : "Quota exceeded for quota metric 'Queries'",
      reinicio: "Medianoche PST (mañana)",
    },
    instrucciones: {
      continuar: "npm run download-all-blog-images",
      verificar: "cat scripts/download-log.txt | tail -30",
      verProgreso: "find public/assets/blog-images -name '*.jpg' | wc -l",
    },
  };
  await writeFile(statePath, JSON.stringify(state, null, 2), 'utf-8');
  console.log(`📝 Estado guardado en: ${statePath}`);
  
  if (!completed) {
    const remaining = tasks.length - (successCount + failCount);
    console.log(`\n⚠️  PROCESO INCOMPLETO`);
    console.log(`   Completadas: ${successCount + failCount} de ${tasks.length}`);
    console.log(`   Pendientes: ${remaining}`);
    console.log(`   Para continuar mañana, ejecuta: npm run download-all-blog-images`);
    console.log(`   El script continuará automáticamente desde donde se quedó`);
  } else {
    console.log(`\n✅ PROCESO COMPLETADO`);
    console.log(`   Todas las ${tasks.length} imágenes procesadas`);
  }
}

if (require.main === module) {
  downloadAllBlogImages().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
}

export { downloadAllBlogImages };


