import { CategoryId } from '@/data/blogPosts';
import imageMapData from '@/data/imageMap.json';

// Mapeo de categorías a códigos de destino
const CATEGORY_TO_DESTINATION: Record<CategoryId, string[]> = {
  'cancun': ['CUN'],
  'tulum': ['TULUM'],
  'playa-del-carmen': ['PDC'],
  'los-cabos': ['CSL'],
  'puerto-vallarta': ['VTA'],
  'general': ['CUN', 'TULUM', 'PDC', 'CSL', 'VTA'], // General puede usar cualquier destino
};

type ImageMap = {
  [destination: string]: {
    [venue: string]: string[];
  };
};

const imageMap = imageMapData as ImageMap;

// Log para verificar que el imageMap se cargó (solo en desarrollo)
if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('[SERVER] ImageMap loaded:', Object.keys(imageMap).length, 'destinations');
}

/**
 * Genera un número pseudoaleatorio determinístico basado en una semilla
 */
function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash) / 2147483647;
}

/**
 * Obtiene todas las imágenes disponibles para un destino
 */
function getAllImagesForDestination(destination: string): string[] {
  const venues = imageMap[destination];
  if (!venues) return [];

  const allImages: string[] = [];
  Object.values(venues).forEach(images => {
    allImages.push(...images);
  });
  return allImages;
}

/**
 * Mapeo de palabras clave en títulos/slugs a venues
 */
const KEYWORD_TO_VENUE: Record<string, string[]> = {
  'mandala': ['MANDALA'],
  'mandala-beach': ['MANDALA'],
  'vaquita': ['VAQUITA', 'VAQUITAA'],
  'rakata': ['RAKATA'],
  'hof': ['HOF'],
  'dcave': ['Dcave'],
  'santito': ['SANTITO'],
  'bagatelle': ['BAGATELLE'],
  'bonbonniere': ['BONBONNIERE'],
  'themplo': ['TEHMPLO'],
  'vagalume': ['VAGALUME'],
  'santa': ['SANTA'],
  'señor-frogs': ['SEÑOR FROGS'],
  'chicabal': ['CHICABAL'],
};

/**
 * Detecta venues mencionados en el título o slug de un post
 */
function detectVenuesInPost(title: string, slug: string): string[] {
  const text = `${title} ${slug}`.toLowerCase();
  const detectedVenues: string[] = [];
  
  for (const [keyword, venues] of Object.entries(KEYWORD_TO_VENUE)) {
    if (text.includes(keyword)) {
      detectedVenues.push(...venues);
    }
  }
  
  return Array.from(new Set(detectedVenues)); // Eliminar duplicados
}

/**
 * Genera un hash más robusto combinando múltiples valores del post
 */
function generatePostHash(postId: string, title: string, slug: string): string {
  return `${postId}|${title}|${slug}`;
}

/**
 * Selecciona una imagen determinística para un post basada en su ID, título, slug y categoría
 * La misma imagen siempre se asignará al mismo post
 * Prioriza venues mencionados en el título/slug
 */
export function getImageForPost(
  category: CategoryId, 
  postId: string,
  title?: string,
  slug?: string
): string | null {
  try {
    // Generar hash robusto del post para mejor distribución
    const postHash = title && slug 
      ? generatePostHash(postId, title, slug)
      : postId;
    
    // Obtener los destinos posibles para esta categoría
    const destinations = CATEGORY_TO_DESTINATION[category] || [];
    
    if (destinations.length === 0) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`No destinations for category: ${category}`);
      }
      return null;
    }

    // Intentar detectar venues mencionados en el título/slug
    let preferredVenues: string[] = [];
    if (title && slug) {
      preferredVenues = detectVenuesInPost(title, slug);
    }

    // Seleccionar un destino determinístico basado en el hash del post
    const destinationSeed = seededRandom(postHash);
    const destinationIndex = Math.floor(destinationSeed * destinations.length);
    const destination = destinations[destinationIndex];

    // Obtener todos los venues para este destino
    const venues = imageMap[destination];
    
    if (!venues || Object.keys(venues).length === 0) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`No venues found for destination: ${destination}`);
      }
      return null;
    }

    const venueNames = Object.keys(venues);
    let selectedVenue: string;
    let selectedImages: string[];

    // Priorizar venues detectados que existan en este destino
    const availablePreferredVenues = preferredVenues.filter(v => venueNames.includes(v));
    
    if (availablePreferredVenues.length > 0) {
      // Usar uno de los venues preferidos
      const preferredSeed = seededRandom(postHash + 'preferred');
      const preferredIndex = Math.floor(preferredSeed * availablePreferredVenues.length);
      selectedVenue = availablePreferredVenues[preferredIndex];
      selectedImages = venues[selectedVenue] || [];
    } else {
      // Si no hay venues preferidos disponibles, seleccionar uno determinístico
      const venueSeed = seededRandom(postHash + destination);
      const venueIndex = Math.floor(venueSeed * venueNames.length);
      selectedVenue = venueNames[venueIndex];
      selectedImages = venues[selectedVenue] || [];
    }

    if (!selectedImages || selectedImages.length === 0) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`No images found for venue: ${selectedVenue} in destination: ${destination}`);
      }
      return null;
    }

    // Seleccionar una imagen determinística del venue seleccionado
    // Usar el hash completo del post para evitar repeticiones
    const imageSeed = seededRandom(postHash + destination + selectedVenue);
    const imageIndex = Math.floor(imageSeed * selectedImages.length);
    
    const selectedImage = selectedImages[imageIndex];
    if (!selectedImage) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`No image selected for post: ${postId}, category: ${category}`);
      }
      return null;
    }
    
    return selectedImage;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error getting image for post ${postId}:`, error);
    }
    return null;
  }
}

/**
 * Obtiene múltiples imágenes para un post (útil para imágenes dentro del contenido)
 * Asegura que las imágenes sean únicas y mejor distribuidas
 */
export function getMultipleImagesForPost(
  category: CategoryId,
  postId: string,
  count: number = 3,
  title?: string,
  slug?: string
): string[] {
  const images: string[] = [];
  const usedImages = new Set<string>();
  
  // Generar hash base del post
  const postHash = title && slug 
    ? generatePostHash(postId, title, slug)
    : postId;
  
  // Detectar venues mencionados una vez
  let preferredVenues: string[] = [];
  if (title && slug) {
    preferredVenues = detectVenuesInPost(title, slug);
  }
  
  // Obtener destinos posibles
  const destinations = CATEGORY_TO_DESTINATION[category] || [];
  if (destinations.length === 0) return [];
  
  // Recopilar todas las imágenes disponibles de los destinos relevantes
  const allAvailableImages: Array<{image: string; venue: string; destination: string}> = [];
  destinations.forEach(dest => {
    const venues = imageMap[dest];
    if (venues) {
      Object.entries(venues).forEach(([venue, imgs]) => {
        imgs.forEach(img => {
          allAvailableImages.push({ image: img, venue, destination: dest });
        });
      });
    }
  });
  
  if (allAvailableImages.length === 0) return [];
  
  // Priorizar imágenes de venues mencionados
  const preferredImages = allAvailableImages.filter(item => 
    preferredVenues.includes(item.venue)
  );
  
  const regularImages = allAvailableImages.filter(item => 
    !preferredVenues.includes(item.venue)
  );
  
  // Mezclar: 50% de imágenes preferidas, 50% regulares (si hay suficientes)
  const preferredCount = Math.min(
    Math.ceil(count / 2),
    preferredImages.length,
    count
  );
  
  // Agregar imágenes preferidas primero (con reintentos para evitar duplicados)
  let attempts = 0;
  const maxAttempts = preferredImages.length * 2;
  
  while (images.length < preferredCount && attempts < maxAttempts) {
    const seed = seededRandom(postHash + `pref_${images.length}_${attempts}`);
    const availablePrefImages = preferredImages.filter(item => !usedImages.has(item.image));
    
    if (availablePrefImages.length === 0) break;
    
    const index = Math.floor(seed * availablePrefImages.length);
    const selected = availablePrefImages[index];
    if (selected) {
      images.push(selected.image);
      usedImages.add(selected.image);
    }
    attempts++;
  }
  
  // Completar con imágenes regulares
  attempts = 0;
  while (images.length < count && attempts < maxAttempts) {
    const seed = seededRandom(postHash + `img_${images.length}_${attempts}`);
    const availableImages = regularImages.filter(item => !usedImages.has(item.image));
    
    if (availableImages.length === 0) {
      // Si no hay más imágenes únicas, intentar con todas las imágenes
      const anyAvailable = allAvailableImages.filter(item => !usedImages.has(item.image));
      if (anyAvailable.length === 0) break;
      
      const index = Math.floor(seed * anyAvailable.length);
      const selected = anyAvailable[index];
      if (selected) {
        images.push(selected.image);
        usedImages.add(selected.image);
      }
      break;
    }
    
    const index = Math.floor(seed * availableImages.length);
    const selected = availableImages[index];
    if (selected) {
      images.push(selected.image);
      usedImages.add(selected.image);
    }
    attempts++;
  }
  
  return images;
}

/**
 * Selecciona una imagen determinística usando un seed personalizado
 */
function getImageForPostWithSeed(category: CategoryId, seed: string): string | null {
  try {
    const destinations = CATEGORY_TO_DESTINATION[category] || [];
    
    if (destinations.length === 0) {
      return null;
    }

    const destinationSeed = seededRandom(seed);
    const destinationIndex = Math.floor(destinationSeed * destinations.length);
    const destination = destinations[destinationIndex];

    const venues = imageMap[destination];
    if (!venues || Object.keys(venues).length === 0) {
      return null;
    }

    const venueNames = Object.keys(venues);
    const venueSeed = seededRandom(seed + destination);
    const venueIndex = Math.floor(venueSeed * venueNames.length);
    const venue = venueNames[venueIndex];
    const images = venues[venue];

    if (!images || images.length === 0) {
      return null;
    }

    const imageSeed = seededRandom(seed + destination + venue);
    const imageIndex = Math.floor(imageSeed * images.length);
    
    return images[imageIndex] || null;
  } catch (error) {
    return null;
  }
}

/**
 * Selecciona una imagen aleatoria para una categoría
 * Útil para categorías sin post específico
 */
export function getRandomImageForCategory(category: CategoryId): string | null {
  const destinations = CATEGORY_TO_DESTINATION[category] || [];
  
  if (destinations.length === 0) {
    return null;
  }

  // Seleccionar un destino aleatorio
  const destination = destinations[Math.floor(Math.random() * destinations.length)];

  // Obtener todas las imágenes del destino
  const allImages = getAllImagesForDestination(destination);
  
  if (allImages.length === 0) {
    return null;
  }

  // Seleccionar una imagen aleatoria
  return allImages[Math.floor(Math.random() * allImages.length)];
}

/**
 * Mapeo de códigos de destino a nombres completos
 */
const DESTINATION_NAMES: Record<string, string> = {
  'CUN': 'Cancún',
  'TULUM': 'Tulum',
  'PDC': 'Playa del Carmen',
  'CSL': 'Los Cabos',
  'VTA': 'Puerto Vallarta',
};

/**
 * Extrae el nombre del venue de una ruta de imagen
 */
function extractVenueFromPath(imagePath: string): string {
  const parts = imagePath.split('/');
  if (parts.length >= 2) {
    return parts[parts.length - 2];
  }
  return '';
}

/**
 * Extrae el destino de una ruta de imagen
 */
function extractDestinationFromPath(imagePath: string): string {
  const parts = imagePath.split('/');
  if (parts.length >= 3) {
    return parts[parts.length - 3];
  }
  return '';
}

/**
 * Genera un alt text descriptivo para una imagen basado en el post
 */
export function generateImageAltText(
  imagePath: string,
  postTitle: string,
  categoryName?: string,
  destination?: string
): string {
  const imageDestination = destination || extractDestinationFromPath(imagePath);
  const venue = extractVenueFromPath(imagePath);
  const destinationName = DESTINATION_NAMES[imageDestination] || imageDestination;
  
  // Generar alt text descriptivo con información contextual
  let altText = `${postTitle}`;
  
  if (destinationName) {
    altText += ` en ${destinationName}`;
  }
  
  if (categoryName) {
    altText += ` - ${categoryName}`;
  }
  
  // Agregar información del venue si está disponible y es relevante
  if (venue && venue !== '') {
    const venueNames: Record<string, string> = {
      'MANDALA': 'Mandala Beach',
      'VAQUITA': 'Vaquita',
      'VAQUITAA': 'Vaquita',
      'RAKATA': 'Rakata',
      'MB DAY': 'Mandala Beach Day',
      'MB NIGHT': 'Mandala Beach Night',
      'HOF': 'Hof',
      'Dcave': 'Dcave',
      'SANTITO': 'Santito',
      'BAGATELLE': 'Bagatelle',
      'BONBONNIERE': 'Bonbonniere',
      'TEHMPLO': 'Themplo',
      'VAGALUME': 'Vagalume',
      'SANTA': 'Santa',
      'SEÑOR FROGS': 'Señor Frog\'s',
      'CHICABAL': 'Chicabal',
    };
    
    const venueDisplayName = venueNames[venue] || venue;
    altText += ` en ${venueDisplayName}`;
  }
  
  altText += ' - MandalaTickets';
  
  return altText;
}

/**
 * Genera un título descriptivo para una imagen (title attribute)
 */
export function generateImageTitle(
  imagePath: string,
  postTitle: string,
  categoryName?: string
): string {
  const destination = extractDestinationFromPath(imagePath);
  const destinationName = DESTINATION_NAMES[destination] || destination;
  
  let title = postTitle;
  if (categoryName) {
    title += ` - ${categoryName}`;
  }
  if (destinationName) {
    title += ` en ${destinationName}`;
  }
  
  return title;
}