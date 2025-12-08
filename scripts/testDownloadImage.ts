import { writeFile, mkdir, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * Script de prueba para descargar 1 imagen de Google Custom Search API
 * para 1 post específico
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
  minYear?: number; // Año mínimo (ej: 2022)
  maxResults?: number; // Número de resultados a buscar (default: 10)
  imgSize?: 'large' | 'medium' | 'icon' | 'xlarge' | 'xxlarge' | 'huge';
  imgType?: 'clipart' | 'face' | 'lineart' | 'stock' | 'photo' | 'animated';
  fileType?: 'jpg' | 'png' | 'gif' | 'bmp' | 'svg' | 'webp' | 'ico';
  colorType?: 'color' | 'gray' | 'trans';
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
      minYear = 2022, // Por defecto desde 2022
      maxResults = 10, // Buscar 10 resultados para tener opciones
      imgSize = 'xxlarge', // Cambiado a xxlarge para imágenes más grandes
      imgType = 'photo',
      fileType = 'jpg',
      colorType = 'color',
    } = options || {};

    // Construir filtro de fecha
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    const currentDay = String(currentDate.getDate()).padStart(2, '0');
    const endDate = `${currentYear}${currentMonth}${currentDay}`;
    const startDate = `${minYear}0101`; // 1 de enero del año mínimo
    
    // Construir parámetros de URL
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
      sort: `date:r:${startDate}:${endDate}`, // Filtro de fecha
    });

    // Agregar filtro de tipo de archivo si se especifica
    if (fileType) {
      params.append('fileType', fileType);
    }

    const url = `https://www.googleapis.com/customsearch/v1?${params.toString()}`;
    
    console.log(`🔍 Buscando imagen para: "${query}"`);
    console.log(`   Filtros: ${minYear}-${currentYear}, ${imgSize}, ${imgType}, ${colorType}, ${fileType}`);
    
    const response = await fetch(url);
    const data: GoogleSearchResponse = await response.json();
    
    if (data.error) {
      console.error(`❌ Error de API: ${data.error.message} (código: ${data.error.code})`);
      return null;
    }
    
    if (!data.items || data.items.length === 0) {
      console.warn(`⚠️  No se encontraron imágenes para: "${query}"`);
      console.warn(`   Intenta con un año anterior o sin filtro de fecha`);
      return null;
    }
    
    // Filtrar resultados que no sean de hoteles/resorts/competencia y que sean relevantes al venue
    const filteredResults = data.items.filter(item => {
      const url = item.link.toLowerCase();
      const title = (item.title || '').toLowerCase();
      const contextLink = (item.image?.contextLink || '').toLowerCase();
      
      // Excluir hoteles, resorts, booking, expedia, etc.
      const excludeTerms = [
        '/hotel', 
        '/resort', 
        'booking.com', 
        'expedia', 
        'tripadvisor.com/hotels',
        'agoda',
        'priceline',
        'hotels.com',
        'marriott',
        'hilton',
        'hyatt',
        'bstatic.com/xdata/images/hotel' // Booking.com imágenes de hoteles
      ];
      
      // Excluir competencia
      const competitors = [
        'coco bongo',
        'coco beach',
        'señor frog',
        'senor frog',
        'cancun beach club', // genérico, no específico de Mandala
        'grand oasis',
        'oasis',
        'palace resorts'
      ];
      
      // Verificar que la URL no sea claramente de un hotel
      const isHotelUrl = excludeTerms.some(term => url.includes(term));
      const isHotelTitle = title.includes('hotel') && !title.includes('beach club') && !title.includes('mandala');
      
      // Verificar que no sea competencia
      const isCompetitor = competitors.some(comp => 
        title.includes(comp) || 
        contextLink.includes(comp) ||
        url.includes(comp.replace(' ', '-'))
      );
      
      // Verificar relevancia: DEBE mencionar "mandala" específicamente (no solo beach club genérico)
      const isRelevant = (title.includes('mandala') || contextLink.includes('mandala')) &&
                        !title.includes('coco') && // Asegurar que no sea Coco Bongo/Beach
                        !contextLink.includes('coco');
      
      return !isHotelUrl && !isHotelTitle && !isCompetitor && isRelevant;
    });
    
    // Si después de filtrar no hay resultados, usar los originales
    const resultsToUse = filteredResults.length > 0 ? filteredResults : data.items;
    
    // Seleccionar un resultado aleatorio de los primeros 3 para tener variedad
    const resultsToChooseFrom = Math.min(3, resultsToUse.length);
    const randomIndex = Math.floor(Math.random() * resultsToChooseFrom);
    const imageResult = resultsToUse[randomIndex];
    
    console.log(`✅ Imagen encontrada (${randomIndex + 1} de ${resultsToUse.length}${filteredResults.length < data.items.length ? `, ${data.items.length - filteredResults.length} filtrados` : ''}): ${imageResult.link}`);
    console.log(`   Tamaño: ${imageResult.image.width}x${imageResult.image.height}`);
    if (imageResult.image.byteSize) {
      const sizeMB = (imageResult.image.byteSize / (1024 * 1024)).toFixed(2);
      console.log(`   Peso: ${sizeMB} MB`);
    }
    
    return imageResult.link;
  } catch (error) {
    console.error(`❌ Error al buscar imagen:`, error);
    return null;
  }
}

/**
 * Descarga una imagen desde una URL y la guarda localmente
 */
async function downloadImage(imageUrl: string, savePath: string): Promise<boolean> {
  try {
    console.log(`📥 Descargando imagen desde: ${imageUrl}`);
    
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Crear directorio si no existe
    const dir = join(savePath, '..');
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }
    
    await writeFile(savePath, buffer);
    
    const sizeKB = (buffer.length / 1024).toFixed(2);
    console.log(`✅ Imagen guardada: ${savePath} (${sizeKB} KB)`);
    
    return true;
  } catch (error) {
    console.error(`❌ Error al descargar imagen:`, error);
    return false;
  }
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
 * Función principal de prueba
 */
async function testDownloadImage() {
  // Cargar .env.local si existe
  await loadEnvFile();
  
  // Verificar variables de entorno o argumentos de línea de comandos
  let apiKey = process.env.GOOGLE_API_KEY;
  let searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
  
  // Si no están en env, intentar leer de argumentos
  if (!apiKey || !searchEngineId) {
    const args = process.argv.slice(2);
    if (args.length >= 2) {
      apiKey = args[0];
      searchEngineId = args[1];
    }
  }
  
  if (!apiKey || !searchEngineId) {
    console.error('❌ Error: Faltan variables de entorno');
    console.error('   Necesitas configurar:');
    console.error('   - GOOGLE_API_KEY');
    console.error('   - GOOGLE_SEARCH_ENGINE_ID');
    console.error('');
    console.error('   Opción 1: Crea un archivo .env.local con:');
    console.error('   GOOGLE_API_KEY=tu_api_key');
    console.error('   GOOGLE_SEARCH_ENGINE_ID=tu_search_engine_id');
    console.error('');
    console.error('   Opción 2: Pasa las credenciales como argumentos:');
    console.error('   npm run test-download-image -- API_KEY SEARCH_ENGINE_ID');
    process.exit(1);
  }
  
  // Configuración de prueba: Post ID 1, primera imagen en español
  const postId = '1';
  const locale = 'es';
  const imageNumber = '1';
  
  // Query de búsqueda basado en el post
  // Post 1: "Los 10 eventos imperdibles en Cancún este verano"
  // Sección: Mandala Beach Day - usar nombre específico del venue
  // Excluir hoteles, resorts, competencia y términos genéricos
  const searchQuery = '"Mandala Beach" Cancun -"Coco Bongo" -"Coco Beach" -hotel -resort -booking -expedia -"Señor Frog"';
  
  // Ruta donde guardar la imagen
  const imagePath = join(
    process.cwd(),
    'public',
    'assets',
    'blog-images',
    postId,
    locale,
    `image-${imageNumber}.jpg`
  );
  
  console.log('🧪 PRUEBA: Descargar 1 imagen de Google');
  console.log('='.repeat(50));
  console.log(`Post ID: ${postId}`);
  console.log(`Locale: ${locale}`);
  console.log(`Query: "${searchQuery}"`);
  console.log(`Ruta destino: ${imagePath}`);
  console.log('='.repeat(50));
  console.log('');
  
  // Paso 1: Buscar imagen con filtros
  const imageUrl = await searchImage(searchQuery, apiKey, searchEngineId, {
    minYear: 2022, // Solo imágenes desde 2022
    maxResults: 10, // Buscar 10 resultados para tener opciones
    imgSize: 'xxlarge', // Imágenes extra grandes (cambió de large)
    imgType: 'photo', // Solo fotos (no clipart, etc)
    fileType: 'jpg', // Preferir JPG
    colorType: 'color', // Solo imágenes a color
  });
  
  if (!imageUrl) {
    console.error('❌ No se pudo obtener la URL de la imagen');
    process.exit(1);
  }
  
  // Paso 2: Descargar imagen
  const success = await downloadImage(imageUrl, imagePath);
  
  if (success) {
    console.log('');
    console.log('='.repeat(50));
    console.log('✅ PRUEBA EXITOSA');
    console.log(`   Imagen guardada en: ${imagePath}`);
    console.log(`   URL relativa: /assets/blog-images/${postId}/${locale}/image-${imageNumber}.jpg`);
    console.log('='.repeat(50));
  } else {
    console.error('❌ La prueba falló al descargar la imagen');
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  testDownloadImage().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
}

export { testDownloadImage, searchImage, downloadImage };


