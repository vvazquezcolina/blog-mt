import { writeFile, mkdir, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { blogPosts } from '../data/blogPosts';

/**
 * Script para re-descargar solo las imágenes problemáticas
 * con el nuevo filtro xxlarge y mejor filtrado
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

interface ProblematicImage {
  postId: string;
  locale: string;
  imageNumber: string;
  venueName: string;
  destination: string;
  reason: string;
}

/**
 * Carga variables de entorno
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

const VENUE_QUERIES: Record<string, (destination: string) => string> = {
  'Mandala Beach': (dest) => `"Mandala Beach" ${dest} -"Coco Bongo" -"Coco Beach" -hotel -resort -booking -expedia -"Señor Frog"`,
  'D\'Cave': (dest) => `"D'Cave" ${dest} club underground -hotel -resort`,
  'La Vaquita': (dest) => `"La Vaquita" ${dest} antro -hotel -resort`,
};

const CATEGORY_TO_DESTINATION: Record<string, string> = {
  'cancun': 'Cancun',
  'tulum': 'Tulum',
  'playa-del-carmen': 'Playa del Carmen',
  'los-cabos': 'Los Cabos',
  'puerto-vallarta': 'Puerto Vallarta',
  'general': 'Cancun',
};

/**
 * Busca imagen con filtros mejorados
 */
async function searchImage(query: string, apiKey: string, searchEngineId: string): Promise<string | null> {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    const currentDay = String(currentDate.getDate()).padStart(2, '0');
    const endDate = `${currentYear}${currentMonth}${currentDay}`;
    const startDate = `20220101`;
    
    const params = new URLSearchParams({
      key: apiKey,
      cx: searchEngineId,
      q: query,
      searchType: 'image',
      num: '10',
      safe: 'active',
      imgSize: 'xxlarge', // XXL para imágenes grandes
      imgType: 'photo',
      imgColorType: 'color',
      sort: `date:r:${startDate}:${endDate}`,
      fileType: 'jpg',
    });

    const url = `https://www.googleapis.com/customsearch/v1?${params.toString()}`;
    const response = await fetch(url);
    const data: GoogleSearchResponse = await response.json();
    
    if (data.error || !data.items || data.items.length === 0) {
      return null;
    }
    
    // Filtrado mejorado
    const filteredResults = data.items.filter(item => {
      const url = item.link.toLowerCase();
      const title = (item.title || '').toLowerCase();
      const contextLink = (item.image?.contextLink || '').toLowerCase();
      
      // Excluir thumbnails y URLs problemáticas
      const isThumbnail = url.includes('lookaside.fbsbx.com') || 
                         url.includes('instagram.com/crawler') ||
                         (item.image.width && item.image.width < 1000) ||
                         (item.image.height && item.image.height < 800);
      
      const excludeUrls = [
        'lokuradespedidas.es',
        'lookaside.fbsbx.com',
        '10/59/bf/be.jpg', // Imagen duplicada de TripAdvisor
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
    
    if (filteredResults.length === 0) return null;
    
    // Evitar duplicados usando base URL
    const seenUrls = new Set<string>();
    const uniqueResults = filteredResults.filter(item => {
      const baseUrl = item.link.split('?')[0].split('/').slice(-2).join('/'); // Últimos 2 segmentos
      if (seenUrls.has(baseUrl)) return false;
      seenUrls.add(baseUrl);
      return true;
    });
    
    const finalResults = uniqueResults.length > 0 ? uniqueResults : filteredResults;
    const randomIndex = Math.floor(Math.random() * Math.min(3, finalResults.length));
    return finalResults[randomIndex].link;
  } catch (error) {
    return null;
  }
}

/**
 * Descarga imagen
 */
async function downloadImage(imageUrl: string, savePath: string): Promise<boolean> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return false;
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const dir = join(savePath, '..');
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }
    
    await writeFile(savePath, buffer);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Identifica imágenes problemáticas
 */
function identifyProblematicImages(): ProblematicImage[] {
  const problematic: ProblematicImage[] = [];
  
  // Leer reporte
  const reportPath = join(process.cwd(), 'scripts', 'image-download-report.json');
  if (!existsSync(reportPath)) return problematic;
  
  try {
    const reportContent = require(reportPath);
    for (const entry of reportContent) {
      if (!entry.url) continue;
      
      const url = entry.url.toLowerCase();
      const task = entry.task;
      
      // Identificar problemas
      if (url.includes('lookaside.fbsbx.com') || 
          url.includes('lokuradespedidas.es') ||
          url.includes('10/59/bf/be.jpg')) {
        
        const post = blogPosts.find(p => p.id === task.postId);
        const destination = post ? (CATEGORY_TO_DESTINATION[post.category] || 'Cancun') : 'Cancun';
        
        problematic.push({
          postId: task.postId,
          locale: task.locale,
          imageNumber: task.imageNumber,
          venueName: task.venueName,
          destination,
          reason: url.includes('lookaside.fbsbx.com') ? 'Thumbnail Instagram' :
                  url.includes('lokuradespedidas.es') ? 'Pack despedidas' :
                  'Duplicado TripAdvisor',
        });
      }
    }
  } catch (e) {
    console.error('Error leyendo reporte:', e);
  }
  
  return problematic;
}

/**
 * Función principal
 */
async function redownloadProblematicImages() {
  await loadEnvFile();
  
  const apiKey = process.env.GOOGLE_API_KEY;
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
  
  if (!apiKey || !searchEngineId) {
    console.error('❌ Error: Faltan variables de entorno');
    process.exit(1);
  }
  
  console.log('🔍 Identificando imágenes problemáticas...\n');
  const problematic = identifyProblematicImages();
  
  console.log(`✅ Encontradas ${problematic.length} imágenes problemáticas\n`);
  console.log('='.repeat(60));
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < problematic.length; i++) {
    const img = problematic[i];
    console.log(`\n[${i + 1}/${problematic.length}] ${img.postId}/${img.locale}/image-${img.imageNumber}.jpg`);
    console.log(`   Venue: ${img.venueName} | Razón: ${img.reason}`);
    
    const queryFn = VENUE_QUERIES[img.venueName] || VENUE_QUERIES['Mandala Beach'];
    const query = queryFn(img.destination);
    
    const imageUrl = await searchImage(query, apiKey, searchEngineId);
    
    if (!imageUrl) {
      console.log(`   ⚠️  No se encontró imagen`);
      failCount++;
      continue;
    }
    
    console.log(`   ✅ Imagen encontrada: ${imageUrl.substring(0, 80)}...`);
    
    const savePath = join(
      process.cwd(),
      'public',
      'assets',
      'blog-images',
      img.postId,
      img.locale,
      `image-${img.imageNumber}.jpg`
    );
    
    const success = await downloadImage(imageUrl, savePath);
    
    if (success) {
      console.log(`   ✅ Descargada`);
      successCount++;
    } else {
      console.log(`   ❌ Error al descargar`);
      failCount++;
    }
    
    if (i < problematic.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN');
  console.log('='.repeat(60));
  console.log(`✅ Exitosas: ${successCount}`);
  console.log(`❌ Fallidas: ${failCount}`);
  console.log(`📁 Total: ${problematic.length}`);
}

if (require.main === module) {
  redownloadProblematicImages().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
}

export { redownloadProblematicImages };










