// Importar traducciones si están disponibles
import { postTranslations } from './blogPostTranslations';

// Tipo para los IDs de categorías (type-safe) - Ahora organizado por ciudades
export type CategoryId = 
  | 'cancun'
  | 'tulum'
  | 'playa-del-carmen'
  | 'los-cabos'
  | 'puerto-vallarta'
  | 'general';

// Interfaz para la categoría completa
export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  color: string;
}

// Contenido traducido para un post
export interface BlogPostContent {
  title: string;
  excerpt: string;
  slug: string; // Slug puede variar por idioma para SEO
}

// Post completo con soporte multiidioma
export interface BlogPost {
  id: string;
  category: CategoryId;
  date: string;
  author: string;
  featured: boolean;
  image?: string;
  // Contenido en cada idioma
  content: {
    es: BlogPostContent;
    en: BlogPostContent;
    fr: BlogPostContent;
    pt: BlogPostContent;
  };
}

/**
 * Obtiene el contenido traducido de un post según el locale especificado
 * Si el locale no existe, retorna el contenido en español (default)
 * @param post - El post del cual obtener el contenido
 * @param locale - Idioma deseado (es, en, fr, pt)
 * @returns Contenido traducido del post (title, excerpt, slug)
 */
export function getPostContent(post: BlogPost, locale: 'es' | 'en' | 'fr' | 'pt' = 'es'): BlogPostContent {
  return post.content[locale] || post.content.es;
}

/**
 * Busca un post por su slug en cualquier idioma
 * Primero intenta buscar en el locale especificado, si no encuentra, busca en todos los idiomas
 * Esto permite que slugs compartidos funcionen cuando no hay traducciones específicas
 * @param slug - Slug del post a buscar
 * @param locale - Idioma opcional para priorizar la búsqueda
 * @returns El post encontrado o undefined si no existe
 */
export function findPostBySlug(slug: string, locale?: 'es' | 'en' | 'fr' | 'pt'): BlogPost | undefined {
  // Primero intentar buscar en el locale específico si se proporciona
  if (locale) {
    const postByLocale = blogPosts.find(post => post.content[locale]?.slug === slug);
    if (postByLocale) {
      return postByLocale;
    }
  }
  
  // Si no se encuentra en el locale específico, buscar en todos los idiomas
  // Esto es útil cuando los slugs son compartidos entre idiomas (sin traducciones específicas)
  return blogPosts.find(post => {
    return Object.values(post.content).some(content => content.slug === slug);
  });
}

// Constantes para los IDs de categorías (para facilitar el uso)
export const CATEGORY_IDS = {
  CANCUN: 'cancun' as const,
  TULUM: 'tulum' as const,
  PLAYA_DEL_CARMEN: 'playa-del-carmen' as const,
  LOS_CABOS: 'los-cabos' as const,
  PUERTO_VALLARTA: 'puerto-vallarta' as const,
  GENERAL: 'general' as const,
} as const;

// Array de categorías organizadas por ciudades
export const categories: Category[] = [
  {
    id: CATEGORY_IDS.CANCUN,
    name: 'Cancún',
    description: 'Todo sobre eventos, fiestas y vida nocturna en Cancún',
    color: '#1A69D9'
  },
  {
    id: CATEGORY_IDS.TULUM,
    name: 'Tulum',
    description: 'Guías, eventos y experiencias únicas en Tulum',
    color: '#66F7EE'
  },
  {
    id: CATEGORY_IDS.PLAYA_DEL_CARMEN,
    name: 'Playa del Carmen',
    description: 'Descubre la escena nocturna y eventos en Playa del Carmen',
    color: '#55BFEE'
  },
  {
    id: CATEGORY_IDS.LOS_CABOS,
    name: 'Los Cabos',
    description: 'Eventos exclusivos y experiencias en Los Cabos',
    color: '#1A69D9'
  },
  {
    id: CATEGORY_IDS.PUERTO_VALLARTA,
    name: 'Puerto Vallarta',
    description: 'Beach clubs, fiestas y eventos en Puerto Vallarta',
    color: '#66F7EE'
  },
  {
    id: CATEGORY_IDS.GENERAL,
    name: 'General',
    description: 'Consejos, promociones y noticias generales de MandalaTickets',
    color: '#55BFEE'
  }
];

// Helper function para obtener una categoría por su ID
export function getCategoryById(id: CategoryId): Category | undefined {
  return categories.find(cat => cat.id === id);
}

// Helper function para validar si un ID es válido
export function isValidCategoryId(id: string): id is CategoryId {
  return categories.some(cat => cat.id === id);
}

// Helper para convertir estructura antigua a nueva
function createBlogPost(
  id: string,
  title: string,
  slug: string,
  category: CategoryId,
  excerpt: string,
  date: string,
  author: string,
  featured: boolean,
  image?: string
): BlogPost {
  // Intentar usar traducciones si existen, sino usar los datos en español para todos
  const translations = postTranslations[id];
  
  return {
    id,
    category,
    date,
    author,
    featured,
    image,
    content: {
      es: translations?.es || { title, excerpt, slug },
      en: translations?.en || { title, excerpt, slug },
      fr: translations?.fr || { title, excerpt, slug },
      pt: translations?.pt || { title, excerpt, slug },
    },
  };
}

export const blogPosts: BlogPost[] = [
  createBlogPost(
    '1',
    'Los 10 eventos imperdibles en Cancún este verano',
    '10-eventos-imperdibles-cancun-verano',
    CATEGORY_IDS.CANCUN,
    'Descubre los eventos más emocionantes que Cancún tiene preparados para esta temporada de verano. Desde fiestas en la playa hasta festivales de música electrónica.',
    '2024-01-15',
    'Equipo MandalaTickets',
    true
  ),
  createBlogPost(
    '2',
    'Guía completa para disfrutar de Tulum: playas, fiestas y más',
    'guia-completa-disfrutar-tulum-playas-fiestas',
    CATEGORY_IDS.TULUM,
    'Todo lo que necesitas saber para aprovechar al máximo tu visita a Tulum. Incluye los mejores beach clubs, restaurantes y eventos nocturnos.',
    '2024-01-20',
    'Equipo MandalaTickets',
    true
  ),
  createBlogPost(
    '3',
    'Entrevista exclusiva con el DJ residente de Mandala Beach',
    'entrevista-dj-residente-mandala-beach',
    CATEGORY_IDS.GENERAL,
    'Conoce la historia detrás de uno de los DJs más reconocidos de la Riviera Maya y sus planes para los próximos eventos.',
    '2024-01-25',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '4',
    'Cómo aprovechar al máximo las promociones de MandalaTickets',
    'aprovechar-promociones-mandalatickets',
    CATEGORY_IDS.GENERAL,
    'Tips y estrategias para obtener los mejores descuentos y ofertas especiales en tus compras de boletos.',
    '2024-02-01',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '5',
    'Historia y evolución de la vida nocturna en Playa del Carmen',
    'historia-evolucion-vida-nocturna-playa-carmen',
    CATEGORY_IDS.PLAYA_DEL_CARMEN,
    'Un recorrido por la transformación de la escena nocturna en Playa del Carmen y cómo se ha convertido en uno de los destinos más vibrantes.',
    '2024-02-05',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '6',
    'Consejos para organizar una despedida de soltero/a en Los Cabos',
    'consejos-organizar-despedida-soltero-los-cabos',
    CATEGORY_IDS.LOS_CABOS,
    'Guía completa para planificar la despedida de soltero perfecta en Los Cabos, incluyendo eventos y actividades recomendadas.',
    '2024-02-10',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '7',
    'Los mejores beach clubs en Puerto Vallarta para este año',
    'mejores-beach-clubs-puerto-vallarta',
    CATEGORY_IDS.PUERTO_VALLARTA,
    'Una selección de los beach clubs más exclusivos y vibrantes de Puerto Vallarta donde podrás disfrutar de música, comida y ambiente único.',
    '2024-02-15',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '8',
    'Tendencias en música electrónica para 2025',
    'tendencias-musica-electronica-2025',
    CATEGORY_IDS.GENERAL,
    'Las tendencias musicales que marcarán el ritmo de los eventos en 2025 y los artistas que debes conocer.',
    '2024-02-20',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '9',
    'Cómo planificar tu itinerario de fiestas en Cancún',
    'planificar-itinerario-fiestas-cancun',
    CATEGORY_IDS.CANCUN,
    'Estrategias para organizar tu agenda de eventos y aprovechar al máximo tu tiempo en Cancún.',
    '2024-02-25',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '10',
    'Entrevista con el organizador del festival anual en Tulum',
    'entrevista-organizador-festival-anual-tulum',
    CATEGORY_IDS.TULUM,
    'Descubre los secretos detrás de la organización de uno de los festivales más esperados del año en Tulum.',
    '2024-03-01',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '11',
    'Los secretos mejor guardados de la vida nocturna en Los Cabos',
    'secretos-vida-nocturna-los-cabos',
    CATEGORY_IDS.LOS_CABOS,
    'Lugares y eventos exclusivos que solo los locales conocen en Los Cabos.',
    '2024-03-05',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '12',
    'Guía para principiantes: cómo comprar boletos en MandalaTickets',
    'guia-principiantes-comprar-boletos-mandalatickets',
    CATEGORY_IDS.GENERAL,
    'Todo lo que necesitas saber para realizar tu primera compra de boletos de forma fácil y segura.',
    '2024-03-10',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '13',
    'Los 5 eventos más exclusivos en Playa del Carmen este mes',
    '5-eventos-exclusivos-playa-carmen',
    CATEGORY_IDS.PLAYA_DEL_CARMEN,
    'Una selección de los eventos VIP y más exclusivos que no te puedes perder este mes en Playa del Carmen.',
    '2024-03-15',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '14',
    'Cómo vestirse para una noche de fiesta en Tulum',
    'vestirse-noche-fiesta-tulum',
    CATEGORY_IDS.TULUM,
    'Guía de estilo para lucir perfecto en los eventos de Tulum, desde looks casuales hasta outfits más formales.',
    '2024-03-20',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '15',
    'Entrevista con el chef detrás de la gastronomía en Mandala Beach',
    'entrevista-chef-gastronomia-mandala-beach',
    CATEGORY_IDS.GENERAL,
    'Conoce la visión culinaria y los platillos exclusivos que encontrarás en los eventos de Mandala Beach.',
    '2024-03-25',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '16',
    'Los beneficios de reservar tus boletos con anticipación',
    'beneficios-reservar-boletos-anticipacion',
    CATEGORY_IDS.GENERAL,
    'Por qué es mejor comprar tus boletos con tiempo y cómo puedes ahorrar dinero haciéndolo.',
    '2024-04-01',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '17',
    'Historia de los clubes nocturnos más icónicos de Cancún',
    'historia-clubes-nocturnos-iconicos-cancun',
    CATEGORY_IDS.CANCUN,
    'Un recorrido histórico por los clubes que han marcado la escena nocturna de Cancún a lo largo de los años.',
    '2024-04-05',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '18',
    'Cómo disfrutar de una fiesta segura y responsable en Los Cabos',
    'disfrutar-fiesta-segura-responsable-los-cabos',
    CATEGORY_IDS.LOS_CABOS,
    'Consejos importantes para mantenerte seguro mientras disfrutas de los eventos en Los Cabos.',
    '2024-04-10',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '19',
    'Los mejores cócteles para probar en los eventos de MandalaTickets',
    'mejores-cocteles-eventos-mandalatickets',
    CATEGORY_IDS.GENERAL,
    'Una selección de las bebidas más populares y deliciosas que encontrarás en nuestros eventos.',
    '2024-04-15',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '20',
    'Guía de transporte: cómo moverse entre eventos en Playa del Carmen',
    'guia-transporte-moverse-eventos-playa-carmen',
    CATEGORY_IDS.PLAYA_DEL_CARMEN,
    'Opciones de transporte y tips para moverte eficientemente entre diferentes eventos en Playa del Carmen.',
    '2024-04-20',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '21',
    'Entrevista con el diseñador de los escenarios en Tulum',
    'entrevista-disenador-escenarios-tulum',
    CATEGORY_IDS.TULUM,
    'Descubre el proceso creativo detrás de los impresionantes escenarios que hacen únicos los eventos en Tulum.',
    '2024-04-25',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '22',
    'Los 10 artistas emergentes que debes conocer este año',
    '10-artistas-emergentes-conocer-ano',
    CATEGORY_IDS.GENERAL,
    'Una lista de los talentos nuevos que están revolucionando la escena musical y que verás en nuestros eventos.',
    '2024-05-01',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '23',
    'Cómo organizar una fiesta privada en Mandala Beach',
    'organizar-fiesta-privada-mandala-beach',
    CATEGORY_IDS.GENERAL,
    'Guía paso a paso para planificar y ejecutar una celebración privada inolvidable en Mandala Beach.',
    '2024-05-05',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '24',
    'Los mejores lugares para ver el atardecer antes de una fiesta en Puerto Vallarta',
    'mejores-lugares-atardecer-fiesta-puerto-vallarta',
    CATEGORY_IDS.PUERTO_VALLARTA,
    'Spots perfectos para disfrutar de una puesta de sol espectacular antes de comenzar tu noche de fiesta.',
    '2024-05-10',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '25',
    'Tendencias en moda para la vida nocturna en 2025',
    'tendencias-moda-vida-nocturna-2025',
    CATEGORY_IDS.GENERAL,
    'Las tendencias de moda que dominarán las pistas de baile y eventos nocturnos este año.',
    '2024-05-15',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '26',
    'Cómo evitar las filas y entrar rápido a los eventos',
    'evitar-filas-entrar-rapido-eventos',
    CATEGORY_IDS.GENERAL,
    'Estrategias y tips para acceder rápidamente a los eventos sin perder tiempo en filas.',
    '2024-05-20',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '27',
    'Entrevista con el fotógrafo oficial de MandalaTickets',
    'entrevista-fotografo-oficial-mandalatickets',
    CATEGORY_IDS.GENERAL,
    'Conoce al artista detrás de las increíbles fotografías que capturan la esencia de nuestros eventos.',
    '2024-05-25',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '28',
    'Los 5 festivales de música más esperados en México este año',
    '5-festivales-musica-esperados-mexico',
    CATEGORY_IDS.GENERAL,
    'Una guía completa de los festivales musicales más importantes que se realizarán en México durante este año.',
    '2024-06-01',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '29',
    'Cómo mantenerte hidratado y energizado durante una noche de fiesta',
    'mantenerse-hidratado-energizado-noche-fiesta',
    CATEGORY_IDS.GENERAL,
    'Consejos de salud para disfrutar toda la noche sin comprometer tu bienestar.',
    '2024-06-05',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '30',
    'Los mejores souvenirs para llevar de tu experiencia en Tulum',
    'mejores-souvenirs-experiencia-tulum',
    CATEGORY_IDS.TULUM,
    'Ideas de recuerdos únicos que puedes llevar contigo para recordar tu increíble experiencia en Tulum.',
    '2024-06-10',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '31',
    'Entrevista con el equipo de seguridad de MandalaTickets: cómo garantizan tu bienestar',
    'entrevista-equipo-seguridad-mandalatickets',
    CATEGORY_IDS.GENERAL,
    'Conoce las medidas de seguridad implementadas para garantizar una experiencia segura en todos nuestros eventos.',
    '2024-06-15',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '32',
    'Los 10 mejores DJs que han pasado por los eventos de MandalaTickets',
    '10-mejores-djs-eventos-mandalatickets',
    CATEGORY_IDS.GENERAL,
    'Un recuento de los artistas más destacados que han animado nuestros eventos a lo largo del tiempo.',
    '2024-06-20',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '33',
    'Cómo celebrar tu cumpleaños en grande con MandalaTickets',
    'celebrar-cumpleanos-grande-mandalatickets',
    CATEGORY_IDS.GENERAL,
    'Ideas y opciones para hacer de tu cumpleaños una celebración inolvidable en uno de nuestros eventos.',
    '2024-06-25',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '34',
    'Los mejores lugares para cenar antes de una fiesta en Cancún',
    'mejores-lugares-cenar-fiesta-cancun',
    CATEGORY_IDS.CANCUN,
    'Restaurantes recomendados para disfrutar una cena deliciosa antes de comenzar tu noche de fiesta.',
    '2024-07-01',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '35',
    'Tendencias en iluminación y efectos visuales para eventos en 2025',
    'tendencias-iluminacion-efectos-visuales-eventos-2025',
    CATEGORY_IDS.GENERAL,
    'Las innovaciones tecnológicas que están transformando la experiencia visual en los eventos nocturnos.',
    '2024-07-05',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '36',
    'Cómo aprovechar las redes sociales para compartir tu experiencia en los eventos',
    'aprovechar-redes-sociales-compartir-experiencia-eventos',
    CATEGORY_IDS.GENERAL,
    'Tips para crear contenido atractivo y compartir tus mejores momentos de los eventos en redes sociales.',
    '2024-07-10',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '37',
    'Entrevista con el bartender estrella de Mandala Beach',
    'entrevista-bartender-estrella-mandala-beach',
    CATEGORY_IDS.GENERAL,
    'Conoce los secretos detrás de los cócteles más populares y la filosofía del mejor bartender de la Riviera Maya.',
    '2024-07-15',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '38',
    'Los 5 eventos temáticos más divertidos en Playa del Carmen',
    '5-eventos-tematicos-divertidos-playa-carmen',
    CATEGORY_IDS.PLAYA_DEL_CARMEN,
    'Una selección de los eventos con temáticas únicas que hacen de Playa del Carmen un destino especial.',
    '2024-07-20',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '39',
    'Cómo prepararte para una fiesta en la playa: consejos y trucos',
    'prepararse-fiesta-playa-consejos-trucos',
    CATEGORY_IDS.GENERAL,
    'Todo lo que necesitas saber para disfrutar al máximo de una fiesta en la playa sin contratiempos.',
    '2024-07-25',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '40',
    'Los mejores after-parties en Tulum que no te puedes perder',
    'mejores-after-parties-tulum',
    CATEGORY_IDS.TULUM,
    'Guía de los after-parties más exclusivos y vibrantes que continúan la fiesta después del evento principal.',
    '2024-08-01',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '41',
    'Entrevista con el equipo de producción detrás de los eventos de MandalaTickets',
    'entrevista-equipo-produccion-eventos-mandalatickets',
    CATEGORY_IDS.GENERAL,
    'Descubre cómo se crea la magia detrás de escena en cada uno de nuestros eventos.',
    '2024-08-05',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '42',
    'Los 10 momentos más memorables en la historia de MandalaTickets',
    '10-momentos-memorables-historia-mandalatickets',
    CATEGORY_IDS.GENERAL,
    'Un recorrido por los hitos más importantes que han marcado la trayectoria de MandalaTickets.',
    '2024-08-10',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '43',
    'Cómo planificar una escapada de fin de semana llena de fiestas en Los Cabos',
    'planificar-escapada-fin-semana-fiestas-los-cabos',
    CATEGORY_IDS.LOS_CABOS,
    'Guía completa para organizar un fin de semana perfecto lleno de eventos y diversión en Los Cabos.',
    '2024-08-15',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '44',
    'Los mejores lugares para tomar fotos durante los eventos en Puerto Vallarta',
    'mejores-lugares-fotos-eventos-puerto-vallarta',
    CATEGORY_IDS.PUERTO_VALLARTA,
    'Spots fotográficos perfectos para capturar los mejores momentos de tus eventos en Puerto Vallarta.',
    '2024-08-20',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '45',
    'Tendencias en música latina para 2025',
    'tendencias-musica-latina-2025',
    CATEGORY_IDS.GENERAL,
    'Los ritmos y géneros latinos que dominarán los eventos este año.',
    '2024-08-25',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '46',
    'Cómo hacer networking y conocer gente nueva en los eventos',
    'hacer-networking-conocer-gente-eventos',
    CATEGORY_IDS.GENERAL,
    'Estrategias para expandir tu red de contactos mientras disfrutas de los eventos.',
    '2024-09-01',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '47',
    'Entrevista con el diseñador de los flyers y materiales promocionales de MandalaTickets',
    'entrevista-disenador-flyers-materiales-promocionales-mandalatickets',
    CATEGORY_IDS.GENERAL,
    'Conoce el proceso creativo detrás del diseño visual que identifica a MandalaTickets.',
    '2024-09-05',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '48',
    'Los 5 eventos más románticos para parejas en Cancún',
    '5-eventos-romanticos-parejas-cancun',
    CATEGORY_IDS.CANCUN,
    'Eventos especiales diseñados para parejas que buscan una experiencia romántica y memorable.',
    '2024-09-10',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '49',
    'Cómo cuidar tus pertenencias durante una noche de fiesta',
    'cuidar-pertenencias-noche-fiesta',
    CATEGORY_IDS.GENERAL,
    'Consejos prácticos para mantener seguras tus cosas mientras disfrutas de los eventos.',
    '2024-09-15',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '50',
    'Los mejores lugares para desayunar después de una noche de fiesta en Tulum',
    'mejores-lugares-desayunar-despues-fiesta-tulum',
    CATEGORY_IDS.TULUM,
    'Restaurantes perfectos para recuperarte con un delicioso desayuno después de una noche increíble.',
    '2024-09-20',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '51',
    'Entrevista con el equipo de marketing de MandalaTickets: estrategias detrás del éxito',
    'entrevista-equipo-marketing-mandalatickets',
    CATEGORY_IDS.GENERAL,
    'Descubre cómo MandalaTickets ha construido su marca y conectado con miles de asistentes.',
    '2024-09-25',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '52',
    'Los 10 mejores momentos capturados en fotos en los eventos de MandalaTickets',
    '10-mejores-momentos-fotos-eventos-mandalatickets',
    CATEGORY_IDS.GENERAL,
    'Una galería de los momentos más especiales capturados en nuestros eventos a lo largo del tiempo.',
    '2024-10-01',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '53',
    'Cómo organizar una propuesta de matrimonio inolvidable en un evento de MandalaTickets',
    'organizar-propuesta-matrimonio-evento-mandalatickets',
    CATEGORY_IDS.GENERAL,
    'Ideas creativas para hacer tu propuesta de matrimonio en uno de nuestros eventos especiales.',
    '2024-10-05',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '54',
    'Los mejores lugares para comprar outfits de fiesta en Playa del Carmen',
    'mejores-lugares-comprar-outfits-fiesta-playa-carmen',
    CATEGORY_IDS.PLAYA_DEL_CARMEN,
    'Tiendas y boutiques donde encontrarás el outfit perfecto para tus eventos en Playa del Carmen.',
    '2024-10-10',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '55',
    'Tendencias en bebidas y mixología para eventos en 2025',
    'tendencias-bebidas-mixologia-eventos-2025',
    CATEGORY_IDS.GENERAL,
    'Las innovaciones en cócteles y bebidas que verás en los eventos este año.',
    '2024-10-15',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '56',
    'Cómo mantener la energía durante una noche de fiesta sin excederte',
    'mantener-energia-noche-fiesta-sin-excederte',
    CATEGORY_IDS.GENERAL,
    'Consejos para disfrutar toda la noche manteniendo un equilibrio saludable.',
    '2024-10-20',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '57',
    'Entrevista con el equipo de logística de MandalaTickets: cómo organizan eventos exitosos',
    'entrevista-equipo-logistica-mandalatickets',
    CATEGORY_IDS.GENERAL,
    'Conoce el trabajo detrás de escena que hace posible cada evento perfecto.',
    '2024-10-25',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '58',
    'Los 5 eventos más exclusivos para celebrar Año Nuevo en Los Cabos',
    '5-eventos-exclusivos-ano-nuevo-los-cabos',
    CATEGORY_IDS.LOS_CABOS,
    'Opciones VIP para recibir el Año Nuevo de forma inolvidable en Los Cabos.',
    '2024-11-01',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '59',
    'Cómo elegir el evento perfecto según tus gustos musicales',
    'elegir-evento-perfecto-gustos-musicales',
    CATEGORY_IDS.GENERAL,
    'Guía para encontrar el evento que mejor se adapte a tu estilo musical preferido.',
    '2024-11-05',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '60',
    'Los mejores lugares para relajarte después de una noche de fiesta en Puerto Vallarta',
    'mejores-lugares-relajarte-despues-fiesta-puerto-vallarta',
    CATEGORY_IDS.PUERTO_VALLARTA,
    'Spas, playas y lugares tranquilos para recuperarte después de una noche increíble.',
    '2024-11-10',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '61',
    'Entrevista con el equipo de relaciones públicas de MandalaTickets: cómo construyen la comunidad',
    'entrevista-equipo-rrpp-mandalatickets',
    CATEGORY_IDS.GENERAL,
    'Descubre cómo MandalaTickets ha creado una comunidad vibrante de amantes de la fiesta.',
    '2024-11-15',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '62',
    'Los 10 mejores momentos en video de los eventos de MandalaTickets',
    '10-mejores-momentos-video-eventos-mandalatickets',
    CATEGORY_IDS.GENERAL,
    'Una compilación de los videos más emocionantes y memorables de nuestros eventos.',
    '2024-11-20',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '63',
    'Cómo organizar una fiesta sorpresa en uno de los eventos de MandalaTickets',
    'organizar-fiesta-sorpresa-evento-mandalatickets',
    CATEGORY_IDS.GENERAL,
    'Guía paso a paso para planificar una fiesta sorpresa exitosa en uno de nuestros eventos.',
    '2024-11-25',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '64',
    'Los mejores lugares para comprar accesorios de fiesta en Cancún',
    'mejores-lugares-comprar-accesorios-fiesta-cancun',
    CATEGORY_IDS.CANCUN,
    'Tiendas donde encontrarás los accesorios perfectos para complementar tu look de fiesta.',
    '2024-12-01',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '65',
    'Tendencias en decoración y ambientación para eventos en 2025',
    'tendencias-decoracion-ambientacion-eventos-2025',
    CATEGORY_IDS.GENERAL,
    'Las tendencias de diseño que transformarán la experiencia visual de los eventos.',
    '2024-12-05',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '66',
    'Cómo mantener una actitud positiva y disfrutar al máximo de los eventos',
    'mantener-actitud-positiva-disfrutar-maximo-eventos',
    CATEGORY_IDS.GENERAL,
    'Consejos para tener la mejor actitud y aprovechar cada momento de los eventos.',
    '2024-12-10',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '67',
    'Entrevista con el equipo de atención al cliente de MandalaTickets: cómo garantizan una experiencia excepcional',
    'entrevista-equipo-atencion-cliente-mandalatickets',
    CATEGORY_IDS.GENERAL,
    'Conoce cómo el equipo de atención al cliente asegura que cada asistente tenga la mejor experiencia.',
    '2024-12-15',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '68',
    'Los 5 eventos más esperados para la temporada de primavera en Tulum',
    '5-eventos-esperados-temporada-primavera-tulum',
    CATEGORY_IDS.TULUM,
    'Una selección de los eventos más emocionantes que llegarán a Tulum esta primavera.',
    '2024-12-20',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '69',
    'Guía completa de Cancún: playas, eventos y vida nocturna',
    'guia-completa-cancun-playas-eventos-vida-nocturna',
    CATEGORY_IDS.CANCUN,
    'Todo lo que necesitas saber sobre Cancún, desde sus playas hasta su vibrante escena nocturna.',
    '2024-12-25',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '70',
    'Cómo aprovechar los paquetes especiales de MandalaTickets',
    'aprovechar-paquetes-especiales-mandalatickets',
    CATEGORY_IDS.GENERAL,
    'Guía para elegir y aprovechar los mejores paquetes que incluyen eventos, hospedaje y más.',
    '2025-01-01',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '71',
    'Los mejores eventos para solteros en Playa del Carmen',
    'mejores-eventos-solteros-playa-carmen',
    CATEGORY_IDS.PLAYA_DEL_CARMEN,
    'Eventos diseñados especialmente para personas solteras que buscan conocer gente nueva.',
    '2025-01-05',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '72',
    'Cómo planificar tu primera visita a un evento de MandalaTickets',
    'planificar-primera-visita-evento-mandalatickets',
    CATEGORY_IDS.GENERAL,
    'Todo lo que un principiante necesita saber antes de asistir a su primer evento.',
    '2025-01-10',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '73',
    'Entrevista con el DJ internacional que debutará en Los Cabos',
    'entrevista-dj-internacional-debutara-los-cabos',
    CATEGORY_IDS.LOS_CABOS,
    'Conoce al artista internacional que por primera vez se presentará en Los Cabos.',
    '2025-01-15',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '74',
    'Los mejores eventos al aire libre en Puerto Vallarta',
    'mejores-eventos-aire-libre-puerto-vallarta',
    CATEGORY_IDS.PUERTO_VALLARTA,
    'Una selección de eventos al aire libre que aprovechan el clima perfecto de Puerto Vallarta.',
    '2025-01-20',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '75',
    'Tendencias en tecnología para eventos: realidad aumentada y más',
    'tendencias-tecnologia-eventos-realidad-aumentada',
    CATEGORY_IDS.GENERAL,
    'Cómo la tecnología está transformando la experiencia en los eventos nocturnos.',
    '2025-01-25',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '76',
    'Cómo combinar eventos y turismo en tu visita a Tulum',
    'combinar-eventos-turismo-visita-tulum',
    CATEGORY_IDS.TULUM,
    'Estrategias para disfrutar tanto de los eventos como de las atracciones turísticas de Tulum.',
    '2025-02-01',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '77',
    'Los mejores eventos temáticos de los 80s y 90s en Cancún',
    'mejores-eventos-tematicos-80s-90s-cancun',
    CATEGORY_IDS.CANCUN,
    'Eventos nostálgicos que reviven la música y el estilo de las décadas de los 80s y 90s.',
    '2025-02-05',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '78',
    'Guía de etiqueta para eventos VIP en Los Cabos',
    'guia-etiqueta-eventos-vip-los-cabos',
    CATEGORY_IDS.LOS_CABOS,
    'Consejos sobre cómo comportarse y qué esperar en eventos VIP exclusivos.',
    '2025-02-10',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '79',
    'Entrevista con el productor musical detrás de los eventos más exitosos',
    'entrevista-productor-musical-eventos-exitosos',
    CATEGORY_IDS.GENERAL,
    'Conoce al productor que ha creado algunos de los eventos más memorables de la Riviera Maya.',
    '2025-02-15',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '80',
    'Los mejores eventos para grupos grandes en Playa del Carmen',
    'mejores-eventos-grupos-grandes-playa-carmen',
    CATEGORY_IDS.PLAYA_DEL_CARMEN,
    'Eventos ideales para celebrar con grupos grandes de amigos o familiares.',
    '2025-02-20',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '81',
    'Cómo documentar tu experiencia en eventos: fotografía y video',
    'documentar-experiencia-eventos-fotografia-video',
    CATEGORY_IDS.GENERAL,
    'Tips profesionales para capturar los mejores momentos de los eventos.',
    '2025-02-25',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '82',
    'Tendencias en sostenibilidad en eventos nocturnos',
    'tendencias-sostenibilidad-eventos-nocturnos',
    CATEGORY_IDS.GENERAL,
    'Cómo la industria de eventos está adoptando prácticas más sostenibles y ecológicas.',
    '2025-03-01',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '83',
    'Los mejores eventos para celebrar San Valentín en Cancún',
    'mejores-eventos-san-valentin-cancun',
    CATEGORY_IDS.CANCUN,
    'Opciones románticas y especiales para celebrar el Día de San Valentín.',
    '2025-03-05',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '84',
    'Guía de seguridad personal para eventos nocturnos',
    'guia-seguridad-personal-eventos-nocturnos',
    CATEGORY_IDS.GENERAL,
    'Consejos importantes de seguridad para disfrutar de los eventos de forma responsable.',
    '2025-03-10',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '85',
    'Entrevista con el creador de contenido que documenta los eventos de MandalaTickets',
    'entrevista-creador-contenido-documenta-eventos-mandalatickets',
    CATEGORY_IDS.GENERAL,
    'Conoce al influencer que está compartiendo la experiencia de MandalaTickets con el mundo.',
    '2025-03-15',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '86',
    'Los mejores eventos de música house en Tulum',
    'mejores-eventos-musica-house-tulum',
    CATEGORY_IDS.TULUM,
    'Una selección de los mejores eventos de música house que encontrarás en Tulum.',
    '2025-03-20',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '87',
    'Cómo crear el playlist perfecto para prepararte para un evento',
    'crear-playlist-perfecto-prepararse-evento',
    CATEGORY_IDS.GENERAL,
    'Tips para crear una lista de reproducción que te ponga en el mood perfecto antes del evento.',
    '2025-03-25',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '88',
    'Los mejores eventos para celebrar el Día de la Independencia en México',
    'mejores-eventos-dia-independencia-mexico',
    CATEGORY_IDS.GENERAL,
    'Eventos especiales para celebrar las fiestas patrias en los destinos de MandalaTickets.',
    '2025-04-01',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '89',
    'Tendencias en experiencias inmersivas en eventos',
    'tendencias-experiencias-inmersivas-eventos',
    CATEGORY_IDS.GENERAL,
    'Cómo los eventos están creando experiencias más inmersivas y envolventes.',
    '2025-04-05',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '90',
    'Guía completa de Los Cabos: eventos, playas y aventuras',
    'guia-completa-los-cabos-eventos-playas-aventuras',
    CATEGORY_IDS.LOS_CABOS,
    'Todo sobre Los Cabos: desde eventos nocturnos hasta actividades de aventura durante el día.',
    '2025-04-10',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '91',
    'Cómo aprovechar los descuentos de último minuto en MandalaTickets',
    'aprovechar-descuentos-ultimo-minuto-mandalatickets',
    CATEGORY_IDS.GENERAL,
    'Estrategias para encontrar y aprovechar las mejores ofertas de último minuto.',
    '2025-04-15',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '92',
    'Los mejores eventos para amantes del reggaetón en Cancún',
    'mejores-eventos-reggaeton-cancun',
    CATEGORY_IDS.CANCUN,
    'Una selección de eventos dedicados al reggaetón y música urbana latina.',
    '2025-04-20',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '93',
    'Cómo mantenerte conectado durante los eventos: WiFi y carga de batería',
    'mantenerse-conectado-eventos-wifi-carga-bateria',
    CATEGORY_IDS.GENERAL,
    'Tips para mantener tu dispositivo cargado y conectado durante los eventos.',
    '2025-04-25',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '94',
    'Entrevista con el equipo de sonido de MandalaTickets',
    'entrevista-equipo-sonido-mandalatickets',
    CATEGORY_IDS.GENERAL,
    'Conoce cómo se crea la experiencia de audio perfecta en cada evento.',
    '2025-05-01',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '95',
    'Los mejores eventos para celebrar el Día de las Madres',
    'mejores-eventos-dia-madres',
    CATEGORY_IDS.GENERAL,
    'Eventos especiales para celebrar a las mamás en los destinos de MandalaTickets.',
    '2025-05-05',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '96',
    'Tendencias en eventos híbridos: presenciales y virtuales',
    'tendencias-eventos-hibridos-presenciales-virtuales',
    CATEGORY_IDS.GENERAL,
    'Cómo los eventos están combinando experiencias presenciales y virtuales.',
    '2025-05-10',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '97',
    'Guía completa de Playa del Carmen: eventos y atracciones',
    'guia-completa-playa-carmen-eventos-atracciones',
    CATEGORY_IDS.PLAYA_DEL_CARMEN,
    'Todo lo que necesitas saber sobre Playa del Carmen, desde eventos hasta atracciones turísticas.',
    '2025-05-15',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '98',
    'Cómo crear recuerdos duraderos de tus eventos favoritos',
    'crear-recuerdos-duraderos-eventos-favoritos',
    CATEGORY_IDS.GENERAL,
    'Ideas creativas para preservar y recordar tus mejores momentos en los eventos.',
    '2025-05-20',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '99',
    'Los mejores eventos para celebrar el Día del Padre',
    'mejores-eventos-dia-padre',
    CATEGORY_IDS.GENERAL,
    'Eventos especiales para celebrar a los papás en los destinos de MandalaTickets.',
    '2025-05-25',
    'Equipo MandalaTickets',
    false
  ),
  createBlogPost(
    '100',
    'El futuro de los eventos nocturnos: predicciones para 2026',
    'futuro-eventos-nocturnos-predicciones-2026',
    CATEGORY_IDS.GENERAL,
    'Una mirada hacia el futuro de la industria de eventos nocturnos y las tendencias que veremos.',
    '2025-06-01',
    'Equipo MandalaTickets',
    false
  )
];

