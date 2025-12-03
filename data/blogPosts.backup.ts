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

// Helper para obtener contenido según locale
export function getPostContent(post: BlogPost, locale: 'es' | 'en' | 'fr' | 'pt' = 'es'): BlogPostContent {
  return post.content[locale] || post.content.es;
}

// Helper para encontrar un post por slug en cualquier idioma
export function findPostBySlug(slug: string, locale?: 'es' | 'en' | 'fr' | 'pt'): BlogPost | undefined {
  return blogPosts.find(post => {
    if (locale) {
      return post.content[locale]?.slug === slug;
    }
    // Buscar en todos los idiomas
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

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Los 10 eventos imperdibles en Cancún este verano',
    slug: '10-eventos-imperdibles-cancun-verano',
    category: CATEGORY_IDS.CANCUN,
    excerpt: 'Descubre los eventos más emocionantes que Cancún tiene preparados para esta temporada de verano. Desde fiestas en la playa hasta festivales de música electrónica.',
    date: '2024-01-15',
    author: 'Equipo MandalaTickets',
    featured: true
  },
  {
    id: '2',
    title: 'Guía completa para disfrutar de Tulum: playas, fiestas y más',
    slug: 'guia-completa-disfrutar-tulum-playas-fiestas',
    category: CATEGORY_IDS.TULUM,
    excerpt: 'Todo lo que necesitas saber para aprovechar al máximo tu visita a Tulum. Incluye los mejores beach clubs, restaurantes y eventos nocturnos.',
    date: '2024-01-20',
    author: 'Equipo MandalaTickets',
    featured: true
  },
  {
    id: '3',
    title: 'Entrevista exclusiva con el DJ residente de Mandala Beach',
    slug: 'entrevista-dj-residente-mandala-beach',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Conoce la historia detrás de uno de los DJs más reconocidos de la Riviera Maya y sus planes para los próximos eventos.',
    date: '2024-01-25',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '4',
    title: 'Cómo aprovechar al máximo las promociones de MandalaTickets',
    slug: 'aprovechar-promociones-mandalatickets',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Tips y estrategias para obtener los mejores descuentos y ofertas especiales en tus compras de boletos.',
    date: '2024-02-01',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '5',
    title: 'Historia y evolución de la vida nocturna en Playa del Carmen',
    slug: 'historia-evolucion-vida-nocturna-playa-carmen',
    category: CATEGORY_IDS.PLAYA_DEL_CARMEN,
    excerpt: 'Un recorrido por la transformación de la escena nocturna en Playa del Carmen y cómo se ha convertido en uno de los destinos más vibrantes.',
    date: '2024-02-05',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '6',
    title: 'Consejos para organizar una despedida de soltero/a en Los Cabos',
    slug: 'consejos-organizar-despedida-soltero-los-cabos',
    category: CATEGORY_IDS.LOS_CABOS,
    excerpt: 'Guía completa para planificar la despedida de soltero perfecta en Los Cabos, incluyendo eventos y actividades recomendadas.',
    date: '2024-02-10',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '7',
    title: 'Los mejores beach clubs en Puerto Vallarta para este año',
    slug: 'mejores-beach-clubs-puerto-vallarta',
    category: CATEGORY_IDS.PUERTO_VALLARTA,
    excerpt: 'Una selección de los beach clubs más exclusivos y vibrantes de Puerto Vallarta donde podrás disfrutar de música, comida y ambiente único.',
    date: '2024-02-15',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '8',
    title: 'Tendencias en música electrónica para 2025',
    slug: 'tendencias-musica-electronica-2025',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Las tendencias musicales que marcarán el ritmo de los eventos en 2025 y los artistas que debes conocer.',
    date: '2024-02-20',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '9',
    title: 'Cómo planificar tu itinerario de fiestas en Cancún',
    slug: 'planificar-itinerario-fiestas-cancun',
    category: CATEGORY_IDS.CANCUN,
    excerpt: 'Estrategias para organizar tu agenda de eventos y aprovechar al máximo tu tiempo en Cancún.',
    date: '2024-02-25',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '10',
    title: 'Entrevista con el organizador del festival anual en Tulum',
    slug: 'entrevista-organizador-festival-anual-tulum',
    category: CATEGORY_IDS.TULUM,
    excerpt: 'Descubre los secretos detrás de la organización de uno de los festivales más esperados del año en Tulum.',
    date: '2024-03-01',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '11',
    title: 'Los secretos mejor guardados de la vida nocturna en Los Cabos',
    slug: 'secretos-vida-nocturna-los-cabos',
    category: CATEGORY_IDS.LOS_CABOS,
    excerpt: 'Lugares y eventos exclusivos que solo los locales conocen en Los Cabos.',
    date: '2024-03-05',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '12',
    title: 'Guía para principiantes: cómo comprar boletos en MandalaTickets',
    slug: 'guia-principiantes-comprar-boletos-mandalatickets',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Todo lo que necesitas saber para realizar tu primera compra de boletos de forma fácil y segura.',
    date: '2024-03-10',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '13',
    title: 'Los 5 eventos más exclusivos en Playa del Carmen este mes',
    slug: '5-eventos-exclusivos-playa-carmen',
    category: CATEGORY_IDS.PLAYA_DEL_CARMEN,
    excerpt: 'Una selección de los eventos VIP y más exclusivos que no te puedes perder este mes en Playa del Carmen.',
    date: '2024-03-15',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '14',
    title: 'Cómo vestirse para una noche de fiesta en Tulum',
    slug: 'vestirse-noche-fiesta-tulum',
    category: CATEGORY_IDS.TULUM,
    excerpt: 'Guía de estilo para lucir perfecto en los eventos de Tulum, desde looks casuales hasta outfits más formales.',
    date: '2024-03-20',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '15',
    title: 'Entrevista con el chef detrás de la gastronomía en Mandala Beach',
    slug: 'entrevista-chef-gastronomia-mandala-beach',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Conoce la visión culinaria y los platillos exclusivos que encontrarás en los eventos de Mandala Beach.',
    date: '2024-03-25',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '16',
    title: 'Los beneficios de reservar tus boletos con anticipación',
    slug: 'beneficios-reservar-boletos-anticipacion',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Por qué es mejor comprar tus boletos con tiempo y cómo puedes ahorrar dinero haciéndolo.',
    date: '2024-04-01',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '17',
    title: 'Historia de los clubes nocturnos más icónicos de Cancún',
    slug: 'historia-clubes-nocturnos-iconicos-cancun',
    category: CATEGORY_IDS.CANCUN,
    excerpt: 'Un recorrido histórico por los clubes que han marcado la escena nocturna de Cancún a lo largo de los años.',
    date: '2024-04-05',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '18',
    title: 'Cómo disfrutar de una fiesta segura y responsable en Los Cabos',
    slug: 'disfrutar-fiesta-segura-responsable-los-cabos',
    category: CATEGORY_IDS.LOS_CABOS,
    excerpt: 'Consejos importantes para mantenerte seguro mientras disfrutas de los eventos en Los Cabos.',
    date: '2024-04-10',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '19',
    title: 'Los mejores cócteles para probar en los eventos de MandalaTickets',
    slug: 'mejores-cocteles-eventos-mandalatickets',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Una selección de las bebidas más populares y deliciosas que encontrarás en nuestros eventos.',
    date: '2024-04-15',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '20',
    title: 'Guía de transporte: cómo moverse entre eventos en Playa del Carmen',
    slug: 'guia-transporte-moverse-eventos-playa-carmen',
    category: CATEGORY_IDS.PLAYA_DEL_CARMEN,
    excerpt: 'Opciones de transporte y tips para moverte eficientemente entre diferentes eventos en Playa del Carmen.',
    date: '2024-04-20',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '21',
    title: 'Entrevista con el diseñador de los escenarios en Tulum',
    slug: 'entrevista-disenador-escenarios-tulum',
    category: CATEGORY_IDS.TULUM,
    excerpt: 'Descubre el proceso creativo detrás de los impresionantes escenarios que hacen únicos los eventos en Tulum.',
    date: '2024-04-25',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '22',
    title: 'Los 10 artistas emergentes que debes conocer este año',
    slug: '10-artistas-emergentes-conocer-ano',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Una lista de los talentos nuevos que están revolucionando la escena musical y que verás en nuestros eventos.',
    date: '2024-05-01',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '23',
    title: 'Cómo organizar una fiesta privada en Mandala Beach',
    slug: 'organizar-fiesta-privada-mandala-beach',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Guía paso a paso para planificar y ejecutar una celebración privada inolvidable en Mandala Beach.',
    date: '2024-05-05',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '24',
    title: 'Los mejores lugares para ver el atardecer antes de una fiesta en Puerto Vallarta',
    slug: 'mejores-lugares-atardecer-fiesta-puerto-vallarta',
    category: CATEGORY_IDS.PUERTO_VALLARTA,
    excerpt: 'Spots perfectos para disfrutar de una puesta de sol espectacular antes de comenzar tu noche de fiesta.',
    date: '2024-05-10',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '25',
    title: 'Tendencias en moda para la vida nocturna en 2025',
    slug: 'tendencias-moda-vida-nocturna-2025',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Las tendencias de moda que dominarán las pistas de baile y eventos nocturnos este año.',
    date: '2024-05-15',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '26',
    title: 'Cómo evitar las filas y entrar rápido a los eventos',
    slug: 'evitar-filas-entrar-rapido-eventos',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Estrategias y tips para acceder rápidamente a los eventos sin perder tiempo en filas.',
    date: '2024-05-20',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '27',
    title: 'Entrevista con el fotógrafo oficial de MandalaTickets',
    slug: 'entrevista-fotografo-oficial-mandalatickets',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Conoce al artista detrás de las increíbles fotografías que capturan la esencia de nuestros eventos.',
    date: '2024-05-25',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '28',
    title: 'Los 5 festivales de música más esperados en México este año',
    slug: '5-festivales-musica-esperados-mexico',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Una guía completa de los festivales musicales más importantes que se realizarán en México durante este año.',
    date: '2024-06-01',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '29',
    title: 'Cómo mantenerte hidratado y energizado durante una noche de fiesta',
    slug: 'mantenerse-hidratado-energizado-noche-fiesta',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Consejos de salud para disfrutar toda la noche sin comprometer tu bienestar.',
    date: '2024-06-05',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '30',
    title: 'Los mejores souvenirs para llevar de tu experiencia en Tulum',
    slug: 'mejores-souvenirs-experiencia-tulum',
    category: CATEGORY_IDS.TULUM,
    excerpt: 'Ideas de recuerdos únicos que puedes llevar contigo para recordar tu increíble experiencia en Tulum.',
    date: '2024-06-10',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '31',
    title: 'Entrevista con el equipo de seguridad de MandalaTickets: cómo garantizan tu bienestar',
    slug: 'entrevista-equipo-seguridad-mandalatickets',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Conoce las medidas de seguridad implementadas para garantizar una experiencia segura en todos nuestros eventos.',
    date: '2024-06-15',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '32',
    title: 'Los 10 mejores DJs que han pasado por los eventos de MandalaTickets',
    slug: '10-mejores-djs-eventos-mandalatickets',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Un recuento de los artistas más destacados que han animado nuestros eventos a lo largo del tiempo.',
    date: '2024-06-20',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '33',
    title: 'Cómo celebrar tu cumpleaños en grande con MandalaTickets',
    slug: 'celebrar-cumpleanos-grande-mandalatickets',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Ideas y opciones para hacer de tu cumpleaños una celebración inolvidable en uno de nuestros eventos.',
    date: '2024-06-25',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '34',
    title: 'Los mejores lugares para cenar antes de una fiesta en Cancún',
    slug: 'mejores-lugares-cenar-fiesta-cancun',
    category: CATEGORY_IDS.CANCUN,
    excerpt: 'Restaurantes recomendados para disfrutar una cena deliciosa antes de comenzar tu noche de fiesta.',
    date: '2024-07-01',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '35',
    title: 'Tendencias en iluminación y efectos visuales para eventos en 2025',
    slug: 'tendencias-iluminacion-efectos-visuales-eventos-2025',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Las innovaciones tecnológicas que están transformando la experiencia visual en los eventos nocturnos.',
    date: '2024-07-05',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '36',
    title: 'Cómo aprovechar las redes sociales para compartir tu experiencia en los eventos',
    slug: 'aprovechar-redes-sociales-compartir-experiencia-eventos',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Tips para crear contenido atractivo y compartir tus mejores momentos de los eventos en redes sociales.',
    date: '2024-07-10',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '37',
    title: 'Entrevista con el bartender estrella de Mandala Beach',
    slug: 'entrevista-bartender-estrella-mandala-beach',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Conoce los secretos detrás de los cócteles más populares y la filosofía del mejor bartender de la Riviera Maya.',
    date: '2024-07-15',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '38',
    title: 'Los 5 eventos temáticos más divertidos en Playa del Carmen',
    slug: '5-eventos-tematicos-divertidos-playa-carmen',
    category: CATEGORY_IDS.PLAYA_DEL_CARMEN,
    excerpt: 'Una selección de los eventos con temáticas únicas que hacen de Playa del Carmen un destino especial.',
    date: '2024-07-20',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '39',
    title: 'Cómo prepararte para una fiesta en la playa: consejos y trucos',
    slug: 'prepararse-fiesta-playa-consejos-trucos',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Todo lo que necesitas saber para disfrutar al máximo de una fiesta en la playa sin contratiempos.',
    date: '2024-07-25',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '40',
    title: 'Los mejores after-parties en Tulum que no te puedes perder',
    slug: 'mejores-after-parties-tulum',
    category: CATEGORY_IDS.TULUM,
    excerpt: 'Guía de los after-parties más exclusivos y vibrantes que continúan la fiesta después del evento principal.',
    date: '2024-08-01',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '41',
    title: 'Entrevista con el equipo de producción detrás de los eventos de MandalaTickets',
    slug: 'entrevista-equipo-produccion-eventos-mandalatickets',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Descubre cómo se crea la magia detrás de escena en cada uno de nuestros eventos.',
    date: '2024-08-05',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '42',
    title: 'Los 10 momentos más memorables en la historia de MandalaTickets',
    slug: '10-momentos-memorables-historia-mandalatickets',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Un recorrido por los hitos más importantes que han marcado la trayectoria de MandalaTickets.',
    date: '2024-08-10',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '43',
    title: 'Cómo planificar una escapada de fin de semana llena de fiestas en Los Cabos',
    slug: 'planificar-escapada-fin-semana-fiestas-los-cabos',
    category: CATEGORY_IDS.LOS_CABOS,
    excerpt: 'Guía completa para organizar un fin de semana perfecto lleno de eventos y diversión en Los Cabos.',
    date: '2024-08-15',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '44',
    title: 'Los mejores lugares para tomar fotos durante los eventos en Puerto Vallarta',
    slug: 'mejores-lugares-fotos-eventos-puerto-vallarta',
    category: CATEGORY_IDS.PUERTO_VALLARTA,
    excerpt: 'Spots fotográficos perfectos para capturar los mejores momentos de tus eventos en Puerto Vallarta.',
    date: '2024-08-20',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '45',
    title: 'Tendencias en música latina para 2025',
    slug: 'tendencias-musica-latina-2025',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Los ritmos y géneros latinos que dominarán los eventos este año.',
    date: '2024-08-25',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '46',
    title: 'Cómo hacer networking y conocer gente nueva en los eventos',
    slug: 'hacer-networking-conocer-gente-eventos',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Estrategias para expandir tu red de contactos mientras disfrutas de los eventos.',
    date: '2024-09-01',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '47',
    title: 'Entrevista con el diseñador de los flyers y materiales promocionales de MandalaTickets',
    slug: 'entrevista-disenador-flyers-materiales-promocionales-mandalatickets',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Conoce el proceso creativo detrás del diseño visual que identifica a MandalaTickets.',
    date: '2024-09-05',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '48',
    title: 'Los 5 eventos más románticos para parejas en Cancún',
    slug: '5-eventos-romanticos-parejas-cancun',
    category: CATEGORY_IDS.CANCUN,
    excerpt: 'Eventos especiales diseñados para parejas que buscan una experiencia romántica y memorable.',
    date: '2024-09-10',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '49',
    title: 'Cómo cuidar tus pertenencias durante una noche de fiesta',
    slug: 'cuidar-pertenencias-noche-fiesta',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Consejos prácticos para mantener seguras tus cosas mientras disfrutas de los eventos.',
    date: '2024-09-15',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '50',
    title: 'Los mejores lugares para desayunar después de una noche de fiesta en Tulum',
    slug: 'mejores-lugares-desayunar-despues-fiesta-tulum',
    category: CATEGORY_IDS.TULUM,
    excerpt: 'Restaurantes perfectos para recuperarte con un delicioso desayuno después de una noche increíble.',
    date: '2024-09-20',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '51',
    title: 'Entrevista con el equipo de marketing de MandalaTickets: estrategias detrás del éxito',
    slug: 'entrevista-equipo-marketing-mandalatickets',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Descubre cómo MandalaTickets ha construido su marca y conectado con miles de asistentes.',
    date: '2024-09-25',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '52',
    title: 'Los 10 mejores momentos capturados en fotos en los eventos de MandalaTickets',
    slug: '10-mejores-momentos-fotos-eventos-mandalatickets',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Una galería de los momentos más especiales capturados en nuestros eventos a lo largo del tiempo.',
    date: '2024-10-01',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '53',
    title: 'Cómo organizar una propuesta de matrimonio inolvidable en un evento de MandalaTickets',
    slug: 'organizar-propuesta-matrimonio-evento-mandalatickets',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Ideas creativas para hacer tu propuesta de matrimonio en uno de nuestros eventos especiales.',
    date: '2024-10-05',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '54',
    title: 'Los mejores lugares para comprar outfits de fiesta en Playa del Carmen',
    slug: 'mejores-lugares-comprar-outfits-fiesta-playa-carmen',
    category: CATEGORY_IDS.PLAYA_DEL_CARMEN,
    excerpt: 'Tiendas y boutiques donde encontrarás el outfit perfecto para tus eventos en Playa del Carmen.',
    date: '2024-10-10',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '55',
    title: 'Tendencias en bebidas y mixología para eventos en 2025',
    slug: 'tendencias-bebidas-mixologia-eventos-2025',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Las innovaciones en cócteles y bebidas que verás en los eventos este año.',
    date: '2024-10-15',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '56',
    title: 'Cómo mantener la energía durante una noche de fiesta sin excederte',
    slug: 'mantener-energia-noche-fiesta-sin-excederte',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Consejos para disfrutar toda la noche manteniendo un equilibrio saludable.',
    date: '2024-10-20',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '57',
    title: 'Entrevista con el equipo de logística de MandalaTickets: cómo organizan eventos exitosos',
    slug: 'entrevista-equipo-logistica-mandalatickets',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Conoce el trabajo detrás de escena que hace posible cada evento perfecto.',
    date: '2024-10-25',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '58',
    title: 'Los 5 eventos más exclusivos para celebrar Año Nuevo en Los Cabos',
    slug: '5-eventos-exclusivos-ano-nuevo-los-cabos',
    category: CATEGORY_IDS.LOS_CABOS,
    excerpt: 'Opciones VIP para recibir el Año Nuevo de forma inolvidable en Los Cabos.',
    date: '2024-11-01',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '59',
    title: 'Cómo elegir el evento perfecto según tus gustos musicales',
    slug: 'elegir-evento-perfecto-gustos-musicales',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Guía para encontrar el evento que mejor se adapte a tu estilo musical preferido.',
    date: '2024-11-05',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '60',
    title: 'Los mejores lugares para relajarte después de una noche de fiesta en Puerto Vallarta',
    slug: 'mejores-lugares-relajarte-despues-fiesta-puerto-vallarta',
    category: CATEGORY_IDS.PUERTO_VALLARTA,
    excerpt: 'Spas, playas y lugares tranquilos para recuperarte después de una noche increíble.',
    date: '2024-11-10',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '61',
    title: 'Entrevista con el equipo de relaciones públicas de MandalaTickets: cómo construyen la comunidad',
    slug: 'entrevista-equipo-rrpp-mandalatickets',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Descubre cómo MandalaTickets ha creado una comunidad vibrante de amantes de la fiesta.',
    date: '2024-11-15',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '62',
    title: 'Los 10 mejores momentos en video de los eventos de MandalaTickets',
    slug: '10-mejores-momentos-video-eventos-mandalatickets',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Una compilación de los videos más emocionantes y memorables de nuestros eventos.',
    date: '2024-11-20',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '63',
    title: 'Cómo organizar una fiesta sorpresa en uno de los eventos de MandalaTickets',
    slug: 'organizar-fiesta-sorpresa-evento-mandalatickets',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Guía paso a paso para planificar una fiesta sorpresa exitosa en uno de nuestros eventos.',
    date: '2024-11-25',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '64',
    title: 'Los mejores lugares para comprar accesorios de fiesta en Cancún',
    slug: 'mejores-lugares-comprar-accesorios-fiesta-cancun',
    category: CATEGORY_IDS.CANCUN,
    excerpt: 'Tiendas donde encontrarás los accesorios perfectos para complementar tu look de fiesta.',
    date: '2024-12-01',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '65',
    title: 'Tendencias en decoración y ambientación para eventos en 2025',
    slug: 'tendencias-decoracion-ambientacion-eventos-2025',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Las tendencias de diseño que transformarán la experiencia visual de los eventos.',
    date: '2024-12-05',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '66',
    title: 'Cómo mantener una actitud positiva y disfrutar al máximo de los eventos',
    slug: 'mantener-actitud-positiva-disfrutar-maximo-eventos',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Consejos para tener la mejor actitud y aprovechar cada momento de los eventos.',
    date: '2024-12-10',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '67',
    title: 'Entrevista con el equipo de atención al cliente de MandalaTickets: cómo garantizan una experiencia excepcional',
    slug: 'entrevista-equipo-atencion-cliente-mandalatickets',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Conoce cómo el equipo de atención al cliente asegura que cada asistente tenga la mejor experiencia.',
    date: '2024-12-15',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '68',
    title: 'Los 5 eventos más esperados para la temporada de primavera en Tulum',
    slug: '5-eventos-esperados-temporada-primavera-tulum',
    category: CATEGORY_IDS.TULUM,
    excerpt: 'Una selección de los eventos más emocionantes que llegarán a Tulum esta primavera.',
    date: '2024-12-20',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '69',
    title: 'Guía completa de Cancún: playas, eventos y vida nocturna',
    slug: 'guia-completa-cancun-playas-eventos-vida-nocturna',
    category: CATEGORY_IDS.CANCUN,
    excerpt: 'Todo lo que necesitas saber sobre Cancún, desde sus playas hasta su vibrante escena nocturna.',
    date: '2024-12-25',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '70',
    title: 'Cómo aprovechar los paquetes especiales de MandalaTickets',
    slug: 'aprovechar-paquetes-especiales-mandalatickets',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Guía para elegir y aprovechar los mejores paquetes que incluyen eventos, hospedaje y más.',
    date: '2025-01-01',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '71',
    title: 'Los mejores eventos para solteros en Playa del Carmen',
    slug: 'mejores-eventos-solteros-playa-carmen',
    category: CATEGORY_IDS.PLAYA_DEL_CARMEN,
    excerpt: 'Eventos diseñados especialmente para personas solteras que buscan conocer gente nueva.',
    date: '2025-01-05',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '72',
    title: 'Cómo planificar tu primera visita a un evento de MandalaTickets',
    slug: 'planificar-primera-visita-evento-mandalatickets',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Todo lo que un principiante necesita saber antes de asistir a su primer evento.',
    date: '2025-01-10',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '73',
    title: 'Entrevista con el DJ internacional que debutará en Los Cabos',
    slug: 'entrevista-dj-internacional-debutara-los-cabos',
    category: CATEGORY_IDS.LOS_CABOS,
    excerpt: 'Conoce al artista internacional que por primera vez se presentará en Los Cabos.',
    date: '2025-01-15',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '74',
    title: 'Los mejores eventos al aire libre en Puerto Vallarta',
    slug: 'mejores-eventos-aire-libre-puerto-vallarta',
    category: CATEGORY_IDS.PUERTO_VALLARTA,
    excerpt: 'Una selección de eventos al aire libre que aprovechan el clima perfecto de Puerto Vallarta.',
    date: '2025-01-20',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '75',
    title: 'Tendencias en tecnología para eventos: realidad aumentada y más',
    slug: 'tendencias-tecnologia-eventos-realidad-aumentada',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Cómo la tecnología está transformando la experiencia en los eventos nocturnos.',
    date: '2025-01-25',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '76',
    title: 'Cómo combinar eventos y turismo en tu visita a Tulum',
    slug: 'combinar-eventos-turismo-visita-tulum',
    category: CATEGORY_IDS.TULUM,
    excerpt: 'Estrategias para disfrutar tanto de los eventos como de las atracciones turísticas de Tulum.',
    date: '2025-02-01',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '77',
    title: 'Los mejores eventos temáticos de los 80s y 90s en Cancún',
    slug: 'mejores-eventos-tematicos-80s-90s-cancun',
    category: CATEGORY_IDS.CANCUN,
    excerpt: 'Eventos nostálgicos que reviven la música y el estilo de las décadas de los 80s y 90s.',
    date: '2025-02-05',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '78',
    title: 'Guía de etiqueta para eventos VIP en Los Cabos',
    slug: 'guia-etiqueta-eventos-vip-los-cabos',
    category: CATEGORY_IDS.LOS_CABOS,
    excerpt: 'Consejos sobre cómo comportarse y qué esperar en eventos VIP exclusivos.',
    date: '2025-02-10',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '79',
    title: 'Entrevista con el productor musical detrás de los eventos más exitosos',
    slug: 'entrevista-productor-musical-eventos-exitosos',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Conoce al productor que ha creado algunos de los eventos más memorables de la Riviera Maya.',
    date: '2025-02-15',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '80',
    title: 'Los mejores eventos para grupos grandes en Playa del Carmen',
    slug: 'mejores-eventos-grupos-grandes-playa-carmen',
    category: CATEGORY_IDS.PLAYA_DEL_CARMEN,
    excerpt: 'Eventos ideales para celebrar con grupos grandes de amigos o familiares.',
    date: '2025-02-20',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '81',
    title: 'Cómo documentar tu experiencia en eventos: fotografía y video',
    slug: 'documentar-experiencia-eventos-fotografia-video',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Tips profesionales para capturar los mejores momentos de los eventos.',
    date: '2025-02-25',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '82',
    title: 'Tendencias en sostenibilidad en eventos nocturnos',
    slug: 'tendencias-sostenibilidad-eventos-nocturnos',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Cómo la industria de eventos está adoptando prácticas más sostenibles y ecológicas.',
    date: '2025-03-01',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '83',
    title: 'Los mejores eventos para celebrar San Valentín en Cancún',
    slug: 'mejores-eventos-san-valentin-cancun',
    category: CATEGORY_IDS.CANCUN,
    excerpt: 'Opciones románticas y especiales para celebrar el Día de San Valentín.',
    date: '2025-03-05',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '84',
    title: 'Guía de seguridad personal para eventos nocturnos',
    slug: 'guia-seguridad-personal-eventos-nocturnos',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Consejos importantes de seguridad para disfrutar de los eventos de forma responsable.',
    date: '2025-03-10',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '85',
    title: 'Entrevista con el creador de contenido que documenta los eventos de MandalaTickets',
    slug: 'entrevista-creador-contenido-documenta-eventos-mandalatickets',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Conoce al influencer que está compartiendo la experiencia de MandalaTickets con el mundo.',
    date: '2025-03-15',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '86',
    title: 'Los mejores eventos de música house en Tulum',
    slug: 'mejores-eventos-musica-house-tulum',
    category: CATEGORY_IDS.TULUM,
    excerpt: 'Una selección de los mejores eventos de música house que encontrarás en Tulum.',
    date: '2025-03-20',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '87',
    title: 'Cómo crear el playlist perfecto para prepararte para un evento',
    slug: 'crear-playlist-perfecto-prepararse-evento',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Tips para crear una lista de reproducción que te ponga en el mood perfecto antes del evento.',
    date: '2025-03-25',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '88',
    title: 'Los mejores eventos para celebrar el Día de la Independencia en México',
    slug: 'mejores-eventos-dia-independencia-mexico',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Eventos especiales para celebrar las fiestas patrias en los destinos de MandalaTickets.',
    date: '2025-04-01',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '89',
    title: 'Tendencias en experiencias inmersivas en eventos',
    slug: 'tendencias-experiencias-inmersivas-eventos',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Cómo los eventos están creando experiencias más inmersivas y envolventes.',
    date: '2025-04-05',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '90',
    title: 'Guía completa de Los Cabos: eventos, playas y aventuras',
    slug: 'guia-completa-los-cabos-eventos-playas-aventuras',
    category: CATEGORY_IDS.LOS_CABOS,
    excerpt: 'Todo sobre Los Cabos: desde eventos nocturnos hasta actividades de aventura durante el día.',
    date: '2025-04-10',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '91',
    title: 'Cómo aprovechar los descuentos de último minuto en MandalaTickets',
    slug: 'aprovechar-descuentos-ultimo-minuto-mandalatickets',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Estrategias para encontrar y aprovechar las mejores ofertas de último minuto.',
    date: '2025-04-15',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '92',
    title: 'Los mejores eventos para amantes del reggaetón en Cancún',
    slug: 'mejores-eventos-reggaeton-cancun',
    category: CATEGORY_IDS.CANCUN,
    excerpt: 'Una selección de eventos dedicados al reggaetón y música urbana latina.',
    date: '2025-04-20',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '93',
    title: 'Cómo mantenerte conectado durante los eventos: WiFi y carga de batería',
    slug: 'mantenerse-conectado-eventos-wifi-carga-bateria',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Tips para mantener tu dispositivo cargado y conectado durante los eventos.',
    date: '2025-04-25',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '94',
    title: 'Entrevista con el equipo de sonido de MandalaTickets',
    slug: 'entrevista-equipo-sonido-mandalatickets',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Conoce cómo se crea la experiencia de audio perfecta en cada evento.',
    date: '2025-05-01',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '95',
    title: 'Los mejores eventos para celebrar el Día de las Madres',
    slug: 'mejores-eventos-dia-madres',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Eventos especiales para celebrar a las mamás en los destinos de MandalaTickets.',
    date: '2025-05-05',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '96',
    title: 'Tendencias en eventos híbridos: presenciales y virtuales',
    slug: 'tendencias-eventos-hibridos-presenciales-virtuales',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Cómo los eventos están combinando experiencias presenciales y virtuales.',
    date: '2025-05-10',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '97',
    title: 'Guía completa de Playa del Carmen: eventos y atracciones',
    slug: 'guia-completa-playa-carmen-eventos-atracciones',
    category: CATEGORY_IDS.PLAYA_DEL_CARMEN,
    excerpt: 'Todo lo que necesitas saber sobre Playa del Carmen, desde eventos hasta atracciones turísticas.',
    date: '2025-05-15',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '98',
    title: 'Cómo crear recuerdos duraderos de tus eventos favoritos',
    slug: 'crear-recuerdos-duraderos-eventos-favoritos',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Ideas creativas para preservar y recordar tus mejores momentos en los eventos.',
    date: '2025-05-20',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '99',
    title: 'Los mejores eventos para celebrar el Día del Padre',
    slug: 'mejores-eventos-dia-padre',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Eventos especiales para celebrar a los papás en los destinos de MandalaTickets.',
    date: '2025-05-25',
    author: 'Equipo MandalaTickets',
    featured: false
  },
  {
    id: '100',
    title: 'El futuro de los eventos nocturnos: predicciones para 2026',
    slug: 'futuro-eventos-nocturnos-predicciones-2026',
    category: CATEGORY_IDS.GENERAL,
    excerpt: 'Una mirada hacia el futuro de la industria de eventos nocturnos y las tendencias que veremos.',
    date: '2025-06-01',
    author: 'Equipo MandalaTickets',
    featured: false
  }
];

