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
    category: CATEGORY_IDS.CANCUN,
    date: '2024-01-15',
    author: 'Equipo MandalaTickets',
    featured: true,
    content: {
      es: {
        title: 'Los 10 eventos imperdibles en Cancún este verano',
        excerpt: 'Descubre los eventos más emocionantes que Cancún tiene preparados para esta temporada de verano. Desde fiestas en la playa hasta festivales de música electrónica.',
        slug: '10-eventos-imperdibles-cancun-verano'
      },
      en: {
        title: 'The 10 Must-Attend Events in Cancun This Summer',
        excerpt: 'Discover the most exciting events that Cancun has prepared for this summer season. From beach parties to electronic music festivals, explore the best nightlife and entertainment in Cancun, Mexico.',
        slug: '10-must-attend-events-cancun-summer'
      },
      fr: {
        title: 'Les 10 événements incontournables à Cancún cet été',
        excerpt: 'Découvrez les événements les plus passionnants que Cancún a préparés pour cette saison estivale. Des fêtes sur la plage aux festivals de musique électronique, explorez la meilleure vie nocturne de Cancún, Mexique.',
        slug: '10-evenements-incontournables-cancun-ete'
      },
      pt: {
        title: 'Os 10 eventos imperdíveis em Cancún neste verão',
        excerpt: 'Descubra os eventos mais emocionantes que Cancún preparou para esta temporada de verão. De festas na praia a festivais de música eletrônica, explore a melhor vida noturna e entretenimento em Cancún, México.',
        slug: '10-eventos-imperdiveis-cancun-verao'
      }
    }
  },
  {
    id: '2',
    category: CATEGORY_IDS.TULUM,
    date: '2024-01-20',
    author: 'Equipo MandalaTickets',
    featured: true,
    content: {
      es: {
        title: 'Guía completa para disfrutar de Tulum: playas, fiestas y más',
        excerpt: 'Todo lo que necesitas saber para aprovechar al máximo tu visita a Tulum. Incluye los mejores beach clubs, restaurantes y eventos nocturnos.',
        slug: 'guia-completa-disfrutar-tulum-playas-fiestas'
      },
      en: {
        title: 'Complete Guide to Enjoying Tulum: Beaches, Parties and More',
        excerpt: 'Everything you need to know to make the most of your visit to Tulum, Mexico. Includes the best beach clubs, restaurants, and nightlife events in the Riviera Maya.',
        slug: 'complete-guide-enjoying-tulum-beaches-parties'
      },
      fr: {
        title: 'Guide complet pour profiter de Tulum : plages, fêtes et plus',
        excerpt: 'Tout ce que vous devez savoir pour tirer le meilleur parti de votre visite à Tulum, Mexique. Inclut les meilleurs beach clubs, restaurants et événements nocturnes de la Riviera Maya.',
        slug: 'guide-complet-profiter-tulum-plages-fetes'
      },
      pt: {
        title: 'Guia completo para aproveitar Tulum: praias, festas e mais',
        excerpt: 'Tudo o que você precisa saber para aproveitar ao máximo sua visita a Tulum, México. Inclui os melhores beach clubs, restaurantes e eventos noturnos da Riviera Maya.',
        slug: 'guia-completo-aproveitar-tulum-praias-festas'
      }
    }
  },
  {
    id: '3',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-01-25',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Entrevista exclusiva con el DJ residente de Mandala Beach',
        excerpt: 'Conoce la historia detrás de uno de los DJs más reconocidos de la Riviera Maya y sus planes para los próximos eventos.',
        slug: 'entrevista-dj-residente-mandala-beach'
      },
      en: {
        title: 'Exclusive Interview with Mandala Beach Resident DJ',
        excerpt: 'Discover the story behind one of the Riviera Maya\'s most recognized DJs and their plans for upcoming events in Cancun and Tulum, Mexico.',
        slug: 'exclusive-interview-mandala-beach-resident-dj'
      },
      fr: {
        title: 'Entretien exclusif avec le DJ résident de Mandala Beach',
        excerpt: 'Découvrez l\'histoire de l\'un des DJ les plus reconnus de la Riviera Maya et ses projets pour les prochains événements à Cancún et Tulum, Mexique.',
        slug: 'entretien-exclusif-dj-resident-mandala-beach'
      },
      pt: {
        title: 'Entrevista exclusiva com o DJ residente do Mandala Beach',
        excerpt: 'Conheça a história por trás de um dos DJs mais reconhecidos da Riviera Maya e seus planos para os próximos eventos em Cancún e Tulum, México.',
        slug: 'entrevista-exclusiva-dj-residente-mandala-beach'
      }
    }
  },
  {
    id: '4',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-02-01',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Cómo aprovechar al máximo las promociones de MandalaTickets',
        excerpt: 'Tips y estrategias para obtener los mejores descuentos y ofertas especiales en tus compras de boletos.',
        slug: 'aprovechar-promociones-mandalatickets'
      },
      en: {
        title: 'How to Maximize MandalaTickets Promotions and Special Offers',
        excerpt: 'Tips and strategies to get the best discounts and special offers on your ticket purchases for exclusive events in Mexico\'s top destinations.',
        slug: 'maximize-mandalatickets-promotions-special-offers'
      },
      fr: {
        title: 'Comment maximiser les promotions et offres spéciales MandalaTickets',
        excerpt: 'Conseils et stratégies pour obtenir les meilleurs rabais et offres spéciales sur vos achats de billets pour des événements exclusifs dans les meilleures destinations du Mexique.',
        slug: 'maximiser-promotions-offres-speciales-mandalatickets'
      },
      pt: {
        title: 'Como maximizar promoções e ofertas especiais da MandalaTickets',
        excerpt: 'Dicas e estratégias para obter os melhores descontos e ofertas especiais em suas compras de ingressos para eventos exclusivos nos principais destinos do México.',
        slug: 'maximizar-promocoes-ofertas-especiais-mandalatickets'
      }
    }
  },
  {
    id: '5',
    category: CATEGORY_IDS.PLAYA_DEL_CARMEN,
    date: '2024-02-05',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Historia y evolución de la vida nocturna en Playa del Carmen',
        excerpt: 'Un recorrido por la transformación de la escena nocturna en Playa del Carmen y cómo se ha convertido en uno de los destinos más vibrantes.',
        slug: 'historia-evolucion-vida-nocturna-playa-carmen'
      },
      en: {
        title: 'History and Evolution of Nightlife in Playa del Carmen',
        excerpt: 'A journey through the transformation of Playa del Carmen\'s nightlife scene and how it has become one of Mexico\'s most vibrant destinations in the Riviera Maya.',
        slug: 'history-evolution-nightlife-playa-del-carmen'
      },
      fr: {
        title: 'Histoire et évolution de la vie nocturne à Playa del Carmen',
        excerpt: 'Un parcours à travers la transformation de la scène nocturne de Playa del Carmen et comment elle est devenue l\'une des destinations les plus dynamiques du Mexique dans la Riviera Maya.',
        slug: 'histoire-evolution-vie-nocturne-playa-del-carmen'
      },
      pt: {
        title: 'História e evolução da vida noturna em Playa del Carmen',
        excerpt: 'Uma jornada pela transformação da cena noturna de Playa del Carmen e como ela se tornou um dos destinos mais vibrantes do México na Riviera Maya.',
        slug: 'historia-evolucao-vida-noturna-playa-del-carmen'
      }
    }
  },
  {
    id: '6',
    category: CATEGORY_IDS.LOS_CABOS,
    date: '2024-02-10',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Consejos para organizar una despedida de soltero/a en Los Cabos',
        excerpt: 'Guía completa para planificar la despedida de soltero perfecta en Los Cabos, incluyendo eventos y actividades recomendadas.',
        slug: 'consejos-organizar-despedida-soltero-los-cabos'
      },
      en: {
        title: 'Tips for Organizing a Bachelor or Bachelorette Party in Los Cabos',
        excerpt: 'Complete guide to planning the perfect bachelor or bachelorette party in Los Cabos, Mexico, including exclusive events and recommended activities in Cabo San Lucas.',
        slug: 'tips-organize-bachelor-party-los-cabos'
      },
      fr: {
        title: 'Conseils pour organiser un enterrement de vie de garçon/fille à Los Cabos',
        excerpt: 'Guide complet pour planifier l\'enterrement de vie de garçon ou de fille parfait à Los Cabos, Mexique, incluant des événements exclusifs et des activités recommandées à Cabo San Lucas.',
        slug: 'conseils-organiser-enterrement-vie-los-cabos'
      },
      pt: {
        title: 'Dicas para organizar despedida de solteiro/solteira em Los Cabos',
        excerpt: 'Guia completo para planejar a despedida de solteiro ou solteira perfeita em Los Cabos, México, incluindo eventos exclusivos e atividades recomendadas em Cabo San Lucas.',
        slug: 'dicas-organizar-despedida-solteiro-los-cabos'
      }
    }
  },
  {
    id: '7',
    category: CATEGORY_IDS.PUERTO_VALLARTA,
    date: '2024-02-15',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Los mejores beach clubs en Puerto Vallarta para este año',
        excerpt: 'Una selección de los beach clubs más exclusivos y vibrantes de Puerto Vallarta donde podrás disfrutar de música, comida y ambiente único.',
        slug: 'mejores-beach-clubs-puerto-vallarta'
      },
      en: {
        title: 'The Best Beach Clubs in Puerto Vallarta This Year',
        excerpt: 'A selection of the most exclusive and vibrant beach clubs in Puerto Vallarta, Mexico, where you can enjoy music, food, and unique atmosphere on the Pacific coast.',
        slug: 'best-beach-clubs-puerto-vallarta-this-year'
      },
      fr: {
        title: 'Les meilleurs beach clubs à Puerto Vallarta cette année',
        excerpt: 'Une sélection des beach clubs les plus exclusifs et vibrants de Puerto Vallarta, Mexique, où vous pourrez profiter de musique, de nourriture et d\'une atmosphère unique sur la côte Pacifique.',
        slug: 'meilleurs-beach-clubs-puerto-vallarta-cette-annee'
      },
      pt: {
        title: 'Os melhores beach clubs em Puerto Vallarta este ano',
        excerpt: 'Uma seleção dos beach clubs mais exclusivos e vibrantes de Puerto Vallarta, México, onde você pode desfrutar de música, comida e uma atmosfera única na costa do Pacífico.',
        slug: 'melhores-beach-clubs-puerto-vallarta-este-ano'
      }
    }
  },
  {
    id: '8',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-02-20',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Tendencias en música electrónica para 2025',
        excerpt: 'Las tendencias musicales que marcarán el ritmo de los eventos en 2025 y los artistas que debes conocer.',
        slug: 'tendencias-musica-electronica-2025'
      },
      en: {
        title: 'Electronic Music Trends for 2025',
        excerpt: 'The musical trends that will set the pace for events in 2025 and the artists you need to know. Discover the latest in electronic music for nightlife events in Mexico.',
        slug: 'electronic-music-trends-2025'
      },
      fr: {
        title: 'Tendances de la musique électronique pour 2025',
        excerpt: 'Les tendances musicales qui marqueront le rythme des événements en 2025 et les artistes à connaître. Découvrez les dernières nouveautés de la musique électronique pour les événements nocturnes au Mexique.',
        slug: 'tendances-musique-electronique-2025'
      },
      pt: {
        title: 'Tendências de música eletrônica para 2025',
        excerpt: 'As tendências musicais que definirão o ritmo dos eventos em 2025 e os artistas que você precisa conhecer. Descubra o que há de mais recente em música eletrônica para eventos noturnos no México.',
        slug: 'tendencias-musica-eletronica-2025'
      }
    }
  },
  {
    id: '9',
    category: CATEGORY_IDS.CANCUN,
    date: '2024-02-25',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Cómo planificar tu itinerario de fiestas en Cancún',
        excerpt: 'Estrategias para organizar tu agenda de eventos y aprovechar al máximo tu tiempo en Cancún.',
        slug: 'planificar-itinerario-fiestas-cancun'
      },
      en: {
        title: 'How to Plan Your Party Itinerary in Cancun',
        excerpt: 'Strategies to organize your event schedule and make the most of your time in Cancun, Mexico. Discover the best nightlife venues and exclusive parties.',
        slug: 'how-plan-party-itinerary-cancun'
      },
      fr: {
        title: 'Comment planifier votre itinéraire de fêtes à Cancún',
        excerpt: 'Stratégies pour organiser votre calendrier d\'événements et tirer le meilleur parti de votre temps à Cancún, Mexique. Découvrez les meilleurs lieux de vie nocturne et fêtes exclusives.',
        slug: 'comment-planifier-itineraire-fetes-cancun'
      },
      pt: {
        title: 'Como planejar seu itinerário de festas em Cancún',
        excerpt: 'Estratégias para organizar sua agenda de eventos e aproveitar ao máximo seu tempo em Cancún, México. Descubra os melhores locais de vida noturna e festas exclusivas.',
        slug: 'como-planejar-itinerario-festas-cancun'
      }
    }
  },
  {
    id: '10',
    category: CATEGORY_IDS.TULUM,
    date: '2024-03-01',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Entrevista con el organizador del festival anual en Tulum',
        excerpt: 'Descubre los secretos detrás de la organización de uno de los festivales más esperados del año en Tulum.',
        slug: 'entrevista-organizador-festival-anual-tulum'
      },
      en: {
        title: 'Interview with the Organizer of the Annual Festival in Tulum',
        excerpt: 'Discover the secrets behind the organization of one of the most anticipated festivals of the year in Tulum, Mexico. Learn about event planning and the Riviera Maya scene.',
        slug: 'interview-organizer-annual-festival-tulum'
      },
      fr: {
        title: 'Entretien avec l\'organisateur du festival annuel à Tulum',
        excerpt: 'Découvrez les secrets derrière l\'organisation de l\'un des festivals les plus attendus de l\'année à Tulum, Mexique. Apprenez-en plus sur la planification d\'événements et la scène de la Riviera Maya.',
        slug: 'entretien-organisateur-festival-annuel-tulum'
      },
      pt: {
        title: 'Entrevista com o organizador do festival anual em Tulum',
        excerpt: 'Descubra os segredos por trás da organização de um dos festivais mais esperados do ano em Tulum, México. Saiba mais sobre planejamento de eventos e a cena da Riviera Maya.',
        slug: 'entrevista-organizador-festival-anual-tulum'
      }
    }
  },
  {
    id: '11',
    category: CATEGORY_IDS.LOS_CABOS,
    date: '2024-03-05',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Los secretos mejor guardados de la vida nocturna en Los Cabos',
        excerpt: 'Lugares y eventos exclusivos que solo los locales conocen en Los Cabos.',
        slug: 'secretos-vida-nocturna-los-cabos'
      },
      en: {
        title: 'Los Cabos Nightlife Best Kept Secrets',
        excerpt: 'Exclusive places and events that only locals know in Los Cabos, Mexico. Discover hidden gems and VIP nightlife experiences in Cabo San Lucas.',
        slug: 'los-cabos-nightlife-best-kept-secrets'
      },
      fr: {
        title: 'Les secrets les mieux gardés de la vie nocturne à Los Cabos',
        excerpt: 'Lieux et événements exclusifs que seuls les habitants connaissent à Los Cabos, Mexique. Découvrez des joyaux cachés et des expériences de vie nocturne VIP à Cabo San Lucas.',
        slug: 'secrets-mieux-gardes-vie-nocturne-los-cabos'
      },
      pt: {
        title: 'Os segredos mais bem guardados da vida noturna em Los Cabos',
        excerpt: 'Lugares e eventos exclusivos que apenas os locais conhecem em Los Cabos, México. Descubra joias escondidas e experiências VIP de vida noturna em Cabo San Lucas.',
        slug: 'segredos-mais-bem-guardados-vida-noturna-los-cabos'
      }
    }
  },
  {
    id: '12',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-03-10',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Guía para principiantes: cómo comprar boletos en MandalaTickets',
        excerpt: 'Todo lo que necesitas saber para realizar tu primera compra de boletos de forma fácil y segura.',
        slug: 'guia-principiantes-comprar-boletos-mandalatickets'
      },
      en: {
        title: 'Beginner\'s Guide: How to Buy Tickets on MandalaTickets',
        excerpt: 'Everything you need to know to make your first ticket purchase easily and securely. Complete guide for buying tickets to exclusive events in Mexico.',
        slug: 'beginners-guide-buy-tickets-mandalatickets'
      },
      fr: {
        title: 'Guide pour débutants : comment acheter des billets sur MandalaTickets',
        excerpt: 'Tout ce que vous devez savoir pour effectuer votre premier achat de billets facilement et en toute sécurité. Guide complet pour acheter des billets pour des événements exclusifs au Mexique.',
        slug: 'guide-debutants-acheter-billets-mandalatickets'
      },
      pt: {
        title: 'Guia para iniciantes: como comprar ingressos na MandalaTickets',
        excerpt: 'Tudo o que você precisa saber para fazer sua primeira compra de ingressos de forma fácil e segura. Guia completo para comprar ingressos para eventos exclusivos no México.',
        slug: 'guia-iniciantes-comprar-ingressos-mandalatickets'
      }
    }
  },
  {
    id: '13',
    category: CATEGORY_IDS.PLAYA_DEL_CARMEN,
    date: '2024-03-15',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Los 5 eventos más exclusivos en Playa del Carmen este mes',
        excerpt: 'Una selección de los eventos VIP y más exclusivos que no te puedes perder este mes en Playa del Carmen.',
        slug: '5-eventos-exclusivos-playa-carmen'
      },
      en: {
        title: 'The 5 Most Exclusive Events in Playa del Carmen This Month',
        excerpt: 'A selection of the most exclusive VIP events you can\'t miss this month in Playa del Carmen, Mexico. Experience the best nightlife in the Riviera Maya.',
        slug: '5-most-exclusive-events-playa-del-carmen-month'
      },
      fr: {
        title: 'Les 5 événements les plus exclusifs à Playa del Carmen ce mois-ci',
        excerpt: 'Une sélection des événements VIP les plus exclusifs que vous ne pouvez pas manquer ce mois-ci à Playa del Carmen, Mexique. Vivez la meilleure vie nocturne de la Riviera Maya.',
        slug: '5-evenements-plus-exclusifs-playa-del-carmen-mois'
      },
      pt: {
        title: 'Os 5 eventos mais exclusivos em Playa del Carmen neste mês',
        excerpt: 'Uma seleção dos eventos VIP mais exclusivos que você não pode perder neste mês em Playa del Carmen, México. Experimente a melhor vida noturna da Riviera Maya.',
        slug: '5-eventos-mais-exclusivos-playa-del-carmen-mes'
      }
    }
  },
  {
    id: '14',
    category: CATEGORY_IDS.TULUM,
    date: '2024-03-20',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Cómo vestirse para una noche de fiesta en Tulum',
        excerpt: 'Guía de estilo para lucir perfecto en los eventos de Tulum, desde looks casuales hasta outfits más formales.',
        slug: 'vestirse-noche-fiesta-tulum'
      },
      en: {
        title: 'How to Dress for a Party Night in Tulum',
        excerpt: 'Style guide to look perfect at Tulum events, from casual looks to more formal outfits. Discover the best fashion tips for nightlife in the Riviera Maya, Mexico.',
        slug: 'how-dress-party-night-tulum'
      },
      fr: {
        title: 'Comment s\'habiller pour une soirée à Tulum',
        excerpt: 'Guide de style pour avoir l\'air parfait aux événements de Tulum, des looks décontractés aux tenues plus formelles. Découvrez les meilleurs conseils mode pour la vie nocturne de la Riviera Maya, Mexique.',
        slug: 'comment-habiller-soiree-tulum'
      },
      pt: {
        title: 'Como se vestir para uma noite de festa em Tulum',
        excerpt: 'Guia de estilo para ficar perfeito nos eventos de Tulum, de looks casuais a roupas mais formais. Descubra as melhores dicas de moda para vida noturna na Riviera Maya, México.',
        slug: 'como-se-vestir-noite-festa-tulum'
      }
    }
  },
  {
    id: '15',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-03-25',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Entrevista con el chef detrás de la gastronomía en Mandala Beach',
        excerpt: 'Conoce la visión culinaria y los platillos exclusivos que encontrarás en los eventos de Mandala Beach.',
        slug: 'entrevista-chef-gastronomia-mandala-beach'
      },
      en: {
        title: 'Interview with the Chef Behind Mandala Beach Culinary Experience',
        excerpt: 'Discover the culinary vision and exclusive dishes you\'ll find at Mandala Beach events. Learn about the gastronomy that makes events in the Riviera Maya, Mexico unforgettable.',
        slug: 'interview-chef-mandala-beach-culinary'
      },
      fr: {
        title: 'Entretien avec le chef derrière l\'expérience culinaire de Mandala Beach',
        excerpt: 'Découvrez la vision culinaire et les plats exclusifs que vous trouverez lors des événements de Mandala Beach. Apprenez-en plus sur la gastronomie qui rend les événements de la Riviera Maya, Mexique inoubliables.',
        slug: 'entretien-chef-experience-culinaire-mandala-beach'
      },
      pt: {
        title: 'Entrevista com o chef por trás da experiência culinária do Mandala Beach',
        excerpt: 'Descubra a visão culinária e os pratos exclusivos que você encontrará nos eventos do Mandala Beach. Conheça a gastronomia que torna os eventos da Riviera Maya, México inesquecíveis.',
        slug: 'entrevista-chef-experiencia-culinaria-mandala-beach'
      }
    }
  },
  {
    id: '16',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-04-01',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Los beneficios de reservar tus boletos con anticipación',
        excerpt: 'Por qué es mejor comprar tus boletos con tiempo y cómo puedes ahorrar dinero haciéndolo.',
        slug: 'beneficios-reservar-boletos-anticipacion'
      },
      en: {
        title: 'Benefits of Booking Your Tickets in Advance',
        excerpt: 'Why it\'s better to buy your tickets early and how you can save money by doing so. Discover exclusive early bird discounts for events in Mexico\'s top destinations.',
        slug: 'benefits-booking-tickets-advance'
      },
      fr: {
        title: 'Avantages de réserver vos billets à l\'avance',
        excerpt: 'Pourquoi il est préférable d\'acheter vos billets tôt et comment vous pouvez économiser de l\'argent en le faisant. Découvrez des réductions exclusives pour les réservations anticipées d\'événements dans les meilleures destinations du Mexique.',
        slug: 'avantages-reserver-billets-avance'
      },
      pt: {
        title: 'Benefícios de reservar seus ingressos com antecedência',
        excerpt: 'Por que é melhor comprar seus ingressos com antecedência e como você pode economizar dinheiro fazendo isso. Descubra descontos exclusivos para reservas antecipadas de eventos nos principais destinos do México.',
        slug: 'beneficios-reservar-ingressos-antecedencia'
      }
    }
  },
  {
    id: '17',
    category: CATEGORY_IDS.CANCUN,
    date: '2024-04-05',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Historia de los clubes nocturnos más icónicos de Cancún',
        excerpt: 'Un recorrido histórico por los clubes que han marcado la escena nocturna de Cancún a lo largo de los años.',
        slug: 'historia-clubes-nocturnos-iconicos-cancun'
      },
      en: {
        title: 'History of the Most Iconic Nightclubs in Cancun',
        excerpt: 'A historical journey through the nightclubs that have shaped Cancun\'s nightlife scene over the years. Discover the legendary venues that made Cancun, Mexico a world-class party destination.',
        slug: 'history-most-iconic-nightclubs-cancun'
      },
      fr: {
        title: 'Histoire des boîtes de nuit les plus emblématiques de Cancún',
        excerpt: 'Un voyage historique à travers les boîtes de nuit qui ont façonné la scène nocturne de Cancún au fil des ans. Découvrez les lieux légendaires qui ont fait de Cancún, Mexique une destination de fête de classe mondiale.',
        slug: 'histoire-boites-nuit-emblematiques-cancun'
      },
      pt: {
        title: 'História das boates mais icônicas de Cancún',
        excerpt: 'Uma jornada histórica pelas boates que moldaram a cena noturna de Cancún ao longo dos anos. Descubra os locais lendários que tornaram Cancún, México um destino de festa de classe mundial.',
        slug: 'historia-boates-mais-iconicas-cancun'
      }
    }
  },
  {
    id: '18',
    category: CATEGORY_IDS.LOS_CABOS,
    date: '2024-04-10',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Cómo disfrutar de una fiesta segura y responsable en Los Cabos',
        excerpt: 'Consejos importantes para mantenerte seguro mientras disfrutas de los eventos en Los Cabos.',
        slug: 'disfrutar-fiesta-segura-responsable-los-cabos'
      },
      en: {
        title: 'How to Enjoy a Safe and Responsible Party in Los Cabos',
        excerpt: 'Important tips to stay safe while enjoying events in Los Cabos, Mexico. Essential safety guidelines for nightlife experiences in Cabo San Lucas.',
        slug: 'safe-responsible-party-los-cabos'
      },
      fr: {
        title: 'Comment profiter d\'une fête sûre et responsable à Los Cabos',
        excerpt: 'Conseils importants pour rester en sécurité tout en profitant des événements à Los Cabos, Mexique. Lignes directrices essentielles pour les expériences de vie nocturne à Cabo San Lucas.',
        slug: 'fete-sure-responsable-los-cabos'
      },
      pt: {
        title: 'Como aproveitar uma festa segura e responsável em Los Cabos',
        excerpt: 'Dicas importantes para se manter seguro enquanto desfruta de eventos em Los Cabos, México. Diretrizes essenciais de segurança para experiências de vida noturna em Cabo San Lucas.',
        slug: 'festa-segura-responsavel-los-cabos'
      }
    }
  },
  {
    id: '19',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-04-15',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Los mejores cócteles para probar en los eventos de MandalaTickets',
        excerpt: 'Una selección de las bebidas más populares y deliciosas que encontrarás en nuestros eventos.',
        slug: 'mejores-cocteles-eventos-mandalatickets'
      },
      en: {
        title: 'Best Cocktails to Try at MandalaTickets Events',
        excerpt: 'A selection of the most popular and delicious drinks you\'ll find at our exclusive events in Mexico\'s top destinations. Discover signature cocktails and mixology.',
        slug: 'best-cocktails-try-mandalatickets-events'
      },
      fr: {
        title: 'Meilleurs cocktails à essayer aux événements MandalaTickets',
        excerpt: 'Une sélection des boissons les plus populaires et délicieuses que vous trouverez lors de nos événements exclusifs dans les meilleures destinations du Mexique. Découvrez les cocktails signature et la mixologie.',
        slug: 'meilleurs-cocktails-evenements-mandalatickets'
      },
      pt: {
        title: 'Melhores coquetéis para experimentar nos eventos MandalaTickets',
        excerpt: 'Uma seleção das bebidas mais populares e deliciosas que você encontrará em nossos eventos exclusivos nos principais destinos do México. Descubra coquetéis assinatura e mixologia.',
        slug: 'melhores-coqueteis-eventos-mandalatickets'
      }
    }
  },
  {
    id: '20',
    category: CATEGORY_IDS.PLAYA_DEL_CARMEN,
    date: '2024-04-20',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Guía de transporte: cómo moverse entre eventos en Playa del Carmen',
        excerpt: 'Opciones de transporte y tips para moverte eficientemente entre diferentes eventos en Playa del Carmen.',
        slug: 'guia-transporte-moverse-eventos-playa-carmen'
      },
      en: {
        title: 'Transportation Guide: How to Move Between Events in Playa del Carmen',
        excerpt: 'Transportation options and tips to move efficiently between different events in Playa del Carmen, Mexico. Navigate the Riviera Maya nightlife scene easily.',
        slug: 'transportation-guide-move-between-events-playa-del-carmen'
      },
      fr: {
        title: 'Guide de transport : comment se déplacer entre les événements à Playa del Carmen',
        excerpt: 'Options de transport et conseils pour se déplacer efficacement entre différents événements à Playa del Carmen, Mexique. Naviguez facilement dans la scène nocturne de la Riviera Maya.',
        slug: 'guide-transport-deplacer-evenements-playa-del-carmen'
      },
      pt: {
        title: 'Guia de transporte: como se mover entre eventos em Playa del Carmen',
        excerpt: 'Opções de transporte e dicas para se mover com eficiência entre diferentes eventos em Playa del Carmen, México. Navegue facilmente pela cena noturna da Riviera Maya.',
        slug: 'guia-transporte-mover-eventos-playa-del-carmen'
      }
    }
  },
  {
    id: '21',
    category: CATEGORY_IDS.TULUM,
    date: '2024-04-25',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Entrevista con el diseñador de los escenarios en Tulum',
        excerpt: 'Descubre el proceso creativo detrás de los impresionantes escenarios que hacen únicos los eventos en Tulum.',
        slug: 'entrevista-disenador-escenarios-tulum'
      },
      en: {
        title: 'Interview with the Stage Designer Behind Tulum Events',
        excerpt: 'Discover the creative process behind the impressive stages that make events in Tulum, Mexico unique. Learn about design and production in the Riviera Maya.',
        slug: 'interview-stage-designer-tulum-events'
      },
      fr: {
        title: 'Entretien avec le concepteur de scènes derrière les événements de Tulum',
        excerpt: 'Découvrez le processus créatif derrière les scènes impressionnantes qui rendent les événements de Tulum, Mexique uniques. Apprenez-en plus sur la conception et la production dans la Riviera Maya.',
        slug: 'entretien-concepteur-scenes-evenements-tulum'
      },
      pt: {
        title: 'Entrevista com o designer de palco por trás dos eventos de Tulum',
        excerpt: 'Descubra o processo criativo por trás dos palcos impressionantes que tornam os eventos de Tulum, México únicos. Saiba mais sobre design e produção na Riviera Maya.',
        slug: 'entrevista-designer-palco-eventos-tulum'
      }
    }
  },
  {
    id: '22',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-05-01',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Los 10 artistas emergentes que debes conocer este año',
        excerpt: 'Una lista de los talentos nuevos que están revolucionando la escena musical y que verás en nuestros eventos.',
        slug: '10-artistas-emergentes-conocer-ano'
      },
      en: {
        title: '10 Emerging Artists You Must Know This Year',
        excerpt: 'A list of new talents revolutionizing the music scene that you\'ll see at our exclusive events in Mexico. Discover the rising stars of electronic music and nightlife.',
        slug: '10-emerging-artists-must-know-year'
      },
      fr: {
        title: '10 artistes émergents que vous devez connaître cette année',
        excerpt: 'Une liste de nouveaux talents qui révolutionnent la scène musicale que vous verrez lors de nos événements exclusifs au Mexique. Découvrez les stars montantes de la musique électronique et de la vie nocturne.',
        slug: '10-artistes-emergents-connaitre-annee'
      },
      pt: {
        title: '10 artistas emergentes que você deve conhecer este ano',
        excerpt: 'Uma lista de novos talentos que estão revolucionando a cena musical que você verá em nossos eventos exclusivos no México. Descubra as estrelas em ascensão da música eletrônica e vida noturna.',
        slug: '10-artistas-emergentes-conhecer-ano'
      }
    }
  },
  {
    id: '23',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-05-05',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Cómo organizar una fiesta privada en Mandala Beach',
        excerpt: 'Guía paso a paso para planificar y ejecutar una celebración privada inolvidable en Mandala Beach.',
        slug: 'organizar-fiesta-privada-mandala-beach'
      },
      en: {
        title: 'How to Organize a Private Party at Mandala Beach',
        excerpt: 'Step-by-step guide to plan and execute an unforgettable private celebration at Mandala Beach. Create exclusive events in the Riviera Maya, Mexico.',
        slug: 'how-organize-private-party-mandala-beach'
      },
      fr: {
        title: 'Comment organiser une fête privée à Mandala Beach',
        excerpt: 'Guide étape par étape pour planifier et exécuter une célébration privée inoubliable à Mandala Beach. Créez des événements exclusifs dans la Riviera Maya, Mexique.',
        slug: 'comment-organiser-fete-privee-mandala-beach'
      },
      pt: {
        title: 'Como organizar uma festa privada no Mandala Beach',
        excerpt: 'Guia passo a passo para planejar e executar uma celebração privada inesquecível no Mandala Beach. Crie eventos exclusivos na Riviera Maya, México.',
        slug: 'como-organizar-festa-privada-mandala-beach'
      }
    }
  },
  {
    id: '24',
    category: CATEGORY_IDS.PUERTO_VALLARTA,
    date: '2024-05-10',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Los mejores lugares para ver el atardecer antes de una fiesta en Puerto Vallarta',
        excerpt: 'Spots perfectos para disfrutar de una puesta de sol espectacular antes de comenzar tu noche de fiesta.',
        slug: 'mejores-lugares-atardecer-fiesta-puerto-vallarta'
      },
      en: {
        title: 'Best Places to Watch the Sunset Before a Party in Puerto Vallarta',
        excerpt: 'Perfect spots to enjoy a spectacular sunset before starting your party night in Puerto Vallarta, Mexico. Discover the most romantic locations on the Pacific coast.',
        slug: 'best-places-watch-sunset-before-party-puerto-vallarta'
      },
      fr: {
        title: 'Meilleurs endroits pour regarder le coucher de soleil avant une fête à Puerto Vallarta',
        excerpt: 'Endroits parfaits pour profiter d\'un coucher de soleil spectaculaire avant de commencer votre soirée de fête à Puerto Vallarta, Mexique. Découvrez les endroits les plus romantiques sur la côte Pacifique.',
        slug: 'meilleurs-endroits-coucher-soleil-fete-puerto-vallarta'
      },
      pt: {
        title: 'Melhores lugares para ver o pôr do sol antes de uma festa em Puerto Vallarta',
        excerpt: 'Lugares perfeitos para desfrutar de um pôr do sol espetacular antes de começar sua noite de festa em Puerto Vallarta, México. Descubra os locais mais românticos na costa do Pacífico.',
        slug: 'melhores-lugares-por-sol-festa-puerto-vallarta'
      }
    }
  },
  {
    id: '25',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-05-15',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Tendencias en moda para la vida nocturna en 2025',
        excerpt: 'Las tendencias de moda que dominarán las pistas de baile y eventos nocturnos este año.',
        slug: 'tendencias-moda-vida-nocturna-2025'
      },
      en: {
        title: 'Fashion Trends for Nightlife in 2025',
        excerpt: 'The fashion trends that will dominate dance floors and nightlife events this year. Discover the latest styles for parties and exclusive events in Mexico.',
        slug: 'fashion-trends-nightlife-2025'
      },
      fr: {
        title: 'Tendances de la mode pour la vie nocturne en 2025',
        excerpt: 'Les tendances de la mode qui domineront les pistes de danse et les événements nocturnes cette année. Découvrez les derniers styles pour les fêtes et événements exclusifs au Mexique.',
        slug: 'tendances-mode-vie-nocturne-2025'
      },
      pt: {
        title: 'Tendências de moda para vida noturna em 2025',
        excerpt: 'As tendências de moda que dominarão as pistas de dança e eventos noturnos este ano. Descubra os estilos mais recentes para festas e eventos exclusivos no México.',
        slug: 'tendencias-moda-vida-noturna-2025'
      }
    }
  },
  {
    id: '26',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-05-20',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Cómo evitar las filas y entrar rápido a los eventos',
        excerpt: 'Estrategias y tips para acceder rápidamente a los eventos sin perder tiempo en filas.',
        slug: 'evitar-filas-entrar-rapido-eventos'
      },
      en: {
        title: 'How to Avoid Lines and Enter Events Quickly',
        excerpt: 'Strategies and tips to access events quickly without wasting time in lines. Learn about VIP access and skip-the-line options for exclusive events in Mexico.',
        slug: 'avoid-lines-enter-events-quickly'
      },
      fr: {
        title: 'Comment éviter les files d\'attente et entrer rapidement aux événements',
        excerpt: 'Stratégies et conseils pour accéder rapidement aux événements sans perdre de temps dans les files d\'attente. Découvrez l\'accès VIP et les options pour éviter les files pour les événements exclusifs au Mexique.',
        slug: 'eviter-files-entrer-rapidement-evenements'
      },
      pt: {
        title: 'Como evitar filas e entrar rapidamente nos eventos',
        excerpt: 'Estratégias e dicas para acessar eventos rapidamente sem perder tempo em filas. Saiba mais sobre acesso VIP e opções para pular filas em eventos exclusivos no México.',
        slug: 'evitar-filas-entrar-rapidamente-eventos'
      }
    }
  },
  {
    id: '27',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-05-25',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Entrevista con el fotógrafo oficial de MandalaTickets',
        excerpt: 'Conoce al artista detrás de las increíbles fotografías que capturan la esencia de nuestros eventos.',
        slug: 'entrevista-fotografo-oficial-mandalatickets'
      },
      en: {
        title: 'Interview with MandalaTickets Official Photographer',
        excerpt: 'Meet the artist behind the incredible photographs that capture the essence of our exclusive events. Learn about nightlife photography in Mexico\'s top destinations.',
        slug: 'interview-mandalatickets-official-photographer'
      },
      fr: {
        title: 'Entretien avec le photographe officiel de MandalaTickets',
        excerpt: 'Rencontrez l\'artiste derrière les photographies incroyables qui capturent l\'essence de nos événements exclusifs. Découvrez la photographie de vie nocturne dans les meilleures destinations du Mexique.',
        slug: 'entretien-photographe-officiel-mandalatickets'
      },
      pt: {
        title: 'Entrevista com o fotógrafo oficial da MandalaTickets',
        excerpt: 'Conheça o artista por trás das fotografias incríveis que capturam a essência de nossos eventos exclusivos. Saiba mais sobre fotografia de vida noturna nos principais destinos do México.',
        slug: 'entrevista-fotografo-oficial-mandalatickets'
      }
    }
  },
  {
    id: '28',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-06-01',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Los 5 festivales de música más esperados en México este año',
        excerpt: 'Una guía completa de los festivales musicales más importantes que se realizarán en México durante este año.',
        slug: '5-festivales-musica-esperados-mexico'
      },
      en: {
        title: '5 Most Anticipated Music Festivals in Mexico This Year',
        excerpt: 'A complete guide to the most important music festivals taking place in Mexico this year. Discover the best electronic and nightlife festivals in Cancun, Tulum, and more.',
        slug: '5-most-anticipated-music-festivals-mexico-year'
      },
      fr: {
        title: '5 festivals de musique les plus attendus au Mexique cette année',
        excerpt: 'Un guide complet des festivals de musique les plus importants qui auront lieu au Mexique cette année. Découvrez les meilleurs festivals de musique électronique et de vie nocturne à Cancún, Tulum et plus encore.',
        slug: '5-festivals-musique-plus-attendus-mexique-annee'
      },
      pt: {
        title: '5 festivais de música mais aguardados no México este ano',
        excerpt: 'Um guia completo dos festivais de música mais importantes que acontecerão no México este ano. Descubra os melhores festivais de música eletrônica e vida noturna em Cancún, Tulum e muito mais.',
        slug: '5-festivais-musica-mais-aguardados-mexico-ano'
      }
    }
  },
  {
    id: '29',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-06-05',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Cómo mantenerte hidratado y energizado durante una noche de fiesta',
        excerpt: 'Consejos de salud para disfrutar toda la noche sin comprometer tu bienestar.',
        slug: 'mantenerse-hidratado-energizado-noche-fiesta'
      },
      en: {
        title: 'How to Stay Hydrated and Energized During a Party Night',
        excerpt: 'Health tips to enjoy the entire night without compromising your wellbeing. Essential advice for safe and responsible partying at events in Mexico.',
        slug: 'stay-hydrated-energized-during-party-night'
      },
      fr: {
        title: 'Comment rester hydraté et énergisé pendant une soirée',
        excerpt: 'Conseils de santé pour profiter de toute la nuit sans compromettre votre bien-être. Conseils essentiels pour faire la fête de manière sûre et responsable lors d\'événements au Mexique.',
        slug: 'rester-hydrate-energise-pendant-soiree'
      },
      pt: {
        title: 'Como se manter hidratado e energizado durante uma noite de festa',
        excerpt: 'Dicas de saúde para aproveitar a noite toda sem comprometer seu bem-estar. Conselhos essenciais para festejar de forma segura e responsável em eventos no México.',
        slug: 'manter-hidratado-energizado-noite-festa'
      }
    }
  },
  {
    id: '30',
    category: CATEGORY_IDS.TULUM,
    date: '2024-06-10',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Los mejores souvenirs para llevar de tu experiencia en Tulum',
        excerpt: 'Ideas de recuerdos únicos que puedes llevar contigo para recordar tu increíble experiencia en Tulum.',
        slug: 'mejores-souvenirs-experiencia-tulum'
      },
      en: {
        title: 'Best Souvenirs to Take Home from Your Tulum Experience',
        excerpt: 'Unique souvenir ideas you can take with you to remember your incredible experience in Tulum, Mexico. Find the perfect mementos from the Riviera Maya.',
        slug: 'best-souvenirs-take-home-tulum-experience'
      },
      fr: {
        title: 'Meilleurs souvenirs à ramener de votre expérience à Tulum',
        excerpt: 'Idées de souvenirs uniques que vous pouvez emporter avec vous pour vous souvenir de votre incroyable expérience à Tulum, Mexique. Trouvez les souvenirs parfaits de la Riviera Maya.',
        slug: 'meilleurs-souvenirs-ramener-experience-tulum'
      },
      pt: {
        title: 'Melhores lembranças para levar da sua experiência em Tulum',
        excerpt: 'Ideias de lembranças únicas que você pode levar para lembrar sua experiência incrível em Tulum, México. Encontre as lembranças perfeitas da Riviera Maya.',
        slug: 'melhores-lembrancas-levar-experiencia-tulum'
      }
    }
  },
  {
    id: '31',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-06-15',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Entrevista con el equipo de seguridad de MandalaTickets: cómo garantizan tu bienestar',
        excerpt: 'Conoce las medidas de seguridad implementadas para garantizar una experiencia segura en todos nuestros eventos.',
        slug: 'entrevista-equipo-seguridad-mandalatickets'
      },
      en: {
        title: 'Interview with MandalaTickets Security Team: How They Ensure Your Safety',
        excerpt: 'Learn about the security measures implemented to ensure a safe experience at all our exclusive events in Mexico. Your safety is our priority.',
        slug: 'interview-mandalatickets-security-team-safety'
      },
      fr: {
        title: 'Entretien avec l\'équipe de sécurité de MandalaTickets : comment ils garantissent votre sécurité',
        excerpt: 'Découvrez les mesures de sécurité mises en place pour assurer une expérience sûre lors de tous nos événements exclusifs au Mexique. Votre sécurité est notre priorité.',
        slug: 'entretien-equipe-securite-mandalatickets-securite'
      },
      pt: {
        title: 'Entrevista com a equipe de segurança da MandalaTickets: como eles garantem sua segurança',
        excerpt: 'Saiba mais sobre as medidas de segurança implementadas para garantir uma experiência segura em todos os nossos eventos exclusivos no México. Sua segurança é nossa prioridade.',
        slug: 'entrevista-equipe-seguranca-mandalatickets-seguranca'
      }
    }
  },
  {
    id: '32',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-06-20',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Los 10 mejores DJs que han pasado por los eventos de MandalaTickets',
        excerpt: 'Un recuento de los artistas más destacados que han animado nuestros eventos a lo largo del tiempo.',
        slug: '10-mejores-djs-eventos-mandalatickets'
      },
      en: {
        title: 'Top 10 DJs Who Have Performed at MandalaTickets Events',
        excerpt: 'A recap of the most outstanding artists who have entertained at our exclusive events over time. Discover the legendary DJs of Mexico\'s nightlife scene.',
        slug: 'top-10-djs-performed-mandalatickets-events'
      },
      fr: {
        title: 'Top 10 DJs qui ont performé aux événements MandalaTickets',
        excerpt: 'Un récapitulatif des artistes les plus remarquables qui ont diverti lors de nos événements exclusifs au fil du temps. Découvrez les DJs légendaires de la scène nocturne du Mexique.',
        slug: 'top-10-djs-performe-evenements-mandalatickets'
      },
      pt: {
        title: 'Top 10 DJs que se apresentaram nos eventos MandalaTickets',
        excerpt: 'Um resumo dos artistas mais destacados que se apresentaram em nossos eventos exclusivos ao longo do tempo. Descubra os DJs lendários da cena noturna do México.',
        slug: 'top-10-djs-apresentaram-eventos-mandalatickets'
      }
    }
  },
  {
    id: '33',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-06-25',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Cómo celebrar tu cumpleaños en grande con MandalaTickets',
        excerpt: 'Ideas y opciones para hacer de tu cumpleaños una celebración inolvidable en uno de nuestros eventos.',
        slug: 'celebrar-cumpleanos-grande-mandalatickets'
      },
      en: {
        title: 'How to Celebrate Your Birthday in Style with MandalaTickets',
        excerpt: 'Ideas and options to make your birthday an unforgettable celebration at one of our exclusive events in Mexico\'s top destinations. Create memorable moments.',
        slug: 'celebrate-birthday-style-mandalatickets'
      },
      fr: {
        title: 'Comment célébrer votre anniversaire en grand avec MandalaTickets',
        excerpt: 'Idées et options pour faire de votre anniversaire une célébration inoubliable lors de l\'un de nos événements exclusifs dans les meilleures destinations du Mexique. Créez des moments mémorables.',
        slug: 'celebrer-anniversaire-grand-mandalatickets'
      },
      pt: {
        title: 'Como celebrar seu aniversário em grande estilo com MandalaTickets',
        excerpt: 'Ideias e opções para tornar seu aniversário uma celebração inesquecível em um de nossos eventos exclusivos nos principais destinos do México. Crie momentos memoráveis.',
        slug: 'celebrar-aniversario-grande-estilo-mandalatickets'
      }
    }
  },
  {
    id: '34',
    category: CATEGORY_IDS.CANCUN,
    date: '2024-07-01',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Los mejores lugares para cenar antes de una fiesta en Cancún',
        excerpt: 'Restaurantes recomendados para disfrutar una cena deliciosa antes de comenzar tu noche de fiesta.',
        slug: 'mejores-lugares-cenar-fiesta-cancun'
      },
      en: {
        title: 'Best Places to Dine Before a Party in Cancun',
        excerpt: 'Recommended restaurants to enjoy a delicious dinner before starting your party night in Cancun, Mexico. Discover the finest dining experiences before nightlife events.',
        slug: 'best-places-dine-before-party-cancun'
      },
      fr: {
        title: 'Meilleurs endroits pour dîner avant une fête à Cancún',
        excerpt: 'Restaurants recommandés pour profiter d\'un dîner délicieux avant de commencer votre soirée de fête à Cancún, Mexique. Découvrez les meilleures expériences gastronomiques avant les événements de vie nocturne.',
        slug: 'meilleurs-endroits-diner-fete-cancun'
      },
      pt: {
        title: 'Melhores lugares para jantar antes de uma festa em Cancún',
        excerpt: 'Restaurantes recomendados para desfrutar de um jantar delicioso antes de começar sua noite de festa em Cancún, México. Descubra as melhores experiências gastronômicas antes dos eventos noturnos.',
        slug: 'melhores-lugares-jantar-festa-cancun'
      }
    }
  },
  {
    id: '35',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-07-05',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Tendencias en iluminación y efectos visuales para eventos en 2025',
        excerpt: 'Las innovaciones tecnológicas que están transformando la experiencia visual en los eventos nocturnos.',
        slug: 'tendencias-iluminacion-efectos-visuales-eventos-2025'
      },
      en: {
        title: 'Lighting and Visual Effects Trends for Events in 2025',
        excerpt: 'Technological innovations transforming the visual experience at nightlife events. Discover cutting-edge lighting and visual effects in Mexico\'s top party destinations.',
        slug: 'lighting-visual-effects-trends-events-2025'
      },
      fr: {
        title: 'Tendances en éclairage et effets visuels pour événements en 2025',
        excerpt: 'Innovations technologiques qui transforment l\'expérience visuelle lors des événements nocturnes. Découvrez l\'éclairage de pointe et les effets visuels dans les meilleures destinations de fête du Mexique.',
        slug: 'tendances-eclairage-effets-visuels-evenements-2025'
      },
      pt: {
        title: 'Tendências de iluminação e efeitos visuais para eventos em 2025',
        excerpt: 'Inovações tecnológicas que estão transformando a experiência visual em eventos noturnos. Descubra iluminação e efeitos visuais de ponta nos principais destinos de festa do México.',
        slug: 'tendencias-iluminacao-efeitos-visuais-eventos-2025'
      }
    }
  },
  {
    id: '36',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-07-10',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Cómo aprovechar las redes sociales para compartir tu experiencia en los eventos',
        excerpt: 'Tips para crear contenido atractivo y compartir tus mejores momentos de los eventos en redes sociales.',
        slug: 'aprovechar-redes-sociales-compartir-experiencia-eventos'
      },
      en: {
        title: 'How to Leverage Social Media to Share Your Event Experience',
        excerpt: 'Tips to create engaging content and share your best moments from events on social media. Boost your social presence at exclusive events in Mexico.',
        slug: 'leverage-social-media-share-event-experience'
      },
      fr: {
        title: 'Comment tirer parti des réseaux sociaux pour partager votre expérience d\'événement',
        excerpt: 'Conseils pour créer du contenu attrayant et partager vos meilleurs moments d\'événements sur les réseaux sociaux. Renforcez votre présence sociale lors d\'événements exclusifs au Mexique.',
        slug: 'tirer-parti-reseaux-sociaux-partager-experience-evenement'
      },
      pt: {
        title: 'Como aproveitar as redes sociais para compartilhar sua experiência em eventos',
        excerpt: 'Dicas para criar conteúdo atraente e compartilhar seus melhores momentos de eventos nas redes sociais. Aumente sua presença social em eventos exclusivos no México.',
        slug: 'aproveitar-redes-sociais-compartilhar-experiencia-eventos'
      }
    }
  },
  {
    id: '37',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-07-15',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Entrevista con el bartender estrella de Mandala Beach',
        excerpt: 'Conoce los secretos detrás de los cócteles más populares y la filosofía del mejor bartender de la Riviera Maya.',
        slug: 'entrevista-bartender-estrella-mandala-beach'
      },
      en: {
        title: 'Interview with Mandala Beach Star Bartender',
        excerpt: 'Discover the secrets behind the most popular cocktails and the philosophy of the best bartender in the Riviera Maya, Mexico. Learn about mixology and signature drinks.',
        slug: 'interview-mandala-beach-star-bartender'
      },
      fr: {
        title: 'Entretien avec le barman vedette de Mandala Beach',
        excerpt: 'Découvrez les secrets derrière les cocktails les plus populaires et la philosophie du meilleur barman de la Riviera Maya, Mexique. Apprenez-en plus sur la mixologie et les boissons signature.',
        slug: 'entretien-barman-vedette-mandala-beach'
      },
      pt: {
        title: 'Entrevista com o bartender estrela do Mandala Beach',
        excerpt: 'Descubra os segredos por trás dos coquetéis mais populares e a filosofia do melhor bartender da Riviera Maya, México. Saiba mais sobre mixologia e bebidas assinatura.',
        slug: 'entrevista-bartender-estrela-mandala-beach'
      }
    }
  },
  {
    id: '38',
    category: CATEGORY_IDS.PLAYA_DEL_CARMEN,
    date: '2024-07-20',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Los 5 eventos temáticos más divertidos en Playa del Carmen',
        excerpt: 'Una selección de los eventos con temáticas únicas que hacen de Playa del Carmen un destino especial.',
        slug: '5-eventos-tematicos-divertidos-playa-carmen'
      },
      en: {
        title: '5 Most Fun Themed Events in Playa del Carmen',
        excerpt: 'A selection of events with unique themes that make Playa del Carmen, Mexico a special destination. Discover themed parties and exclusive experiences in the Riviera Maya.',
        slug: '5-most-fun-themed-events-playa-del-carmen'
      },
      fr: {
        title: '5 événements à thème les plus amusants à Playa del Carmen',
        excerpt: 'Une sélection d\'événements avec des thèmes uniques qui font de Playa del Carmen, Mexique une destination spéciale. Découvrez les fêtes à thème et expériences exclusives dans la Riviera Maya.',
        slug: '5-evenements-theme-plus-amusants-playa-del-carmen'
      },
      pt: {
        title: '5 eventos temáticos mais divertidos em Playa del Carmen',
        excerpt: 'Uma seleção de eventos com temas únicos que tornam Playa del Carmen, México um destino especial. Descubra festas temáticas e experiências exclusivas na Riviera Maya.',
        slug: '5-eventos-tematicos-mais-divertidos-playa-del-carmen'
      }
    }
  },
  {
    id: '39',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-07-25',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Cómo prepararte para una fiesta en la playa: consejos y trucos',
        excerpt: 'Todo lo que necesitas saber para disfrutar al máximo de una fiesta en la playa sin contratiempos.',
        slug: 'prepararse-fiesta-playa-consejos-trucos'
      },
      en: {
        title: 'How to Prepare for a Beach Party: Tips and Tricks',
        excerpt: 'Everything you need to know to fully enjoy a beach party without setbacks. Essential guide for beach parties in Mexico\'s coastal destinations.',
        slug: 'prepare-beach-party-tips-tricks'
      },
      fr: {
        title: 'Comment se préparer pour une fête sur la plage : conseils et astuces',
        excerpt: 'Tout ce que vous devez savoir pour profiter pleinement d\'une fête sur la plage sans revers. Guide essentiel pour les fêtes sur la plage dans les destinations côtières du Mexique.',
        slug: 'preparer-fete-plage-conseils-astuces'
      },
      pt: {
        title: 'Como se preparar para uma festa na praia: dicas e truques',
        excerpt: 'Tudo o que você precisa saber para aproveitar ao máximo uma festa na praia sem contratempos. Guia essencial para festas na praia nos destinos costeiros do México.',
        slug: 'preparar-festa-praia-dicas-truques'
      }
    }
  },
  {
    id: '40',
    category: CATEGORY_IDS.TULUM,
    date: '2024-08-01',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Los mejores after-parties en Tulum que no te puedes perder',
        excerpt: 'Guía de los after-parties más exclusivos y vibrantes que continúan la fiesta después del evento principal.',
        slug: 'mejores-after-parties-tulum'
      },
      en: {
        title: 'Best After-Parties in Tulum You Can\'t Miss',
        excerpt: 'Guide to the most exclusive and vibrant after-parties that continue the celebration after the main event. Discover the best nightlife in Tulum, Mexico.',
        slug: 'best-after-parties-tulum-cant-miss'
      },
      fr: {
        title: 'Meilleurs after-parties à Tulum que vous ne pouvez pas manquer',
        excerpt: 'Guide des after-parties les plus exclusifs et vibrants qui continuent la fête après l\'événement principal. Découvrez la meilleure vie nocturne à Tulum, Mexique.',
        slug: 'meilleurs-after-parties-tulum-ne-pouvez-pas-manquer'
      },
      pt: {
        title: 'Melhores after-parties em Tulum que você não pode perder',
        excerpt: 'Guia dos after-parties mais exclusivos e vibrantes que continuam a festa depois do evento principal. Descubra a melhor vida noturna em Tulum, México.',
        slug: 'melhores-after-parties-tulum-nao-pode-perder'
      }
    }
  },
  {
    id: '41',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-08-05',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Entrevista con el equipo de producción detrás de los eventos de MandalaTickets',
        excerpt: 'Descubre cómo se crea la magia detrás de escena en cada uno de nuestros eventos.',
        slug: 'entrevista-equipo-produccion-eventos-mandalatickets'
      },
      en: {
        title: 'Interview with the Production Team Behind MandalaTickets Events',
        excerpt: 'Discover how the magic is created behind the scenes at each of our exclusive events. Learn about event production and production design in Mexico.',
        slug: 'interview-production-team-mandalatickets-events'
      },
      fr: {
        title: 'Entretien avec l\'équipe de production derrière les événements MandalaTickets',
        excerpt: 'Découvrez comment la magie est créée dans les coulisses de chacun de nos événements exclusifs. Apprenez-en plus sur la production d\'événements et le design de production au Mexique.',
        slug: 'entretien-equipe-production-evenements-mandalatickets'
      },
      pt: {
        title: 'Entrevista com a equipe de produção por trás dos eventos MandalaTickets',
        excerpt: 'Descubra como a mágica é criada nos bastidores de cada um de nossos eventos exclusivos. Saiba mais sobre produção de eventos e design de produção no México.',
        slug: 'entrevista-equipe-producao-eventos-mandalatickets'
      }
    }
  },
  {
    id: '42',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-08-10',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Los 10 momentos más memorables en la historia de MandalaTickets',
        excerpt: 'Un recorrido por los hitos más importantes que han marcado la trayectoria de MandalaTickets.',
        slug: '10-momentos-memorables-historia-mandalatickets'
      },
      en: {
        title: '10 Most Memorable Moments in MandalaTickets History',
        excerpt: 'A journey through the most important milestones that have marked MandalaTickets\' trajectory in Mexico\'s nightlife and event industry.',
        slug: '10-most-memorable-moments-mandalatickets-history'
      },
      fr: {
        title: '10 moments les plus mémorables de l\'histoire de MandalaTickets',
        excerpt: 'Un voyage à travers les étapes les plus importantes qui ont marqué la trajectoire de MandalaTickets dans l\'industrie de la vie nocturne et des événements au Mexique.',
        slug: '10-moments-plus-memorables-histoire-mandalatickets'
      },
      pt: {
        title: '10 momentos mais memoráveis da história da MandalaTickets',
        excerpt: 'Uma jornada pelos marcos mais importantes que marcaram a trajetória da MandalaTickets na indústria de vida noturna e eventos do México.',
        slug: '10-momentos-mais-memoraveis-historia-mandalatickets'
      }
    }
  },
  {
    id: '43',
    category: CATEGORY_IDS.LOS_CABOS,
    date: '2024-08-15',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Cómo planificar una escapada de fin de semana llena de fiestas en Los Cabos',
        excerpt: 'Guía completa para organizar un fin de semana perfecto lleno de eventos y diversión en Los Cabos.',
        slug: 'planificar-escapada-fin-semana-fiestas-los-cabos'
      },
      en: {
        title: 'How to Plan a Weekend Getaway Full of Parties in Los Cabos',
        excerpt: 'Complete guide to organize a perfect weekend full of events and fun in Los Cabos, Mexico. Plan your ultimate party weekend in Cabo San Lucas.',
        slug: 'plan-weekend-getaway-full-parties-los-cabos'
      },
      fr: {
        title: 'Comment planifier une escapade de week-end pleine de fêtes à Los Cabos',
        excerpt: 'Guide complet pour organiser un week-end parfait rempli d\'événements et de plaisir à Los Cabos, Mexique. Planifiez votre week-end de fête ultime à Cabo San Lucas.',
        slug: 'planifier-escapade-week-end-fetes-los-cabos'
      },
      pt: {
        title: 'Como planejar uma escapada de fim de semana cheia de festas em Los Cabos',
        excerpt: 'Guia completo para organizar um fim de semana perfeito cheio de eventos e diversão em Los Cabos, México. Planeje seu fim de semana de festa definitivo em Cabo San Lucas.',
        slug: 'planejar-escapada-fim-semana-festas-los-cabos'
      }
    }
  },
  {
    id: '44',
    category: CATEGORY_IDS.PUERTO_VALLARTA,
    date: '2024-08-20',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Los mejores lugares para tomar fotos durante los eventos en Puerto Vallarta',
        excerpt: 'Spots fotográficos perfectos para capturar los mejores momentos de tus eventos en Puerto Vallarta.',
        slug: 'mejores-lugares-fotos-eventos-puerto-vallarta'
      },
      en: {
        title: 'Best Places to Take Photos During Events in Puerto Vallarta',
        excerpt: 'Perfect photography spots to capture the best moments of your events in Puerto Vallarta, Mexico. Discover Instagram-worthy locations on the Pacific coast.',
        slug: 'best-places-take-photos-events-puerto-vallarta'
      },
      fr: {
        title: 'Meilleurs endroits pour prendre des photos lors d\'événements à Puerto Vallarta',
        excerpt: 'Endroits de photographie parfaits pour capturer les meilleurs moments de vos événements à Puerto Vallarta, Mexique. Découvrez des emplacements dignes d\'Instagram sur la côte Pacifique.',
        slug: 'meilleurs-endroits-prendre-photos-evenements-puerto-vallarta'
      },
      pt: {
        title: 'Melhores lugares para tirar fotos durante eventos em Puerto Vallarta',
        excerpt: 'Locais perfeitos de fotografia para capturar os melhores momentos de seus eventos em Puerto Vallarta, México. Descubra locais dignos do Instagram na costa do Pacífico.',
        slug: 'melhores-lugares-tirar-fotos-eventos-puerto-vallarta'
      }
    }
  },
  {
    id: '45',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-08-25',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Tendencias en música latina para 2025',
        excerpt: 'Los ritmos y géneros latinos que dominarán los eventos este año.',
        slug: 'tendencias-musica-latina-2025'
      },
      en: {
        title: 'Latin Music Trends for 2025',
        excerpt: 'The Latin rhythms and genres that will dominate events this year. Discover the hottest Latin music trends at nightlife events in Mexico.',
        slug: 'latin-music-trends-2025'
      },
      fr: {
        title: 'Tendances de la musique latine pour 2025',
        excerpt: 'Les rythmes et genres latins qui domineront les événements cette année. Découvrez les tendances musicales latines les plus chaudes lors d\'événements nocturnes au Mexique.',
        slug: 'tendances-musique-latine-2025'
      },
      pt: {
        title: 'Tendências de música latina para 2025',
        excerpt: 'Os ritmos e gêneros latinos que dominarão os eventos este ano. Descubra as tendências de música latina mais quentes em eventos noturnos no México.',
        slug: 'tendencias-musica-latina-2025'
      }
    }
  },
  {
    id: '46',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-09-01',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Cómo hacer networking y conocer gente nueva en los eventos',
        excerpt: 'Estrategias para expandir tu red de contactos mientras disfrutas de los eventos.',
        slug: 'hacer-networking-conocer-gente-eventos'
      },
      en: {
        title: 'How to Network and Meet New People at Events',
        excerpt: 'Strategies to expand your contact network while enjoying exclusive events. Build meaningful connections at nightlife events in Mexico\'s top destinations.',
        slug: 'network-meet-new-people-events'
      },
      fr: {
        title: 'Comment réseauter et rencontrer de nouvelles personnes lors d\'événements',
        excerpt: 'Stratégies pour élargir votre réseau de contacts tout en profitant d\'événements exclusifs. Créez des connexions significatives lors d\'événements nocturnes dans les meilleures destinations du Mexique.',
        slug: 'reseauter-rencontrer-nouvelles-personnes-evenements'
      },
      pt: {
        title: 'Como fazer networking e conhecer pessoas novas em eventos',
        excerpt: 'Estratégias para expandir sua rede de contatos enquanto desfruta de eventos exclusivos. Construa conexões significativas em eventos noturnos nos principais destinos do México.',
        slug: 'fazer-networking-conhecer-pessoas-eventos'
      }
    }
  },
  {
    id: '47',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-09-05',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Entrevista con el diseñador de los flyers y materiales promocionales de MandalaTickets',
        excerpt: 'Conoce el proceso creativo detrás del diseño visual que identifica a MandalaTickets.',
        slug: 'entrevista-disenador-flyers-materiales-promocionales-mandalatickets'
      },
      en: {
        title: 'Interview with MandalaTickets Flyer and Promotional Materials Designer',
        excerpt: 'Learn about the creative process behind the visual design that identifies MandalaTickets. Discover brand identity and graphic design in event marketing.',
        slug: 'interview-mandalatickets-flyer-promotional-materials-designer'
      },
      fr: {
        title: 'Entretien avec le concepteur de flyers et matériaux promotionnels de MandalaTickets',
        excerpt: 'Découvrez le processus créatif derrière la conception visuelle qui identifie MandalaTickets. Découvrez l\'identité de marque et le design graphique dans le marketing d\'événements.',
        slug: 'entretien-concepteur-flyers-materiaux-promotionnels-mandalatickets'
      },
      pt: {
        title: 'Entrevista com o designer de flyers e materiais promocionais da MandalaTickets',
        excerpt: 'Saiba mais sobre o processo criativo por trás do design visual que identifica a MandalaTickets. Descubra identidade de marca e design gráfico no marketing de eventos.',
        slug: 'entrevista-designer-flyers-materiais-promocionais-mandalatickets'
      }
    }
  },
  {
    id: '48',
    category: CATEGORY_IDS.CANCUN,
    date: '2024-09-10',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Los 5 eventos más románticos para parejas en Cancún',
        excerpt: 'Eventos especiales diseñados para parejas que buscan una experiencia romántica y memorable.',
        slug: '5-eventos-romanticos-parejas-cancun'
      },
      en: {
        title: '5 Most Romantic Events for Couples in Cancun',
        excerpt: 'Special events designed for couples seeking a romantic and memorable experience in Cancun, Mexico. Discover intimate venues and romantic nightlife experiences.',
        slug: '5-most-romantic-events-couples-cancun'
      },
      fr: {
        title: '5 événements les plus romantiques pour les couples à Cancún',
        excerpt: 'Événements spéciaux conçus pour les couples recherchant une expérience romantique et mémorable à Cancún, Mexique. Découvrez des lieux intimes et des expériences de vie nocturne romantiques.',
        slug: '5-evenements-plus-romantiques-couples-cancun'
      },
      pt: {
        title: '5 eventos mais românticos para casais em Cancún',
        excerpt: 'Eventos especiais projetados para casais que buscam uma experiência romântica e memorável em Cancún, México. Descubra locais íntimos e experiências românticas de vida noturna.',
        slug: '5-eventos-mais-romanticos-casais-cancun'
      }
    }
  },
  {
    id: '49',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-09-15',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Cómo cuidar tus pertenencias durante una noche de fiesta',
        excerpt: 'Consejos prácticos para mantener seguras tus cosas mientras disfrutas de los eventos.',
        slug: 'cuidar-pertenencias-noche-fiesta'
      },
      en: {
        title: 'How to Protect Your Belongings During a Party Night',
        excerpt: 'Practical tips to keep your belongings safe while enjoying events. Essential safety advice for nightlife experiences in Mexico\'s party destinations.',
        slug: 'protect-belongings-during-party-night'
      },
      fr: {
        title: 'Comment protéger vos biens pendant une soirée',
        excerpt: 'Conseils pratiques pour garder vos biens en sécurité tout en profitant des événements. Conseils de sécurité essentiels pour les expériences de vie nocturne dans les destinations de fête du Mexique.',
        slug: 'proteger-biens-pendant-soiree'
      },
      pt: {
        title: 'Como proteger seus pertences durante uma noite de festa',
        excerpt: 'Dicas práticas para manter seus pertences seguros enquanto desfruta de eventos. Conselhos essenciais de segurança para experiências de vida noturna nos destinos de festa do México.',
        slug: 'proteger-pertences-noite-festa'
      }
    }
  },
  {
    id: '50',
    category: CATEGORY_IDS.TULUM,
    date: '2024-09-20',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Los mejores lugares para desayunar después de una noche de fiesta en Tulum',
        excerpt: 'Restaurantes perfectos para recuperarte con un delicioso desayuno después de una noche increíble.',
        slug: 'mejores-lugares-desayunar-despues-fiesta-tulum'
      },
      en: {
        title: 'Best Places to Have Breakfast After a Party Night in Tulum',
        excerpt: 'Perfect restaurants to recover with a delicious breakfast after an incredible night in Tulum, Mexico. Discover the best morning dining spots in the Riviera Maya.',
        slug: 'best-places-breakfast-after-party-night-tulum'
      },
      fr: {
        title: 'Meilleurs endroits pour prendre le petit-déjeuner après une soirée à Tulum',
        excerpt: 'Restaurants parfaits pour récupérer avec un délicieux petit-déjeuner après une nuit incroyable à Tulum, Mexique. Découvrez les meilleurs endroits pour déjeuner le matin dans la Riviera Maya.',
        slug: 'meilleurs-endroits-petit-dejeuner-apres-soiree-tulum'
      },
      pt: {
        title: 'Melhores lugares para tomar café da manhã depois de uma noite de festa em Tulum',
        excerpt: 'Restaurantes perfeitos para se recuperar com um delicioso café da manhã depois de uma noite incrível em Tulum, México. Descubra os melhores locais para comer de manhã na Riviera Maya.',
        slug: 'melhores-lugares-cafe-manha-depois-noite-festa-tulum'
      }
    }
  },
  {
    id: '51',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-09-25',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Entrevista con el equipo de marketing de MandalaTickets: estrategias detrás del éxito',
        excerpt: 'Descubre cómo MandalaTickets ha construido su marca y conectado con miles de asistentes.',
        slug: 'entrevista-equipo-marketing-mandalatickets'
      },
      en: {
        title: 'Interview with MandalaTickets Marketing Team: Strategies Behind Success',
        excerpt: 'Discover how MandalaTickets has built its brand and connected with thousands of attendees. Learn about marketing strategies and brand building in the event industry.',
        slug: 'interview-mandalatickets-marketing-team-strategies-success'
      },
      fr: {
        title: 'Entretien avec l\'équipe marketing de MandalaTickets : stratégies derrière le succès',
        excerpt: 'Découvrez comment MandalaTickets a construit sa marque et s\'est connecté avec des milliers de participants. Apprenez-en plus sur les stratégies marketing et la construction de marque dans l\'industrie des événements.',
        slug: 'entretien-equipe-marketing-mandalatickets-strategies-succes'
      },
      pt: {
        title: 'Entrevista com a equipe de marketing da MandalaTickets: estratégias por trás do sucesso',
        excerpt: 'Descubra como a MandalaTickets construiu sua marca e se conectou com milhares de participantes. Saiba mais sobre estratégias de marketing e construção de marca na indústria de eventos.',
        slug: 'entrevista-equipe-marketing-mandalatickets-estrategias-sucesso'
      }
    }
  },
  {
    id: '52',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-10-01',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Los 10 mejores momentos capturados en fotos en los eventos de MandalaTickets',
        excerpt: 'Una galería de los momentos más especiales capturados en nuestros eventos a lo largo del tiempo.',
        slug: '10-mejores-momentos-fotos-eventos-mandalatickets'
      },
      en: {
        title: '10 Best Moments Captured in Photos at MandalaTickets Events',
        excerpt: 'A gallery of the most special moments captured at our exclusive events over time. Relive the best memories from nightlife events across Mexico\'s top destinations.',
        slug: '10-best-moments-captured-photos-mandalatickets-events'
      },
      fr: {
        title: '10 meilleurs moments capturés en photos lors d\'événements MandalaTickets',
        excerpt: 'Une galerie des moments les plus spéciaux capturés lors de nos événements exclusifs au fil du temps. Revivez les meilleurs souvenirs d\'événements nocturnes dans les meilleures destinations du Mexique.',
        slug: '10-meilleurs-moments-captures-photos-evenements-mandalatickets'
      },
      pt: {
        title: '10 melhores momentos capturados em fotos nos eventos MandalaTickets',
        excerpt: 'Uma galeria dos momentos mais especiais capturados em nossos eventos exclusivos ao longo do tempo. Reviva as melhores lembranças de eventos noturnos nos principais destinos do México.',
        slug: '10-melhores-momentos-capturados-fotos-eventos-mandalatickets'
      }
    }
  },
  {
    id: '53',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-10-05',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Cómo organizar una propuesta de matrimonio inolvidable en un evento de MandalaTickets',
        excerpt: 'Ideas creativas para hacer tu propuesta de matrimonio en uno de nuestros eventos especiales.',
        slug: 'organizar-propuesta-matrimonio-evento-mandalatickets'
      },
      en: {
        title: 'How to Organize an Unforgettable Marriage Proposal at a MandalaTickets Event',
        excerpt: 'Creative ideas to make your marriage proposal at one of our special events. Create unforgettable romantic moments at exclusive events in Mexico.',
        slug: 'organize-unforgettable-marriage-proposal-mandalatickets-event'
      },
      fr: {
        title: 'Comment organiser une demande en mariage inoubliable lors d\'un événement MandalaTickets',
        excerpt: 'Idées créatives pour faire votre demande en mariage lors de l\'un de nos événements spéciaux. Créez des moments romantiques inoubliables lors d\'événements exclusifs au Mexique.',
        slug: 'organiser-demande-mariage-inoubliable-evenement-mandalatickets'
      },
      pt: {
        title: 'Como organizar um pedido de casamento inesquecível em um evento MandalaTickets',
        excerpt: 'Ideias criativas para fazer seu pedido de casamento em um de nossos eventos especiais. Crie momentos românticos inesquecíveis em eventos exclusivos no México.',
        slug: 'organizar-pedido-casamento-inesquecivel-evento-mandalatickets'
      }
    }
  },
  {
    id: '54',
    category: CATEGORY_IDS.PLAYA_DEL_CARMEN,
    date: '2024-10-10',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Los mejores lugares para comprar outfits de fiesta en Playa del Carmen',
        excerpt: 'Tiendas y boutiques donde encontrarás el outfit perfecto para tus eventos en Playa del Carmen.',
        slug: 'mejores-lugares-comprar-outfits-fiesta-playa-carmen'
      },
      en: {
        title: 'Best Places to Buy Party Outfits in Playa del Carmen',
        excerpt: 'Stores and boutiques where you\'ll find the perfect outfit for your events in Playa del Carmen, Mexico. Discover the best fashion shopping in the Riviera Maya.',
        slug: 'best-places-buy-party-outfits-playa-del-carmen'
      },
      fr: {
        title: 'Meilleurs endroits pour acheter des tenues de fête à Playa del Carmen',
        excerpt: 'Magasins et boutiques où vous trouverez la tenue parfaite pour vos événements à Playa del Carmen, Mexique. Découvrez les meilleurs magasins de mode de la Riviera Maya.',
        slug: 'meilleurs-endroits-acheter-tenues-fete-playa-del-carmen'
      },
      pt: {
        title: 'Melhores lugares para comprar roupas de festa em Playa del Carmen',
        excerpt: 'Lojas e boutiques onde você encontrará a roupa perfeita para seus eventos em Playa del Carmen, México. Descubra as melhores compras de moda na Riviera Maya.',
        slug: 'melhores-lugares-comprar-roupas-festa-playa-del-carmen'
      }
    }
  },
  {
    id: '55',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-10-15',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Tendencias en bebidas y mixología para eventos en 2025',
        excerpt: 'Las innovaciones en cócteles y bebidas que verás en los eventos este año.',
        slug: 'tendencias-bebidas-mixologia-eventos-2025'
      },
      en: {
        title: 'Drink and Mixology Trends for Events in 2025',
        excerpt: 'Innovations in cocktails and drinks you\'ll see at events this year. Discover the latest mixology trends at exclusive nightlife events in Mexico.',
        slug: 'drink-mixology-trends-events-2025'
      },
      fr: {
        title: 'Tendances des boissons et de la mixologie pour événements en 2025',
        excerpt: 'Innovations en cocktails et boissons que vous verrez lors d\'événements cette année. Découvrez les dernières tendances de mixologie lors d\'événements nocturnes exclusifs au Mexique.',
        slug: 'tendances-boissons-mixologie-evenements-2025'
      },
      pt: {
        title: 'Tendências de bebidas e mixologia para eventos em 2025',
        excerpt: 'Inovações em coquetéis e bebidas que você verá em eventos este ano. Descubra as últimas tendências de mixologia em eventos noturnos exclusivos no México.',
        slug: 'tendencias-bebidas-mixologia-eventos-2025'
      }
    }
  },
  {
    id: '56',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-10-20',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Cómo mantener la energía durante una noche de fiesta sin excederte',
        excerpt: 'Consejos para disfrutar toda la noche manteniendo un equilibrio saludable.',
        slug: 'mantener-energia-noche-fiesta-sin-excederte'
      },
      en: {
        title: 'How to Maintain Energy During a Party Night Without Overdoing It',
        excerpt: 'Tips to enjoy the entire night while maintaining a healthy balance. Essential advice for responsible partying at events in Mexico\'s nightlife destinations.',
        slug: 'maintain-energy-party-night-without-overdoing'
      },
      fr: {
        title: 'Comment maintenir l\'énergie pendant une soirée sans en faire trop',
        excerpt: 'Conseils pour profiter de toute la nuit tout en maintenant un équilibre sain. Conseils essentiels pour faire la fête de manière responsable lors d\'événements dans les destinations de vie nocturne du Mexique.',
        slug: 'maintenir-energie-soiree-sans-en-faire-trop'
      },
      pt: {
        title: 'Como manter a energia durante uma noite de festa sem exagerar',
        excerpt: 'Dicas para aproveitar a noite toda mantendo um equilíbrio saudável. Conselhos essenciais para festejar de forma responsável em eventos nos destinos de vida noturna do México.',
        slug: 'manter-energia-noite-festa-sem-exagerar'
      }
    }
  },
  {
    id: '57',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-10-25',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Entrevista con el equipo de logística de MandalaTickets: cómo organizan eventos exitosos',
        excerpt: 'Conoce el trabajo detrás de escena que hace posible cada evento perfecto.',
        slug: 'entrevista-equipo-logistica-mandalatickets'
      },
      en: {
        title: 'Interview with MandalaTickets Logistics Team: How They Organize Successful Events',
        excerpt: 'Learn about the behind-the-scenes work that makes every perfect event possible. Discover event logistics and organization in Mexico\'s event industry.',
        slug: 'interview-mandalatickets-logistics-team-organize-successful-events'
      },
      fr: {
        title: 'Entretien avec l\'équipe de logistique de MandalaTickets : comment ils organisent des événements réussis',
        excerpt: 'Découvrez le travail dans les coulisses qui rend chaque événement parfait possible. Découvrez la logistique d\'événements et l\'organisation dans l\'industrie des événements au Mexique.',
        slug: 'entretien-equipe-logistique-mandalatickets-organisent-evenements-reussis'
      },
      pt: {
        title: 'Entrevista com a equipe de logística da MandalaTickets: como eles organizam eventos bem-sucedidos',
        excerpt: 'Saiba mais sobre o trabalho nos bastidores que torna cada evento perfeito possível. Descubra logística de eventos e organização na indústria de eventos do México.',
        slug: 'entrevista-equipe-logistica-mandalatickets-organizam-eventos-bem-sucedidos'
      }
    }
  },
  {
    id: '58',
    category: CATEGORY_IDS.LOS_CABOS,
    date: '2024-11-01',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Los 5 eventos más exclusivos para celebrar Año Nuevo en Los Cabos',
        excerpt: 'Opciones VIP para recibir el Año Nuevo de forma inolvidable en Los Cabos.',
        slug: '5-eventos-exclusivos-ano-nuevo-los-cabos'
      },
      en: {
        title: '5 Most Exclusive Events to Celebrate New Year\'s Eve in Los Cabos',
        excerpt: 'VIP options to welcome the New Year in an unforgettable way in Los Cabos, Mexico. Discover exclusive New Year\'s celebrations in Cabo San Lucas.',
        slug: '5-most-exclusive-events-celebrate-new-years-eve-los-cabos'
      },
      fr: {
        title: '5 événements les plus exclusifs pour célébrer le Nouvel An à Los Cabos',
        excerpt: 'Options VIP pour accueillir le Nouvel An de manière inoubliable à Los Cabos, Mexique. Découvrez les célébrations exclusives du Nouvel An à Cabo San Lucas.',
        slug: '5-evenements-plus-exclusifs-celebrer-nouvel-an-los-cabos'
      },
      pt: {
        title: '5 eventos mais exclusivos para celebrar o Ano Novo em Los Cabos',
        excerpt: 'Opções VIP para receber o Ano Novo de forma inesquecível em Los Cabos, México. Descubra celebrações exclusivas de Ano Novo em Cabo San Lucas.',
        slug: '5-eventos-mais-exclusivos-celebrar-ano-novo-los-cabos'
      }
    }
  },
  {
    id: '59',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-11-05',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Cómo elegir el evento perfecto según tus gustos musicales',
        excerpt: 'Guía para encontrar el evento que mejor se adapte a tu estilo musical preferido.',
        slug: 'elegir-evento-perfecto-gustos-musicales'
      },
      en: {
        title: 'How to Choose the Perfect Event Based on Your Music Tastes',
        excerpt: 'Guide to find the event that best fits your preferred musical style. Discover events matching your taste at exclusive nightlife venues in Mexico.',
        slug: 'choose-perfect-event-based-music-tastes'
      },
      fr: {
        title: 'Comment choisir l\'événement parfait selon vos goûts musicaux',
        excerpt: 'Guide pour trouver l\'événement qui correspond le mieux à votre style musical préféré. Découvrez des événements correspondant à vos goûts dans des lieux de vie nocturne exclusifs au Mexique.',
        slug: 'choisir-evenement-parfait-gouts-musicaux'
      },
      pt: {
        title: 'Como escolher o evento perfeito com base nos seus gostos musicais',
        excerpt: 'Guia para encontrar o evento que melhor se adapta ao seu estilo musical preferido. Descubra eventos que correspondem ao seu gosto em locais exclusivos de vida noturna no México.',
        slug: 'escolher-evento-perfeito-gostos-musicais'
      }
    }
  },
  {
    id: '60',
    category: CATEGORY_IDS.PUERTO_VALLARTA,
    date: '2024-11-10',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Los mejores lugares para relajarte después de una noche de fiesta en Puerto Vallarta',
        excerpt: 'Spas, playas y lugares tranquilos para recuperarte después de una noche increíble.',
        slug: 'mejores-lugares-relajarte-despues-fiesta-puerto-vallarta'
      },
      en: {
        title: 'Best Places to Relax After a Party Night in Puerto Vallarta',
        excerpt: 'Spas, beaches, and peaceful places to recover after an incredible night in Puerto Vallarta, Mexico. Discover the best relaxation spots on the Pacific coast.',
        slug: 'best-places-relax-after-party-night-puerto-vallarta'
      },
      fr: {
        title: 'Meilleurs endroits pour se détendre après une soirée à Puerto Vallarta',
        excerpt: 'Spas, plages et endroits paisibles pour récupérer après une nuit incroyable à Puerto Vallarta, Mexique. Découvrez les meilleurs endroits de détente sur la côte Pacifique.',
        slug: 'meilleurs-endroits-detendre-apres-soiree-puerto-vallarta'
      },
      pt: {
        title: 'Melhores lugares para relaxar depois de uma noite de festa em Puerto Vallarta',
        excerpt: 'Spas, praias e lugares tranquilos para se recuperar depois de uma noite incrível em Puerto Vallarta, México. Descubra os melhores locais de relaxamento na costa do Pacífico.',
        slug: 'melhores-lugares-relaxar-depois-noite-festa-puerto-vallarta'
      }
    }
  },
  {
    id: '61',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-11-15',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Entrevista con el equipo de relaciones públicas de MandalaTickets: cómo construyen la comunidad',
        excerpt: 'Descubre cómo MandalaTickets ha creado una comunidad vibrante de amantes de la fiesta.',
        slug: 'entrevista-equipo-rrpp-mandalatickets'
      },
      en: {
        title: 'Interview with MandalaTickets Public Relations Team: How They Build Community',
        excerpt: 'Discover how MandalaTickets has created a vibrant community of party lovers. Learn about community building and PR strategies in the event industry.',
        slug: 'interview-mandalatickets-pr-team-build-community'
      },
      fr: {
        title: 'Entretien avec l\'équipe des relations publiques de MandalaTickets : comment ils construisent la communauté',
        excerpt: 'Découvrez comment MandalaTickets a créé une communauté vibrante d\'amateurs de fête. Apprenez-en plus sur la construction de communauté et les stratégies RP dans l\'industrie des événements.',
        slug: 'entretien-equipe-rp-mandalatickets-construisent-communaute'
      },
      pt: {
        title: 'Entrevista com a equipe de relações públicas da MandalaTickets: como eles constroem a comunidade',
        excerpt: 'Descubra como a MandalaTickets criou uma comunidade vibrante de amantes de festa. Saiba mais sobre construção de comunidade e estratégias de RP na indústria de eventos.',
        slug: 'entrevista-equipe-rp-mandalatickets-constroem-comunidade'
      }
    }
  },
  {
    id: '62',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-11-20',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Los 10 mejores momentos en video de los eventos de MandalaTickets',
        excerpt: 'Una compilación de los videos más emocionantes y memorables de nuestros eventos.',
        slug: '10-mejores-momentos-video-eventos-mandalatickets'
      },
      en: {
        title: '10 Best Video Moments from MandalaTickets Events',
        excerpt: 'A compilation of the most exciting and memorable videos from our exclusive events. Relive the best moments from nightlife events across Mexico.',
        slug: '10-best-video-moments-mandalatickets-events'
      },
      fr: {
        title: '10 meilleurs moments vidéo des événements MandalaTickets',
        excerpt: 'Une compilation des vidéos les plus passionnantes et mémorables de nos événements exclusifs. Revivez les meilleurs moments d\'événements nocturnes à travers le Mexique.',
        slug: '10-meilleurs-moments-video-evenements-mandalatickets'
      },
      pt: {
        title: '10 melhores momentos em vídeo dos eventos MandalaTickets',
        excerpt: 'Uma compilação dos vídeos mais emocionantes e memoráveis de nossos eventos exclusivos. Reviva os melhores momentos de eventos noturnos em todo o México.',
        slug: '10-melhores-momentos-video-eventos-mandalatickets'
      }
    }
  },
  {
    id: '63',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-11-25',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Cómo organizar una fiesta sorpresa en uno de los eventos de MandalaTickets',
        excerpt: 'Guía paso a paso para planificar una fiesta sorpresa exitosa en uno de nuestros eventos.',
        slug: 'organizar-fiesta-sorpresa-evento-mandalatickets'
      },
      en: {
        title: 'How to Organize a Surprise Party at a MandalaTickets Event',
        excerpt: 'Step-by-step guide to plan a successful surprise party at one of our exclusive events. Create unforgettable moments at events in Mexico.',
        slug: 'organize-surprise-party-mandalatickets-event'
      },
      fr: {
        title: 'Comment organiser une fête surprise lors d\'un événement MandalaTickets',
        excerpt: 'Guide étape par étape pour planifier une fête surprise réussie lors de l\'un de nos événements exclusifs. Créez des moments inoubliables lors d\'événements au Mexique.',
        slug: 'organiser-fete-surprise-evenement-mandalatickets'
      },
      pt: {
        title: 'Como organizar uma festa surpresa em um evento MandalaTickets',
        excerpt: 'Guia passo a passo para planejar uma festa surpresa bem-sucedida em um de nossos eventos exclusivos. Crie momentos inesquecíveis em eventos no México.',
        slug: 'organizar-festa-surpresa-evento-mandalatickets'
      }
    }
  },
  {
    id: '64',
    category: CATEGORY_IDS.CANCUN,
    date: '2024-12-01',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Los mejores lugares para comprar accesorios de fiesta en Cancún',
        excerpt: 'Tiendas donde encontrarás los accesorios perfectos para complementar tu look de fiesta.',
        slug: 'mejores-lugares-comprar-accesorios-fiesta-cancun'
      },
      en: {
        title: 'Best Places to Buy Party Accessories in Cancun',
        excerpt: 'Stores where you\'ll find the perfect accessories to complement your party look in Cancun, Mexico. Discover the best fashion accessories for nightlife events.',
        slug: 'best-places-buy-party-accessories-cancun'
      },
      fr: {
        title: 'Meilleurs endroits pour acheter des accessoires de fête à Cancún',
        excerpt: 'Magasins où vous trouverez les accessoires parfaits pour compléter votre look de fête à Cancún, Mexique. Découvrez les meilleurs accessoires de mode pour événements nocturnes.',
        slug: 'meilleurs-endroits-acheter-accessoires-fete-cancun'
      },
      pt: {
        title: 'Melhores lugares para comprar acessórios de festa em Cancún',
        excerpt: 'Lojas onde você encontrará os acessórios perfeitos para complementar seu look de festa em Cancún, México. Descubra os melhores acessórios de moda para eventos noturnos.',
        slug: 'melhores-lugares-comprar-acessorios-festa-cancun'
      }
    }
  },
  {
    id: '65',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-12-05',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Tendencias en decoración y ambientación para eventos en 2025',
        excerpt: 'Las tendencias de diseño que transformarán la experiencia visual de los eventos.',
        slug: 'tendencias-decoracion-ambientacion-eventos-2025'
      },
      en: {
        title: 'Decoration and Ambiance Trends for Events in 2025',
        excerpt: 'Design trends that will transform the visual experience of events. Discover the latest event decoration and ambiance trends at exclusive venues in Mexico.',
        slug: 'decoration-ambiance-trends-events-2025'
      },
      fr: {
        title: 'Tendances en décoration et ambiance pour événements en 2025',
        excerpt: 'Tendances de design qui transformeront l\'expérience visuelle des événements. Découvrez les dernières tendances de décoration et d\'ambiance d\'événements dans des lieux exclusifs au Mexique.',
        slug: 'tendances-decoration-ambiance-evenements-2025'
      },
      pt: {
        title: 'Tendências de decoração e ambiente para eventos em 2025',
        excerpt: 'Tendências de design que transformarão a experiência visual dos eventos. Descubra as últimas tendências de decoração e ambiente de eventos em locais exclusivos no México.',
        slug: 'tendencias-decoracao-ambiente-eventos-2025'
      }
    }
  },
  {
    id: '66',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-12-10',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Cómo mantener una actitud positiva y disfrutar al máximo de los eventos',
        excerpt: 'Consejos para tener la mejor actitud y aprovechar cada momento de los eventos.',
        slug: 'mantener-actitud-positiva-disfrutar-maximo-eventos'
      },
      en: {
        title: 'How to Maintain a Positive Attitude and Enjoy Events to the Fullest',
        excerpt: 'Tips to have the best attitude and make the most of every moment at events. Essential mindset advice for unforgettable nightlife experiences in Mexico.',
        slug: 'maintain-positive-attitude-enjoy-events-fullest'
      },
      fr: {
        title: 'Comment maintenir une attitude positive et profiter au maximum des événements',
        excerpt: 'Conseils pour avoir la meilleure attitude et profiter de chaque moment lors d\'événements. Conseils essentiels sur l\'état d\'esprit pour des expériences nocturnes inoubliables au Mexique.',
        slug: 'maintenir-attitude-positive-profit-maximum-evenements'
      },
      pt: {
        title: 'Como manter uma atitude positiva e aproveitar os eventos ao máximo',
        excerpt: 'Dicas para ter a melhor atitude e aproveitar cada momento nos eventos. Conselhos essenciais sobre mentalidade para experiências inesquecíveis de vida noturna no México.',
        slug: 'manter-atitude-positiva-aproveitar-eventos-maximo'
      }
    }
  },
  {
    id: '67',
    category: CATEGORY_IDS.GENERAL,
    date: '2024-12-15',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Entrevista con el equipo de atención al cliente de MandalaTickets: cómo garantizan una experiencia excepcional',
        excerpt: 'Conoce cómo el equipo de atención al cliente asegura que cada asistente tenga la mejor experiencia.',
        slug: 'entrevista-equipo-atencion-cliente-mandalatickets'
      },
      en: {
        title: 'Interview with MandalaTickets Customer Service Team: How They Guarantee Exceptional Experience',
        excerpt: 'Learn how the customer service team ensures every attendee has the best experience. Discover customer care excellence at exclusive events in Mexico.',
        slug: 'interview-mandalatickets-customer-service-team-exceptional-experience'
      },
      fr: {
        title: 'Entretien avec l\'équipe du service client de MandalaTickets : comment ils garantissent une expérience exceptionnelle',
        excerpt: 'Découvrez comment l\'équipe du service client s\'assure que chaque participant ait la meilleure expérience. Découvrez l\'excellence du service client lors d\'événements exclusifs au Mexique.',
        slug: 'entretien-equipe-service-client-mandalatickets-experience-exceptionnelle'
      },
      pt: {
        title: 'Entrevista com a equipe de atendimento ao cliente da MandalaTickets: como eles garantem uma experiência excepcional',
        excerpt: 'Saiba como a equipe de atendimento ao cliente garante que cada participante tenha a melhor experiência. Descubra a excelência no atendimento ao cliente em eventos exclusivos no México.',
        slug: 'entrevista-equipe-atendimento-cliente-mandalatickets-experiencia-excepcional'
      }
    }
  },
  {
    id: '68',
    category: CATEGORY_IDS.TULUM,
    date: '2024-12-20',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Los 5 eventos más esperados para la temporada de primavera en Tulum',
        excerpt: 'Una selección de los eventos más emocionantes que llegarán a Tulum esta primavera.',
        slug: '5-eventos-esperados-temporada-primavera-tulum'
      },
      en: {
        title: '5 Most Anticipated Events for Spring Season in Tulum',
        excerpt: 'A selection of the most exciting events coming to Tulum this spring. Discover exclusive spring events and nightlife experiences in Tulum, Mexico.',
        slug: '5-most-anticipated-events-spring-season-tulum'
      },
      fr: {
        title: '5 événements les plus attendus pour la saison de printemps à Tulum',
        excerpt: 'Une sélection des événements les plus excitants qui arrivent à Tulum ce printemps. Découvrez des événements de printemps exclusifs et des expériences de vie nocturne à Tulum, Mexique.',
        slug: '5-evenements-plus-attendus-saison-printemps-tulum'
      },
      pt: {
        title: '5 eventos mais aguardados para a temporada de primavera em Tulum',
        excerpt: 'Uma seleção dos eventos mais emocionantes que chegam a Tulum nesta primavera. Descubra eventos exclusivos de primavera e experiências de vida noturna em Tulum, México.',
        slug: '5-eventos-mais-aguardados-temporada-primavera-tulum'
      }
    }
  },
  {
    id: '69',
    category: CATEGORY_IDS.CANCUN,
    date: '2024-12-25',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Guía completa de Cancún: playas, eventos y vida nocturna',
        excerpt: 'Todo lo que necesitas saber sobre Cancún, desde sus playas hasta su vibrante escena nocturna.',
        slug: 'guia-completa-cancun-playas-eventos-vida-nocturna'
      },
      en: {
        title: 'Complete Guide to Cancun: Beaches, Events, and Nightlife',
        excerpt: 'Everything you need to know about Cancun, from its beaches to its vibrant nightlife scene. Your ultimate guide to Cancun, Mexico\'s premier party destination.',
        slug: 'complete-guide-cancun-beaches-events-nightlife'
      },
      fr: {
        title: 'Guide complet de Cancún : plages, événements et vie nocturne',
        excerpt: 'Tout ce que vous devez savoir sur Cancún, de ses plages à sa scène nocturne vibrante. Votre guide ultime de Cancún, la principale destination de fête du Mexique.',
        slug: 'guide-complet-cancun-plages-evenements-vie-nocturne'
      },
      pt: {
        title: 'Guia completo de Cancún: praias, eventos e vida noturna',
        excerpt: 'Tudo o que você precisa saber sobre Cancún, de suas praias à sua vibrante cena noturna. Seu guia definitivo para Cancún, o principal destino de festa do México.',
        slug: 'guia-completo-cancun-praias-eventos-vida-noturna'
      }
    }
  },
  {
    id: '70',
    category: CATEGORY_IDS.GENERAL,
    date: '2025-01-01',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Cómo aprovechar los paquetes especiales de MandalaTickets',
        excerpt: 'Guía para elegir y aprovechar los mejores paquetes que incluyen eventos, hospedaje y más.',
        slug: 'aprovechar-paquetes-especiales-mandalatickets'
      },
      en: {
        title: 'How to Take Advantage of MandalaTickets Special Packages',
        excerpt: 'Guide to choose and take advantage of the best packages that include events, accommodation, and more. Discover value-packed deals for exclusive events in Mexico.',
        slug: 'take-advantage-mandalatickets-special-packages'
      },
      fr: {
        title: 'Comment profiter des forfaits spéciaux de MandalaTickets',
        excerpt: 'Guide pour choisir et profiter des meilleurs forfaits qui incluent des événements, un hébergement et plus encore. Découvrez des offres à forte valeur ajoutée pour des événements exclusifs au Mexique.',
        slug: 'profiter-forfaits-speciaux-mandalatickets'
      },
      pt: {
        title: 'Como aproveitar os pacotes especiais da MandalaTickets',
        excerpt: 'Guia para escolher e aproveitar os melhores pacotes que incluem eventos, hospedagem e muito mais. Descubra ofertas de grande valor para eventos exclusivos no México.',
        slug: 'aproveitar-pacotes-especiais-mandalatickets'
      }
    }
  },
  {
    id: '71',
    category: CATEGORY_IDS.PLAYA_DEL_CARMEN,
    date: '2025-01-05',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Los mejores eventos para solteros en Playa del Carmen',
        excerpt: 'Eventos diseñados especialmente para personas solteras que buscan conocer gente nueva.',
        slug: 'mejores-eventos-solteros-playa-carmen'
      },
      en: {
        title: 'Best Events for Singles in Playa del Carmen',
        excerpt: 'Events designed especially for single people looking to meet new people. Discover singles events and nightlife experiences in Playa del Carmen, Mexico.',
        slug: 'best-events-singles-playa-del-carmen'
      },
      fr: {
        title: 'Meilleurs événements pour célibataires à Playa del Carmen',
        excerpt: 'Événements conçus spécialement pour les célibataires qui cherchent à rencontrer de nouvelles personnes. Découvrez des événements pour célibataires et des expériences de vie nocturne à Playa del Carmen, Mexique.',
        slug: 'meilleurs-evenements-celibataires-playa-del-carmen'
      },
      pt: {
        title: 'Melhores eventos para solteiros em Playa del Carmen',
        excerpt: 'Eventos projetados especialmente para pessoas solteiras que buscam conhecer pessoas novas. Descubra eventos para solteiros e experiências de vida noturna em Playa del Carmen, México.',
        slug: 'melhores-eventos-solteiros-playa-del-carmen'
      }
    }
  },
  {
    id: '72',
    category: CATEGORY_IDS.GENERAL,
    date: '2025-01-10',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Cómo planificar tu primera visita a un evento de MandalaTickets',
        excerpt: 'Todo lo que un principiante necesita saber antes de asistir a su primer evento.',
        slug: 'planificar-primera-visita-evento-mandalatickets'
      },
      en: {
        title: 'How to Plan Your First Visit to a MandalaTickets Event',
        excerpt: 'Everything a beginner needs to know before attending their first event. Essential guide for first-time attendees at exclusive events in Mexico.',
        slug: 'plan-first-visit-mandalatickets-event'
      },
      fr: {
        title: 'Comment planifier votre première visite à un événement MandalaTickets',
        excerpt: 'Tout ce qu\'un débutant doit savoir avant d\'assister à son premier événement. Guide essentiel pour les participants de première fois lors d\'événements exclusifs au Mexique.',
        slug: 'planifier-premiere-visite-evenement-mandalatickets'
      },
      pt: {
        title: 'Como planejar sua primeira visita a um evento MandalaTickets',
        excerpt: 'Tudo que um iniciante precisa saber antes de assistir ao seu primeiro evento. Guia essencial para participantes de primeira vez em eventos exclusivos no México.',
        slug: 'planejar-primeira-visita-evento-mandalatickets'
      }
    }
  },
  {
    id: '73',
    category: CATEGORY_IDS.LOS_CABOS,
    date: '2025-01-15',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Entrevista con el DJ internacional que debutará en Los Cabos',
        excerpt: 'Conoce al artista internacional que por primera vez se presentará en Los Cabos.',
        slug: 'entrevista-dj-internacional-debutara-los-cabos'
      },
      en: {
        title: 'Interview with International DJ Making Debut in Los Cabos',
        excerpt: 'Meet the international artist performing for the first time in Los Cabos, Mexico. Discover upcoming DJ performances at exclusive events in Cabo San Lucas.',
        slug: 'interview-international-dj-debut-los-cabos'
      },
      fr: {
        title: 'Entretien avec le DJ international qui fera ses débuts à Los Cabos',
        excerpt: 'Rencontrez l\'artiste international qui se produira pour la première fois à Los Cabos, Mexique. Découvrez les prochaines performances de DJ lors d\'événements exclusifs à Cabo San Lucas.',
        slug: 'entretien-dj-international-debut-los-cabos'
      },
      pt: {
        title: 'Entrevista com DJ internacional que fará estreia em Los Cabos',
        excerpt: 'Conheça o artista internacional que se apresentará pela primeira vez em Los Cabos, México. Descubra próximas apresentações de DJs em eventos exclusivos em Cabo San Lucas.',
        slug: 'entrevista-dj-internacional-estreia-los-cabos'
      }
    }
  },
  {
    id: '74',
    category: CATEGORY_IDS.PUERTO_VALLARTA,
    date: '2025-01-20',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Los mejores eventos al aire libre en Puerto Vallarta',
        excerpt: 'Una selección de eventos al aire libre que aprovechan el clima perfecto de Puerto Vallarta.',
        slug: 'mejores-eventos-aire-libre-puerto-vallarta'
      },
      en: {
        title: 'Best Outdoor Events in Puerto Vallarta',
        excerpt: 'A selection of outdoor events that take advantage of Puerto Vallarta\'s perfect weather. Discover open-air parties and beach events on Mexico\'s Pacific coast.',
        slug: 'best-outdoor-events-puerto-vallarta'
      },
      fr: {
        title: 'Meilleurs événements en plein air à Puerto Vallarta',
        excerpt: 'Une sélection d\'événements en plein air qui profitent du climat parfait de Puerto Vallarta. Découvrez des fêtes en plein air et des événements sur la plage sur la côte Pacifique du Mexique.',
        slug: 'meilleurs-evenements-plein-air-puerto-vallarta'
      },
      pt: {
        title: 'Melhores eventos ao ar livre em Puerto Vallarta',
        excerpt: 'Uma seleção de eventos ao ar livre que aproveitam o clima perfeito de Puerto Vallarta. Descubra festas ao ar livre e eventos na praia na costa do Pacífico do México.',
        slug: 'melhores-eventos-ar-livre-puerto-vallarta'
      }
    }
  },
  {
    id: '75',
    category: CATEGORY_IDS.GENERAL,
    date: '2025-01-25',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Tendencias en tecnología para eventos: realidad aumentada y más',
        excerpt: 'Cómo la tecnología está transformando la experiencia en los eventos nocturnos.',
        slug: 'tendencias-tecnologia-eventos-realidad-aumentada'
      },
      en: {
        title: 'Technology Trends for Events: Augmented Reality and More',
        excerpt: 'How technology is transforming the experience at nightlife events. Discover cutting-edge tech innovations at exclusive events in Mexico.',
        slug: 'technology-trends-events-augmented-reality-more'
      },
      fr: {
        title: 'Tendances technologiques pour événements : réalité augmentée et plus encore',
        excerpt: 'Comment la technologie transforme l\'expérience lors d\'événements nocturnes. Découvrez des innovations technologiques de pointe lors d\'événements exclusifs au Mexique.',
        slug: 'tendances-technologiques-evenements-realite-augmentee-plus'
      },
      pt: {
        title: 'Tendências tecnológicas para eventos: realidade aumentada e muito mais',
        excerpt: 'Como a tecnologia está transformando a experiência em eventos noturnos. Descubra inovações tecnológicas de ponta em eventos exclusivos no México.',
        slug: 'tendencias-tecnologicas-eventos-realidade-aumentada-mais'
      }
    }
  },
  {
    id: '76',
    category: CATEGORY_IDS.TULUM,
    date: '2025-02-01',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Cómo combinar eventos y turismo en tu visita a Tulum',
        excerpt: 'Estrategias para disfrutar tanto de los eventos como de las atracciones turísticas de Tulum.',
        slug: 'combinar-eventos-turismo-visita-tulum'
      },
      en: {
        title: 'How to Combine Events and Tourism on Your Visit to Tulum',
        excerpt: 'Strategies to enjoy both events and tourist attractions in Tulum. Plan the perfect trip combining nightlife events with Tulum\'s incredible sights in Mexico.',
        slug: 'combine-events-tourism-visit-tulum'
      },
      fr: {
        title: 'Comment combiner événements et tourisme lors de votre visite à Tulum',
        excerpt: 'Stratégies pour profiter à la fois des événements et des attractions touristiques de Tulum. Planifiez le voyage parfait en combinant événements nocturnes avec les sites incroyables de Tulum au Mexique.',
        slug: 'combiner-evenements-tourisme-visite-tulum'
      },
      pt: {
        title: 'Como combinar eventos e turismo em sua visita a Tulum',
        excerpt: 'Estratégias para desfrutar de eventos e atrações turísticas em Tulum. Planeje a viagem perfeita combinando eventos noturnos com os incríveis pontos turísticos de Tulum no México.',
        slug: 'combinar-eventos-turismo-visita-tulum'
      }
    }
  },
  {
    id: '77',
    category: CATEGORY_IDS.CANCUN,
    date: '2025-02-05',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Los mejores eventos temáticos de los 80s y 90s en Cancún',
        excerpt: 'Eventos nostálgicos que reviven la música y el estilo de las décadas de los 80s y 90s.',
        slug: 'mejores-eventos-tematicos-80s-90s-cancun'
      },
      en: {
        title: 'Best 80s and 90s Themed Events in Cancun',
        excerpt: 'Nostalgic events that revive the music and style of the 80s and 90s decades. Discover retro-themed parties and throwback events in Cancun, Mexico.',
        slug: 'best-80s-90s-themed-events-cancun'
      },
      fr: {
        title: 'Meilleurs événements à thème des années 80 et 90 à Cancún',
        excerpt: 'Événements nostalgiques qui font revivre la musique et le style des décennies 80 et 90. Découvrez des fêtes à thème rétro et des événements nostalgiques à Cancún, Mexique.',
        slug: 'meilleurs-evenements-theme-annees-80-90-cancun'
      },
      pt: {
        title: 'Melhores eventos temáticos dos anos 80 e 90 em Cancún',
        excerpt: 'Eventos nostálgicos que revivem a música e o estilo das décadas de 80 e 90. Descubra festas temáticas retrô e eventos nostálgicos em Cancún, México.',
        slug: 'melhores-eventos-tematicos-anos-80-90-cancun'
      }
    }
  },
  {
    id: '78',
    category: CATEGORY_IDS.LOS_CABOS,
    date: '2025-02-10',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Guía de etiqueta para eventos VIP en Los Cabos',
        excerpt: 'Consejos sobre cómo comportarse y qué esperar en eventos VIP exclusivos.',
        slug: 'guia-etiqueta-eventos-vip-los-cabos'
      },
      en: {
        title: 'Etiquette Guide for VIP Events in Los Cabos',
        excerpt: 'Tips on how to behave and what to expect at exclusive VIP events. Essential guide for VIP experiences at exclusive events in Los Cabos, Mexico.',
        slug: 'etiquette-guide-vip-events-los-cabos'
      },
      fr: {
        title: 'Guide de l\'étiquette pour événements VIP à Los Cabos',
        excerpt: 'Conseils sur la façon de se comporter et ce à quoi s\'attendre lors d\'événements VIP exclusifs. Guide essentiel pour les expériences VIP lors d\'événements exclusifs à Los Cabos, Mexique.',
        slug: 'guide-etiquette-evenements-vip-los-cabos'
      },
      pt: {
        title: 'Guia de etiqueta para eventos VIP em Los Cabos',
        excerpt: 'Dicas sobre como se comportar e o que esperar em eventos VIP exclusivos. Guia essencial para experiências VIP em eventos exclusivos em Los Cabos, México.',
        slug: 'guia-etiqueta-eventos-vip-los-cabos'
      }
    }
  },
  {
    id: '79',
    category: CATEGORY_IDS.GENERAL,
    date: '2025-02-15',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Entrevista con el productor musical detrás de los eventos más exitosos',
        excerpt: 'Conoce al productor que ha creado algunos de los eventos más memorables de la Riviera Maya.',
        slug: 'entrevista-productor-musical-eventos-exitosos'
      },
      en: {
        title: 'Interview with Music Producer Behind Most Successful Events',
        excerpt: 'Meet the producer who has created some of the most memorable events in the Riviera Maya. Learn about music production and event curation in Mexico.',
        slug: 'interview-music-producer-behind-successful-events'
      },
      fr: {
        title: 'Entretien avec le producteur musical derrière les événements les plus réussis',
        excerpt: 'Rencontrez le producteur qui a créé certains des événements les plus mémorables de la Riviera Maya. Apprenez-en plus sur la production musicale et la curation d\'événements au Mexique.',
        slug: 'entretien-producteur-musical-evenements-reussis'
      },
      pt: {
        title: 'Entrevista com o produtor musical por trás dos eventos mais bem-sucedidos',
        excerpt: 'Conheça o produtor que criou alguns dos eventos mais memoráveis da Riviera Maya. Saiba mais sobre produção musical e curadoria de eventos no México.',
        slug: 'entrevista-produtor-musical-eventos-bem-sucedidos'
      }
    }
  },
  {
    id: '80',
    category: CATEGORY_IDS.PLAYA_DEL_CARMEN,
    date: '2025-02-20',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Los mejores eventos para grupos grandes en Playa del Carmen',
        excerpt: 'Eventos ideales para celebrar con grupos grandes de amigos o familiares.',
        slug: 'mejores-eventos-grupos-grandes-playa-carmen'
      },
      en: {
        title: 'Best Events for Large Groups in Playa del Carmen',
        excerpt: 'Ideal events to celebrate with large groups of friends or family. Discover group-friendly events and special packages in Playa del Carmen, Mexico.',
        slug: 'best-events-large-groups-playa-del-carmen'
      },
      fr: {
        title: 'Meilleurs événements pour grands groupes à Playa del Carmen',
        excerpt: 'Événements idéaux pour célébrer avec de grands groupes d\'amis ou de famille. Découvrez des événements adaptés aux groupes et des forfaits spéciaux à Playa del Carmen, Mexique.',
        slug: 'meilleurs-evenements-grands-groupes-playa-del-carmen'
      },
      pt: {
        title: 'Melhores eventos para grupos grandes em Playa del Carmen',
        excerpt: 'Eventos ideais para celebrar com grandes grupos de amigos ou familiares. Descubra eventos adequados para grupos e pacotes especiais em Playa del Carmen, México.',
        slug: 'melhores-eventos-grupos-grandes-playa-del-carmen'
      }
    }
  },
  {
    id: '81',
    category: CATEGORY_IDS.GENERAL,
    date: '2025-02-25',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Cómo documentar tu experiencia en eventos: fotografía y video',
        excerpt: 'Tips profesionales para capturar los mejores momentos de los eventos.',
        slug: 'documentar-experiencia-eventos-fotografia-video'
      },
      en: {
        title: 'How to Document Your Event Experience: Photography and Video',
        excerpt: 'Professional tips to capture the best moments from events. Essential photography and videography guide for nightlife events in Mexico.',
        slug: 'document-event-experience-photography-video'
      },
      fr: {
        title: 'Comment documenter votre expérience d\'événement : photographie et vidéo',
        excerpt: 'Conseils professionnels pour capturer les meilleurs moments des événements. Guide essentiel de photographie et vidéographie pour événements nocturnes au Mexique.',
        slug: 'documenter-experience-evenement-photographie-video'
      },
      pt: {
        title: 'Como documentar sua experiência em eventos: fotografia e vídeo',
        excerpt: 'Dicas profissionais para capturar os melhores momentos dos eventos. Guia essencial de fotografia e videografia para eventos noturnos no México.',
        slug: 'documentar-experiencia-eventos-fotografia-video'
      }
    }
  },
  {
    id: '82',
    category: CATEGORY_IDS.GENERAL,
    date: '2025-03-01',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Tendencias en sostenibilidad en eventos nocturnos',
        excerpt: 'Cómo la industria de eventos está adoptando prácticas más sostenibles y ecológicas.',
        slug: 'tendencias-sostenibilidad-eventos-nocturnos'
      },
      en: {
        title: 'Sustainability Trends in Nightlife Events',
        excerpt: 'How the event industry is adopting more sustainable and eco-friendly practices. Discover green initiatives at exclusive events in Mexico.',
        slug: 'sustainability-trends-nightlife-events'
      },
      fr: {
        title: 'Tendances de durabilité dans les événements nocturnes',
        excerpt: 'Comment l\'industrie des événements adopte des pratiques plus durables et écologiques. Découvrez les initiatives vertes lors d\'événements exclusifs au Mexique.',
        slug: 'tendances-durabilite-evenements-nocturnes'
      },
      pt: {
        title: 'Tendências de sustentabilidade em eventos noturnos',
        excerpt: 'Como a indústria de eventos está adotando práticas mais sustentáveis e ecológicas. Descubra iniciativas verdes em eventos exclusivos no México.',
        slug: 'tendencias-sustentabilidade-eventos-noturnos'
      }
    }
  },
  {
    id: '83',
    category: CATEGORY_IDS.CANCUN,
    date: '2025-03-05',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Los mejores eventos para celebrar San Valentín en Cancún',
        excerpt: 'Opciones románticas y especiales para celebrar el Día de San Valentín.',
        slug: 'mejores-eventos-san-valentin-cancun'
      },
      en: {
        title: 'Best Events to Celebrate Valentine\'s Day in Cancun',
        excerpt: 'Romantic and special options to celebrate Valentine\'s Day. Discover intimate and romantic events for couples in Cancun, Mexico.',
        slug: 'best-events-celebrate-valentines-day-cancun'
      },
      fr: {
        title: 'Meilleurs événements pour célébrer la Saint-Valentin à Cancún',
        excerpt: 'Options romantiques et spéciales pour célébrer la Saint-Valentin. Découvrez des événements intimes et romantiques pour couples à Cancún, Mexique.',
        slug: 'meilleurs-evenements-celebrer-saint-valentin-cancun'
      },
      pt: {
        title: 'Melhores eventos para celebrar o Dia dos Namorados em Cancún',
        excerpt: 'Opções românticas e especiais para celebrar o Dia dos Namorados. Descubra eventos íntimos e românticos para casais em Cancún, México.',
        slug: 'melhores-eventos-celebrar-dia-namorados-cancun'
      }
    }
  },
  {
    id: '84',
    category: CATEGORY_IDS.GENERAL,
    date: '2025-03-10',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Guía de seguridad personal para eventos nocturnos',
        excerpt: 'Consejos importantes de seguridad para disfrutar de los eventos de forma responsable.',
        slug: 'guia-seguridad-personal-eventos-nocturnos'
      },
      en: {
        title: 'Personal Safety Guide for Nightlife Events',
        excerpt: 'Important safety tips to enjoy events responsibly. Essential safety advice for nightlife experiences in Mexico\'s party destinations.',
        slug: 'personal-safety-guide-nightlife-events'
      },
      fr: {
        title: 'Guide de sécurité personnelle pour événements nocturnes',
        excerpt: 'Conseils de sécurité importants pour profiter des événements de manière responsable. Conseils de sécurité essentiels pour les expériences de vie nocturne dans les destinations de fête du Mexique.',
        slug: 'guide-securite-personnelle-evenements-nocturnes'
      },
      pt: {
        title: 'Guia de segurança pessoal para eventos noturnos',
        excerpt: 'Dicas importantes de segurança para desfrutar de eventos com responsabilidade. Conselhos essenciais de segurança para experiências de vida noturna nos destinos de festa do México.',
        slug: 'guia-seguranca-pessoal-eventos-noturnos'
      }
    }
  },
  {
    id: '85',
    category: CATEGORY_IDS.GENERAL,
    date: '2025-03-15',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Entrevista con el creador de contenido que documenta los eventos de MandalaTickets',
        excerpt: 'Conoce al influencer que está compartiendo la experiencia de MandalaTickets con el mundo.',
        slug: 'entrevista-creador-contenido-documenta-eventos-mandalatickets'
      },
      en: {
        title: 'Interview with Content Creator Documenting MandalaTickets Events',
        excerpt: 'Meet the influencer sharing the MandalaTickets experience with the world. Learn about content creation and event documentation in Mexico.',
        slug: 'interview-content-creator-documenting-mandalatickets-events'
      },
      fr: {
        title: 'Entretien avec le créateur de contenu qui documente les événements MandalaTickets',
        excerpt: 'Rencontrez l\'influenceur qui partage l\'expérience MandalaTickets avec le monde. Apprenez-en plus sur la création de contenu et la documentation d\'événements au Mexique.',
        slug: 'entretien-createur-contenu-documente-evenements-mandalatickets'
      },
      pt: {
        title: 'Entrevista com criador de conteúdo que documenta eventos MandalaTickets',
        excerpt: 'Conheça o influencer que está compartilhando a experiência MandalaTickets com o mundo. Saiba mais sobre criação de conteúdo e documentação de eventos no México.',
        slug: 'entrevista-criador-conteudo-documenta-eventos-mandalatickets'
      }
    }
  },
  {
    id: '86',
    category: CATEGORY_IDS.TULUM,
    date: '2025-03-20',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Los mejores eventos de música house en Tulum',
        excerpt: 'Una selección de los mejores eventos de música house que encontrarás en Tulum.',
        slug: 'mejores-eventos-musica-house-tulum'
      },
      en: {
        title: 'Best House Music Events in Tulum',
        excerpt: 'A selection of the best house music events you\'ll find in Tulum. Discover electronic music events and house parties in Tulum, Mexico.',
        slug: 'best-house-music-events-tulum'
      },
      fr: {
        title: 'Meilleurs événements de musique house à Tulum',
        excerpt: 'Une sélection des meilleurs événements de musique house que vous trouverez à Tulum. Découvrez des événements de musique électronique et des fêtes house à Tulum, Mexique.',
        slug: 'meilleurs-evenements-musique-house-tulum'
      },
      pt: {
        title: 'Melhores eventos de música house em Tulum',
        excerpt: 'Uma seleção dos melhores eventos de música house que você encontrará em Tulum. Descubra eventos de música eletrônica e festas house em Tulum, México.',
        slug: 'melhores-eventos-musica-house-tulum'
      }
    }
  },
  {
    id: '87',
    category: CATEGORY_IDS.GENERAL,
    date: '2025-03-25',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Cómo crear el playlist perfecto para prepararte para un evento',
        excerpt: 'Tips para crear una lista de reproducción que te ponga en el mood perfecto antes del evento.',
        slug: 'crear-playlist-perfecto-prepararse-evento'
      },
      en: {
        title: 'How to Create the Perfect Playlist to Prepare for an Event',
        excerpt: 'Tips to create a playlist that puts you in the perfect mood before the event. Essential music preparation guide for nightlife events in Mexico.',
        slug: 'create-perfect-playlist-prepare-event'
      },
      fr: {
        title: 'Comment créer la playlist parfaite pour se préparer à un événement',
        excerpt: 'Conseils pour créer une playlist qui vous met dans l\'ambiance parfaite avant l\'événement. Guide essentiel de préparation musicale pour événements nocturnes au Mexique.',
        slug: 'creer-playlist-parfaite-preparer-evenement'
      },
      pt: {
        title: 'Como criar a playlist perfeita para se preparar para um evento',
        excerpt: 'Dicas para criar uma playlist que te coloque no clima perfeito antes do evento. Guia essencial de preparação musical para eventos noturnos no México.',
        slug: 'criar-playlist-perfeita-preparar-evento'
      }
    }
  },
  {
    id: '88',
    category: CATEGORY_IDS.GENERAL,
    date: '2025-04-01',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Los mejores eventos para celebrar el Día de la Independencia en México',
        excerpt: 'Eventos especiales para celebrar las fiestas patrias en los destinos de MandalaTickets.',
        slug: 'mejores-eventos-dia-independencia-mexico'
      },
      en: {
        title: 'Best Events to Celebrate Mexican Independence Day',
        excerpt: 'Special events to celebrate Independence Day in MandalaTickets destinations. Discover patriotic celebrations and special events across Mexico.',
        slug: 'best-events-celebrate-mexican-independence-day'
      },
      fr: {
        title: 'Meilleurs événements pour célébrer le Jour de l\'Indépendance au Mexique',
        excerpt: 'Événements spéciaux pour célébrer le Jour de l\'Indépendance dans les destinations MandalaTickets. Découvrez les célébrations patriotiques et événements spéciaux à travers le Mexique.',
        slug: 'meilleurs-evenements-celebrer-jour-independance-mexique'
      },
      pt: {
        title: 'Melhores eventos para celebrar o Dia da Independência do México',
        excerpt: 'Eventos especiais para celebrar o Dia da Independência nos destinos MandalaTickets. Descubra celebrações patrióticas e eventos especiais em todo o México.',
        slug: 'melhores-eventos-celebrar-dia-independencia-mexico'
      }
    }
  },
  {
    id: '89',
    category: CATEGORY_IDS.GENERAL,
    date: '2025-04-05',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Tendencias en experiencias inmersivas en eventos',
        excerpt: 'Cómo los eventos están creando experiencias más inmersivas y envolventes.',
        slug: 'tendencias-experiencias-inmersivas-eventos'
      },
      en: {
        title: 'Trends in Immersive Experiences at Events',
        excerpt: 'How events are creating more immersive and engaging experiences. Discover cutting-edge immersive event technologies at exclusive venues in Mexico.',
        slug: 'trends-immersive-experiences-events'
      },
      fr: {
        title: 'Tendances des expériences immersives lors d\'événements',
        excerpt: 'Comment les événements créent des expériences plus immersives et engageantes. Découvrez les technologies d\'événements immersives de pointe dans des lieux exclusifs au Mexique.',
        slug: 'tendances-experiences-immersives-evenements'
      },
      pt: {
        title: 'Tendências de experiências imersivas em eventos',
        excerpt: 'Como os eventos estão criando experiências mais imersivas e envolventes. Descubra tecnologias de eventos imersivos de ponta em locais exclusivos no México.',
        slug: 'tendencias-experiencias-imersivas-eventos'
      }
    }
  },
  {
    id: '90',
    category: CATEGORY_IDS.LOS_CABOS,
    date: '2025-04-10',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Guía completa de Los Cabos: eventos, playas y aventuras',
        excerpt: 'Todo sobre Los Cabos: desde eventos nocturnos hasta actividades de aventura durante el día.',
        slug: 'guia-completa-los-cabos-eventos-playas-aventuras'
      },
      en: {
        title: 'Complete Guide to Los Cabos: Events, Beaches, and Adventures',
        excerpt: 'Everything about Los Cabos: from nightlife events to daytime adventure activities. Your ultimate guide to Los Cabos, Mexico\'s premier Baja California destination.',
        slug: 'complete-guide-los-cabos-events-beaches-adventures'
      },
      fr: {
        title: 'Guide complet de Los Cabos : événements, plages et aventures',
        excerpt: 'Tout sur Los Cabos : des événements nocturnes aux activités d\'aventure de jour. Votre guide ultime de Los Cabos, la destination phare de Basse-Californie au Mexique.',
        slug: 'guide-complet-los-cabos-evenements-plages-aventures'
      },
      pt: {
        title: 'Guia completo de Los Cabos: eventos, praias e aventuras',
        excerpt: 'Tudo sobre Los Cabos: de eventos noturnos a atividades de aventura durante o dia. Seu guia definitivo para Los Cabos, o principal destino da Baja California no México.',
        slug: 'guia-completo-los-cabos-eventos-praias-aventuras'
      }
    }
  },
  {
    id: '91',
    category: CATEGORY_IDS.GENERAL,
    date: '2025-04-15',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Cómo aprovechar los descuentos de último minuto en MandalaTickets',
        excerpt: 'Estrategias para encontrar y aprovechar las mejores ofertas de último minuto.',
        slug: 'aprovechar-descuentos-ultimo-minuto-mandalatickets'
      },
      en: {
        title: 'How to Take Advantage of Last-Minute Discounts at MandalaTickets',
        excerpt: 'Strategies to find and take advantage of the best last-minute deals. Discover exclusive last-minute offers for events in Mexico\'s top destinations.',
        slug: 'take-advantage-last-minute-discounts-mandalatickets'
      },
      fr: {
        title: 'Comment profiter des réductions de dernière minute chez MandalaTickets',
        excerpt: 'Stratégies pour trouver et profiter des meilleures offres de dernière minute. Découvrez des offres exclusives de dernière minute pour des événements dans les meilleures destinations du Mexique.',
        slug: 'profiter-reductions-derniere-minute-mandalatickets'
      },
      pt: {
        title: 'Como aproveitar descontos de última hora na MandalaTickets',
        excerpt: 'Estratégias para encontrar e aproveitar as melhores ofertas de última hora. Descubra ofertas exclusivas de última hora para eventos nos principais destinos do México.',
        slug: 'aproveitar-descontos-ultima-hora-mandalatickets'
      }
    }
  },
  {
    id: '92',
    category: CATEGORY_IDS.CANCUN,
    date: '2025-04-20',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Los mejores eventos para amantes del reggaetón en Cancún',
        excerpt: 'Una selección de eventos dedicados al reggaetón y música urbana latina.',
        slug: 'mejores-eventos-reggaeton-cancun'
      },
      en: {
        title: 'Best Events for Reggaeton Lovers in Cancun',
        excerpt: 'A selection of events dedicated to reggaeton and Latin urban music. Discover reggaeton parties and Latin music events in Cancun, Mexico.',
        slug: 'best-events-reggaeton-lovers-cancun'
      },
      fr: {
        title: 'Meilleurs événements pour les amateurs de reggaeton à Cancún',
        excerpt: 'Une sélection d\'événements dédiés au reggaeton et à la musique urbaine latine. Découvrez les fêtes reggaeton et événements de musique latine à Cancún, Mexique.',
        slug: 'meilleurs-evenements-amateurs-reggaeton-cancun'
      },
      pt: {
        title: 'Melhores eventos para amantes de reggaeton em Cancún',
        excerpt: 'Uma seleção de eventos dedicados ao reggaeton e música urbana latina. Descubra festas de reggaeton e eventos de música latina em Cancún, México.',
        slug: 'melhores-eventos-amantes-reggaeton-cancun'
      }
    }
  },
  {
    id: '93',
    category: CATEGORY_IDS.GENERAL,
    date: '2025-04-25',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Cómo mantenerte conectado durante los eventos: WiFi y carga de batería',
        excerpt: 'Tips para mantener tu dispositivo cargado y conectado durante los eventos.',
        slug: 'mantenerse-conectado-eventos-wifi-carga-bateria'
      },
      en: {
        title: 'How to Stay Connected During Events: WiFi and Battery Charging',
        excerpt: 'Tips to keep your device charged and connected during events. Essential tech tips for nightlife events in Mexico\'s party destinations.',
        slug: 'stay-connected-during-events-wifi-battery-charging'
      },
      fr: {
        title: 'Comment rester connecté pendant les événements : WiFi et charge de batterie',
        excerpt: 'Conseils pour garder votre appareil chargé et connecté pendant les événements. Conseils technologiques essentiels pour événements nocturnes dans les destinations de fête du Mexique.',
        slug: 'rester-connecte-pendant-evenements-wifi-charge-batterie'
      },
      pt: {
        title: 'Como se manter conectado durante eventos: WiFi e carregamento de bateria',
        excerpt: 'Dicas para manter seu dispositivo carregado e conectado durante eventos. Dicas tecnológicas essenciais para eventos noturnos nos destinos de festa do México.',
        slug: 'manter-conectado-durante-eventos-wifi-carregamento-bateria'
      }
    }
  },
  {
    id: '94',
    category: CATEGORY_IDS.GENERAL,
    date: '2025-05-01',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Entrevista con el equipo de sonido de MandalaTickets',
        excerpt: 'Conoce cómo se crea la experiencia de audio perfecta en cada evento.',
        slug: 'entrevista-equipo-sonido-mandalatickets'
      },
      en: {
        title: 'Interview with MandalaTickets Sound Team',
        excerpt: 'Learn how the perfect audio experience is created at each event. Discover sound engineering and audio production at exclusive events in Mexico.',
        slug: 'interview-mandalatickets-sound-team'
      },
      fr: {
        title: 'Entretien avec l\'équipe son de MandalaTickets',
        excerpt: 'Découvrez comment l\'expérience audio parfaite est créée lors de chaque événement. Découvrez l\'ingénierie sonore et la production audio lors d\'événements exclusifs au Mexique.',
        slug: 'entretien-equipe-son-mandalatickets'
      },
      pt: {
        title: 'Entrevista com a equipe de som da MandalaTickets',
        excerpt: 'Saiba como a experiência de áudio perfeita é criada em cada evento. Descubra engenharia de som e produção de áudio em eventos exclusivos no México.',
        slug: 'entrevista-equipe-som-mandalatickets'
      }
    }
  },
  {
    id: '95',
    category: CATEGORY_IDS.GENERAL,
    date: '2025-05-05',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Los mejores eventos para celebrar el Día de las Madres',
        excerpt: 'Eventos especiales para celebrar a las mamás en los destinos de MandalaTickets.',
        slug: 'mejores-eventos-dia-madres'
      },
      en: {
        title: 'Best Events to Celebrate Mother\'s Day',
        excerpt: 'Special events to celebrate moms in MandalaTickets destinations. Discover Mother\'s Day celebrations and special events across Mexico.',
        slug: 'best-events-celebrate-mothers-day'
      },
      fr: {
        title: 'Meilleurs événements pour célébrer la Fête des Mères',
        excerpt: 'Événements spéciaux pour célébrer les mamans dans les destinations MandalaTickets. Découvrez les célébrations de la Fête des Mères et événements spéciaux à travers le Mexique.',
        slug: 'meilleurs-evenements-celebrer-fete-meres'
      },
      pt: {
        title: 'Melhores eventos para celebrar o Dia das Mães',
        excerpt: 'Eventos especiais para celebrar as mães nos destinos MandalaTickets. Descubra celebrações do Dia das Mães e eventos especiais em todo o México.',
        slug: 'melhores-eventos-celebrar-dia-maes'
      }
    }
  },
  {
    id: '96',
    category: CATEGORY_IDS.GENERAL,
    date: '2025-05-10',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Tendencias en eventos híbridos: presenciales y virtuales',
        excerpt: 'Cómo los eventos están combinando experiencias presenciales y virtuales.',
        slug: 'tendencias-eventos-hibridos-presenciales-virtuales'
      },
      en: {
        title: 'Trends in Hybrid Events: In-Person and Virtual',
        excerpt: 'How events are combining in-person and virtual experiences. Discover hybrid event technologies at exclusive venues in Mexico.',
        slug: 'trends-hybrid-events-in-person-virtual'
      },
      fr: {
        title: 'Tendances des événements hybrides : en personne et virtuels',
        excerpt: 'Comment les événements combinent des expériences en personne et virtuelles. Découvrez les technologies d\'événements hybrides dans des lieux exclusifs au Mexique.',
        slug: 'tendances-evenements-hybrides-personne-virtuels'
      },
      pt: {
        title: 'Tendências em eventos híbridos: presenciais e virtuais',
        excerpt: 'Como os eventos estão combinando experiências presenciais e virtuais. Descubra tecnologias de eventos híbridos em locais exclusivos no México.',
        slug: 'tendencias-eventos-hibridos-presenciais-virtuais'
      }
    }
  },
  {
    id: '97',
    category: CATEGORY_IDS.PLAYA_DEL_CARMEN,
    date: '2025-05-15',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Guía completa de Playa del Carmen: eventos y atracciones',
        excerpt: 'Todo lo que necesitas saber sobre Playa del Carmen, desde eventos hasta atracciones turísticas.',
        slug: 'guia-completa-playa-carmen-eventos-atracciones'
      },
      en: {
        title: 'Complete Guide to Playa del Carmen: Events and Attractions',
        excerpt: 'Everything you need to know about Playa del Carmen, from events to tourist attractions. Your ultimate guide to Playa del Carmen, Mexico\'s Riviera Maya destination.',
        slug: 'complete-guide-playa-del-carmen-events-attractions'
      },
      fr: {
        title: 'Guide complet de Playa del Carmen : événements et attractions',
        excerpt: 'Tout ce que vous devez savoir sur Playa del Carmen, des événements aux attractions touristiques. Votre guide ultime de Playa del Carmen, destination Riviera Maya du Mexique.',
        slug: 'guide-complet-playa-del-carmen-evenements-attractions'
      },
      pt: {
        title: 'Guia completo de Playa del Carmen: eventos e atrações',
        excerpt: 'Tudo o que você precisa saber sobre Playa del Carmen, de eventos a atrações turísticas. Seu guia definitivo para Playa del Carmen, destino da Riviera Maya no México.',
        slug: 'guia-completo-playa-del-carmen-eventos-atracoes'
      }
    }
  },
  {
    id: '98',
    category: CATEGORY_IDS.GENERAL,
    date: '2025-05-20',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Cómo crear recuerdos duraderos de tus eventos favoritos',
        excerpt: 'Ideas creativas para preservar y recordar tus mejores momentos en los eventos.',
        slug: 'crear-recuerdos-duraderos-eventos-favoritos'
      },
      en: {
        title: 'How to Create Lasting Memories from Your Favorite Events',
        excerpt: 'Creative ideas to preserve and remember your best moments at events. Essential tips for capturing unforgettable memories at nightlife events in Mexico.',
        slug: 'create-lasting-memories-favorite-events'
      },
      fr: {
        title: 'Comment créer des souvenirs durables de vos événements favoris',
        excerpt: 'Idées créatives pour préserver et se souvenir de vos meilleurs moments lors d\'événements. Conseils essentiels pour capturer des souvenirs inoubliables lors d\'événements nocturnes au Mexique.',
        slug: 'creer-souvenirs-durables-evenements-favoris'
      },
      pt: {
        title: 'Como criar lembranças duradouras dos seus eventos favoritos',
        excerpt: 'Ideias criativas para preservar e lembrar de seus melhores momentos em eventos. Dicas essenciais para capturar memórias inesquecíveis em eventos noturnos no México.',
        slug: 'criar-lembrancas-duradouras-eventos-favoritos'
      }
    }
  },
  {
    id: '99',
    category: CATEGORY_IDS.GENERAL,
    date: '2025-05-25',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'Los mejores eventos para celebrar el Día del Padre',
        excerpt: 'Eventos especiales para celebrar a los papás en los destinos de MandalaTickets.',
        slug: 'mejores-eventos-dia-padre'
      },
      en: {
        title: 'Best Events to Celebrate Father\'s Day',
        excerpt: 'Special events to celebrate dads in MandalaTickets destinations. Discover Father\'s Day celebrations and special events across Mexico.',
        slug: 'best-events-celebrate-fathers-day'
      },
      fr: {
        title: 'Meilleurs événements pour célébrer la Fête des Pères',
        excerpt: 'Événements spéciaux pour célébrer les papas dans les destinations MandalaTickets. Découvrez les célébrations de la Fête des Pères et événements spéciaux à travers le Mexique.',
        slug: 'meilleurs-evenements-celebrer-fete-peres'
      },
      pt: {
        title: 'Melhores eventos para celebrar o Dia dos Pais',
        excerpt: 'Eventos especiais para celebrar os pais nos destinos MandalaTickets. Descubra celebrações do Dia dos Pais e eventos especiais em todo o México.',
        slug: 'melhores-eventos-celebrar-dia-pais'
      }
    }
  },
  {
    id: '100',
    category: CATEGORY_IDS.GENERAL,
    date: '2025-06-01',
    author: 'Equipo MandalaTickets',
    featured: false,
    content: {
      es: {
        title: 'El futuro de los eventos nocturnos: predicciones para 2026',
        excerpt: 'Una mirada hacia el futuro de la industria de eventos nocturnos y las tendencias que veremos.',
        slug: 'futuro-eventos-nocturnos-predicciones-2026'
      },
      en: {
        title: 'The Future of Nightlife Events: Predictions for 2026',
        excerpt: 'A look into the future of the nightlife event industry and trends we\'ll see. Discover what\'s next for exclusive events in Mexico\'s top destinations.',
        slug: 'future-nightlife-events-predictions-2026'
      },
      fr: {
        title: 'L\'avenir des événements nocturnes : prédictions pour 2026',
        excerpt: 'Un regard sur l\'avenir de l\'industrie des événements nocturnes et les tendances que nous verrons. Découvrez ce qui attend les événements exclusifs dans les meilleures destinations du Mexique.',
        slug: 'avenir-evenements-nocturnes-predictions-2026'
      },
      pt: {
        title: 'O futuro dos eventos noturnos: previsões para 2026',
        excerpt: 'Uma olhada para o futuro da indústria de eventos noturnos e as tendências que veremos. Descubra o que está por vir para eventos exclusivos nos principais destinos do México.',
        slug: 'futuro-eventos-noturnos-previsoes-2026'
      }
    }
  }
];
