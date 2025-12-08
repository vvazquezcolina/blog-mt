// Traducciones SEO/GEO optimizadas para todos los posts del blog
// Este archivo contiene las traducciones de títulos y excerpts para los 100 posts
// en los 4 idiomas: español, inglés, francés y portugués

import { CategoryId } from './blogPosts';

export interface PostTranslation {
  title: string;
  excerpt: string;
  slug: string; // Slug SEO optimizado por idioma
}

export type PostTranslations = {
  es: PostTranslation;
  en: PostTranslation;
  fr: PostTranslation;
  pt: PostTranslation;
};

// Mapeo de traducciones para cada post (key = post id)
export const postTranslations: Record<string, PostTranslations> = {
  // Post 1: Los 10 eventos imperdibles en Cancún este verano
  '1': {
    es: {
      title: 'Los 10 eventos imperdibles en Cancún este verano',
      excerpt: 'Descubre los eventos más emocionantes que Cancún tiene preparados para esta temporada de verano. Desde fiestas en la playa hasta festivales de música electrónica.',
      slug: '10-eventos-imperdibles-cancun-verano'
    },
    en: {
      title: 'The 10 Unmissable Events in Cancun This Summer',
      excerpt: 'Discover the most exciting events that Cancun has prepared for this summer season. From beach parties to electronic music festivals.',
      slug: '10-unmissable-events-cancun-summer'
    },
    fr: {
      title: 'Les 10 événements incontournables à Cancún cet été',
      excerpt: 'Découvrez les événements les plus excitants que Cancún a préparés pour cette saison estivale. Des fêtes sur la plage aux festivals de musique électronique.',
      slug: '10-evenements-incontournables-cancun-ete'
    },
    pt: {
      title: 'Os 10 Eventos Imperdíveis em Cancún neste Verão',
      excerpt: 'Descubra os eventos mais emocionantes que Cancún preparou para esta temporada de verão. De festas na praia a festivais de música eletrônica.',
      slug: '10-eventos-imperdiveis-cancun-verao'
    }
  },
  // Post 2: Guía completa para disfrutar de Tulum: playas, fiestas y más
  '2': {
    es: {
      title: 'Guía completa para disfrutar de Tulum: playas, fiestas y más',
      excerpt: 'Todo lo que necesitas saber para aprovechar al máximo tu visita a Tulum. Incluye los mejores beach clubs, restaurantes y eventos nocturnos.',
      slug: 'guia-completa-disfrutar-tulum-playas-fiestas'
    },
    en: {
      title: 'Complete Guide to Enjoy Tulum: Beaches, Parties and More',
      excerpt: 'Everything you need to know to make the most of your visit to Tulum. Includes the best beach clubs, restaurants and nightlife events.',
      slug: 'complete-guide-enjoy-tulum-beaches-parties-more'
    },
    fr: {
      title: 'Guide complet pour profiter de Tulum : plages, fêtes et plus',
      excerpt: 'Tout ce que vous devez savoir pour profiter au maximum de votre visite à Tulum. Inclut les meilleurs beach clubs, restaurants et événements nocturnes.',
      slug: 'guide-complet-profiter-tulum-plages-fetes-plus'
    },
    pt: {
      title: 'Guia Completo para Aproveitar Tulum: Praias, Festas e Mais',
      excerpt: 'Tudo o que você precisa saber para aproveitar ao máximo sua visita a Tulum. Inclui os melhores beach clubs, restaurantes e eventos noturnos.',
      slug: 'guia-completo-aproveitar-tulum-praias-festas-mais'
    }
  },
  // Post 3: Entrevista exclusiva con el DJ residente de Mandala Beach
  '3': {
    es: {
      title: 'Entrevista exclusiva con el DJ residente de Mandala Beach',
      excerpt: 'Conoce la historia detrás de uno de los DJs más reconocidos de la Riviera Maya y sus planes para los próximos eventos.',
      slug: 'entrevista-dj-residente-mandala-beach'
    },
    en: {
      title: 'Exclusive Interview with Mandala Beach Resident DJ',
      excerpt: 'Learn the story behind one of the most recognized DJs in the Riviera Maya and their plans for upcoming events.',
      slug: 'exclusive-interview-mandala-beach-resident-dj'
    },
    fr: {
      title: 'Interview exclusive avec le DJ résident de Mandala Beach',
      excerpt: 'Découvrez l\'histoire derrière l\'un des DJ les plus reconnus de la Riviera Maya et leurs projets pour les prochains événements.',
      slug: 'interview-exclusive-dj-resident-mandala-beach'
    },
    pt: {
      title: 'Entrevista Exclusiva com o DJ Residente do Mandala Beach',
      excerpt: 'Conheça a história por trás de um dos DJs mais reconhecidos da Riviera Maya e seus planos para os próximos eventos.',
      slug: 'entrevista-exclusiva-dj-residente-mandala-beach'
    }
  },
  // Post 4: Cómo aprovechar al máximo las promociones de MandalaTickets
  '4': {
    es: {
      title: 'Cómo aprovechar al máximo las promociones de MandalaTickets',
      excerpt: 'Tips y estrategias para obtener los mejores descuentos y ofertas especiales en tus compras de boletos.',
      slug: 'aprovechar-promociones-mandalatickets'
    },
    en: {
      title: 'How to Make the Most of MandalaTickets Promotions',
      excerpt: 'Tips and strategies to get the best discounts and special offers on your ticket purchases.',
      slug: 'make-most-mandalatickets-promotions'
    },
    fr: {
      title: 'Comment profiter au maximum des promotions MandalaTickets',
      excerpt: 'Conseils et stratégies pour obtenir les meilleures remises et offres spéciales sur vos achats de billets.',
      slug: 'profiter-maximum-promotions-mandalatickets'
    },
    pt: {
      title: 'Como Aproveitar ao Máximo as Promoções da MandalaTickets',
      excerpt: 'Dicas e estratégias para obter os melhores descontos e ofertas especiais em suas compras de ingressos.',
      slug: 'aproveitar-maximo-promocoes-mandalatickets'
    }
  },
  // Post 5: Historia y evolución de la vida nocturna en Playa del Carmen
  '5': {
    es: {
      title: 'Historia y evolución de la vida nocturna en Playa del Carmen',
      excerpt: 'Un recorrido por la transformación de la escena nocturna en Playa del Carmen y cómo se ha convertido en uno de los destinos más vibrantes.',
      slug: 'historia-evolucion-vida-nocturna-playa-carmen'
    },
    en: {
      title: 'History and Evolution of Nightlife in Playa del Carmen',
      excerpt: 'A journey through the transformation of the nightlife scene in Playa del Carmen and how it has become one of the most vibrant destinations.',
      slug: 'history-evolution-nightlife-playa-del-carmen'
    },
    fr: {
      title: 'Histoire et évolution de la vie nocturne à Playa del Carmen',
      excerpt: 'Un voyage à travers la transformation de la scène nocturne à Playa del Carmen et comment elle est devenue l\'une des destinations les plus vibrantes.',
      slug: 'histoire-evolution-vie-nocturne-playa-del-carmen'
    },
    pt: {
      title: 'História e Evolução da Vida Noturna em Playa del Carmen',
      excerpt: 'Uma jornada pela transformação da cena noturna em Playa del Carmen e como ela se tornou um dos destinos mais vibrantes.',
      slug: 'historia-evolucao-vida-noturna-playa-del-carmen'
    }
  },
  // Post 6: Consejos para organizar una despedida de soltero/a en Los Cabos
  '6': {
    es: {
      title: 'Consejos para organizar una despedida de soltero/a en Los Cabos',
      excerpt: 'Guía completa para planificar la despedida de soltero perfecta en Los Cabos, incluyendo eventos y actividades recomendadas.',
      slug: 'consejos-organizar-despedida-soltero-los-cabos'
    },
    en: {
      title: 'Tips for Organizing a Bachelor/Bachelorette Party in Los Cabos',
      excerpt: 'Complete guide to planning the perfect bachelor or bachelorette party in Los Cabos, including recommended events and activities.',
      slug: 'tips-organizing-bachelor-party-los-cabos'
    },
    fr: {
      title: 'Conseils pour organiser un enterrement de vie de garçon/fille à Los Cabos',
      excerpt: 'Guide complet pour planifier l\'enterrement de vie de garçon ou de fille parfait à Los Cabos, incluant les événements et activités recommandés.',
      slug: 'conseils-organiser-enterrement-vie-garcon-fille-los-cabos'
    },
    pt: {
      title: 'Dicas para Organizar uma Despedida de Solteiro em Los Cabos',
      excerpt: 'Guia completo para planejar a despedida de solteiro perfeita em Los Cabos, incluindo eventos e atividades recomendadas.',
      slug: 'dicas-organizar-despedida-solteiro-los-cabos'
    }
  },
  // Post 7: Los mejores beach clubs en Puerto Vallarta para este año
  '7': {
    es: {
      title: 'Los mejores beach clubs en Puerto Vallarta para este año',
      excerpt: 'Una selección de los beach clubs más exclusivos y vibrantes de Puerto Vallarta donde podrás disfrutar de música, comida y ambiente único.',
      slug: 'mejores-beach-clubs-puerto-vallarta'
    },
    en: {
      title: 'The Best Beach Clubs in Puerto Vallarta This Year',
      excerpt: 'A selection of the most exclusive and vibrant beach clubs in Puerto Vallarta where you can enjoy music, food and a unique atmosphere.',
      slug: 'best-beach-clubs-puerto-vallarta-year'
    },
    fr: {
      title: 'Les meilleurs beach clubs à Puerto Vallarta cette année',
      excerpt: 'Une sélection des beach clubs les plus exclusifs et vibrants de Puerto Vallarta où vous pourrez profiter de musique, nourriture et une atmosphère unique.',
      slug: 'meilleurs-beach-clubs-puerto-vallarta-annee'
    },
    pt: {
      title: 'Os Melhores Beach Clubs em Puerto Vallarta Este Ano',
      excerpt: 'Uma seleção dos beach clubs mais exclusivos e vibrantes de Puerto Vallarta onde você pode desfrutar de música, comida e ambiente único.',
      slug: 'melhores-beach-clubs-puerto-vallarta-ano'
    }
  },
  // Post 8: Tendencias en música electrónica para 2025
  '8': {
    es: {
      title: 'Tendencias en música electrónica para 2025',
      excerpt: 'Las tendencias musicales que marcarán el ritmo de los eventos en 2025 y los artistas que debes conocer.',
      slug: 'tendencias-musica-electronica-2025'
    },
    en: {
      title: 'Electronic Music Trends for 2025',
      excerpt: 'The musical trends that will set the pace for events in 2025 and the artists you should know.',
      slug: 'electronic-music-trends-2025'
    },
    fr: {
      title: 'Tendances de la musique électronique pour 2025',
      excerpt: 'Les tendances musicales qui marqueront le rythme des événements en 2025 et les artistes que vous devriez connaître.',
      slug: 'tendances-musique-electronique-2025'
    },
    pt: {
      title: 'Tendências em Música Eletrônica para 2025',
      excerpt: 'As tendências musicais que definirão o ritmo dos eventos em 2025 e os artistas que você deve conhecer.',
      slug: 'tendencias-musica-eletronica-2025'
    }
  },
  // Post 9: Cómo planificar tu itinerario de fiestas en Cancún
  '9': {
    es: {
      title: 'Cómo planificar tu itinerario de fiestas en Cancún',
      excerpt: 'Estrategias para organizar tu agenda de eventos y aprovechar al máximo tu tiempo en Cancún.',
      slug: 'planificar-itinerario-fiestas-cancun'
    },
    en: {
      title: 'How to Plan Your Party Itinerary in Cancun',
      excerpt: 'Strategies to organize your event schedule and make the most of your time in Cancun.',
      slug: 'plan-party-itinerary-cancun'
    },
    fr: {
      title: 'Comment planifier votre itinéraire de fêtes à Cancún',
      excerpt: 'Stratégies pour organiser votre calendrier d\'événements et profiter au maximum de votre temps à Cancún.',
      slug: 'planifier-itineraire-fetes-cancun'
    },
    pt: {
      title: 'Como Planejar seu Itinerário de Festas em Cancún',
      excerpt: 'Estratégias para organizar sua agenda de eventos e aproveitar ao máximo seu tempo em Cancún.',
      slug: 'planejar-itinerario-festas-cancun'
    }
  },
  // Post 10: Entrevista con el organizador del festival anual en Tulum
  '10': {
    es: {
      title: 'Entrevista con el organizador del festival anual en Tulum',
      excerpt: 'Descubre los secretos detrás de la organización de uno de los festivales más esperados del año en Tulum.',
      slug: 'entrevista-organizador-festival-anual-tulum'
    },
    en: {
      title: 'Interview with the Organizer of the Annual Festival in Tulum',
      excerpt: 'Discover the secrets behind organizing one of the most anticipated festivals of the year in Tulum.',
      slug: 'interview-organizer-annual-festival-tulum'
    },
    fr: {
      title: 'Interview avec l\'organisateur du festival annuel à Tulum',
      excerpt: 'Découvrez les secrets derrière l\'organisation de l\'un des festivals les plus attendus de l\'année à Tulum.',
      slug: 'interview-organisateur-festival-annuel-tulum'
    },
    pt: {
      title: 'Entrevista com o Organizador do Festival Anual em Tulum',
      excerpt: 'Descubra os segredos por trás da organização de um dos festivais mais esperados do ano em Tulum.',
      slug: 'entrevista-organizador-festival-anual-tulum'
    }
  },
  // Post 11: Los secretos mejor guardados de la vida nocturna en Los Cabos
  '11': {
    es: {
      title: 'Los secretos mejor guardados de la vida nocturna en Los Cabos',
      excerpt: 'Lugares y eventos exclusivos que solo los locales conocen en Los Cabos.',
      slug: 'secretos-vida-nocturna-los-cabos'
    },
    en: {
      title: 'The Best Kept Secrets of Nightlife in Los Cabos',
      excerpt: 'Exclusive places and events that only locals know about in Los Cabos.',
      slug: 'best-kept-secrets-nightlife-los-cabos'
    },
    fr: {
      title: 'Les secrets les mieux gardés de la vie nocturne à Los Cabos',
      excerpt: 'Des lieux et événements exclusifs que seuls les locaux connaissent à Los Cabos.',
      slug: 'secrets-mieux-gardes-vie-nocturne-los-cabos'
    },
    pt: {
      title: 'Os Segredos Mais Bem Guardados da Vida Noturna em Los Cabos',
      excerpt: 'Lugares e eventos exclusivos que apenas os locais conhecem em Los Cabos.',
      slug: 'segredos-melhor-guardados-vida-noturna-los-cabos'
    }
  },
  // Post 12: Guía para principiantes: cómo comprar boletos en MandalaTickets
  '12': {
    es: {
      title: 'Guía para principiantes: cómo comprar boletos en MandalaTickets',
      excerpt: 'Todo lo que necesitas saber para realizar tu primera compra de boletos de forma fácil y segura.',
      slug: 'guia-principiantes-comprar-boletos-mandalatickets'
    },
    en: {
      title: 'Beginner\'s Guide: How to Buy Tickets on MandalaTickets',
      excerpt: 'Everything you need to know to make your first ticket purchase easily and safely.',
      slug: 'beginners-guide-buy-tickets-mandalatickets'
    },
    fr: {
      title: 'Guide pour débutants : comment acheter des billets sur MandalaTickets',
      excerpt: 'Tout ce que vous devez savoir pour effectuer votre premier achat de billets facilement et en toute sécurité.',
      slug: 'guide-debutants-acheter-billets-mandalatickets'
    },
    pt: {
      title: 'Guia para Iniciantes: Como Comprar Ingressos na MandalaTickets',
      excerpt: 'Tudo o que você precisa saber para fazer sua primeira compra de ingressos de forma fácil e segura.',
      slug: 'guia-iniciantes-comprar-ingressos-mandalatickets'
    }
  },
  // Post 13: Los 5 eventos más exclusivos en Playa del Carmen este mes
  '13': {
    es: {
      title: 'Los 5 eventos más exclusivos en Playa del Carmen este mes',
      excerpt: 'Una selección de los eventos VIP y más exclusivos que no te puedes perder este mes en Playa del Carmen.',
      slug: '5-eventos-exclusivos-playa-carmen'
    },
    en: {
      title: 'The 5 Most Exclusive Events in Playa del Carmen This Month',
      excerpt: 'A selection of the most exclusive VIP events you can\'t miss this month in Playa del Carmen.',
      slug: '5-most-exclusive-events-playa-del-carmen-month'
    },
    fr: {
      title: 'Les 5 événements les plus exclusifs à Playa del Carmen ce mois-ci',
      excerpt: 'Une sélection des événements VIP les plus exclusifs que vous ne pouvez pas manquer ce mois-ci à Playa del Carmen.',
      slug: '5-evenements-plus-exclusifs-playa-del-carmen-mois'
    },
    pt: {
      title: 'Os 5 Eventos Mais Exclusivos em Playa del Carmen Este Mês',
      excerpt: 'Uma seleção dos eventos VIP mais exclusivos que você não pode perder este mês em Playa del Carmen.',
      slug: '5-eventos-mais-exclusivos-playa-del-carmen-mes'
    }
  },
  // Post 14: Cómo vestirse para una noche de fiesta en Tulum
  '14': {
    es: {
      title: 'Cómo vestirse para una noche de fiesta en Tulum',
      excerpt: 'Guía de estilo para lucir perfecto en los eventos de Tulum, desde looks casuales hasta outfits más formales.',
      slug: 'vestirse-noche-fiesta-tulum'
    },
    en: {
      title: 'How to Dress for a Party Night in Tulum',
      excerpt: 'Style guide to look perfect at Tulum events, from casual looks to more formal outfits.',
      slug: 'how-dress-party-night-tulum'
    },
    fr: {
      title: 'Comment s\'habiller pour une nuit de fête à Tulum',
      excerpt: 'Guide de style pour paraître parfait aux événements de Tulum, des looks décontractés aux tenues plus formelles.',
      slug: 'comment-habiller-nuit-fete-tulum'
    },
    pt: {
      title: 'Como Se Vestir para uma Noite de Festa em Tulum',
      excerpt: 'Guia de estilo para ficar perfeito nos eventos de Tulum, desde looks casuais até outfits mais formais.',
      slug: 'como-vestir-noite-festa-tulum'
    }
  },
  // Post 15: Entrevista con el chef detrás de la gastronomía en Mandala Beach
  '15': {
    es: {
      title: 'Entrevista con el chef detrás de la gastronomía en Mandala Beach',
      excerpt: 'Conoce la visión culinaria y los platillos exclusivos que encontrarás en los eventos de Mandala Beach.',
      slug: 'entrevista-chef-gastronomia-mandala-beach'
    },
    en: {
      title: 'Interview with the Chef Behind the Gastronomy at Mandala Beach',
      excerpt: 'Learn about the culinary vision and exclusive dishes you\'ll find at Mandala Beach events.',
      slug: 'interview-chef-gastronomy-mandala-beach'
    },
    fr: {
      title: 'Interview avec le chef derrière la gastronomie à Mandala Beach',
      excerpt: 'Découvrez la vision culinaire et les plats exclusifs que vous trouverez aux événements de Mandala Beach.',
      slug: 'interview-chef-gastronomie-mandala-beach'
    },
    pt: {
      title: 'Entrevista com o Chef por Trás da Gastronomia do Mandala Beach',
      excerpt: 'Conheça a visão culinária e os pratos exclusivos que você encontrará nos eventos do Mandala Beach.',
      slug: 'entrevista-chef-gastronomia-mandala-beach'
    }
  },
  // Post 16: Los beneficios de reservar tus boletos con anticipación
  '16': {
    es: {
      title: 'Los beneficios de reservar tus boletos con anticipación',
      excerpt: 'Por qué es mejor comprar tus boletos con tiempo y cómo puedes ahorrar dinero haciéndolo.',
      slug: 'beneficios-reservar-boletos-anticipacion'
    },
    en: {
      title: 'Benefits of Booking Your Tickets in Advance',
      excerpt: 'Why it\'s better to buy your tickets early and how you can save money by doing so.',
      slug: 'benefits-booking-tickets-advance'
    },
    fr: {
      title: 'Les avantages de réserver vos billets à l\'avance',
      excerpt: 'Pourquoi il vaut mieux acheter vos billets tôt et comment vous pouvez économiser de l\'argent en le faisant.',
      slug: 'avantages-reserver-billets-avance'
    },
    pt: {
      title: 'Benefícios de Reservar seus Ingressos com Antecedência',
      excerpt: 'Por que é melhor comprar seus ingressos com antecedência e como você pode economizar dinheiro fazendo isso.',
      slug: 'beneficios-reservar-ingressos-antecedencia'
    }
  },
  // Post 17: Historia de los clubes nocturnos más icónicos de Cancún
  '17': {
    es: {
      title: 'Historia de los clubes nocturnos más icónicos de Cancún',
      excerpt: 'Un recorrido histórico por los clubes que han marcado la escena nocturna de Cancún a lo largo de los años.',
      slug: 'historia-clubes-nocturnos-iconicos-cancun'
    },
    en: {
      title: 'History of the Most Iconic Nightclubs in Cancun',
      excerpt: 'A historical journey through the clubs that have marked Cancun\'s nightlife scene over the years.',
      slug: 'history-most-iconic-nightclubs-cancun'
    },
    fr: {
      title: 'Histoire des boîtes de nuit les plus emblématiques de Cancún',
      excerpt: 'Un voyage historique à travers les clubs qui ont marqué la scène nocturne de Cancún au fil des ans.',
      slug: 'histoire-boites-nuit-embblematiques-cancun'
    },
    pt: {
      title: 'História dos Clubes Noturnos Mais Icônicos de Cancún',
      excerpt: 'Uma jornada histórica pelos clubes que marcaram a cena noturna de Cancún ao longo dos anos.',
      slug: 'historia-clubes-noturnos-iconicos-cancun'
    }
  },
  // Post 18: Cómo disfrutar de una fiesta segura y responsable en Los Cabos
  '18': {
    es: {
      title: 'Cómo disfrutar de una fiesta segura y responsable en Los Cabos',
      excerpt: 'Consejos importantes para mantenerte seguro mientras disfrutas de los eventos en Los Cabos.',
      slug: 'disfrutar-fiesta-segura-responsable-los-cabos'
    },
    en: {
      title: 'How to Enjoy a Safe and Responsible Party in Los Cabos',
      excerpt: 'Important tips to stay safe while enjoying events in Los Cabos.',
      slug: 'enjoy-safe-responsible-party-los-cabos'
    },
    fr: {
      title: 'Comment profiter d\'une fête sûre et responsable à Los Cabos',
      excerpt: 'Conseils importants pour rester en sécurité tout en profitant des événements à Los Cabos.',
      slug: 'profiter-fete-sure-responsable-los-cabos'
    },
    pt: {
      title: 'Como Aproveitar uma Festa Segura e Responsável em Los Cabos',
      excerpt: 'Dicas importantes para se manter seguro enquanto aproveita os eventos em Los Cabos.',
      slug: 'aproveitar-festa-segura-responsavel-los-cabos'
    }
  },
  // Post 19: Los mejores cócteles para probar en los eventos de MandalaTickets
  '19': {
    es: {
      title: 'Los mejores cócteles para probar en los eventos de MandalaTickets',
      excerpt: 'Una selección de las bebidas más populares y deliciosas que encontrarás en nuestros eventos.',
      slug: 'mejores-cocteles-eventos-mandalatickets'
    },
    en: {
      title: 'The Best Cocktails to Try at MandalaTickets Events',
      excerpt: 'A selection of the most popular and delicious drinks you\'ll find at our events.',
      slug: 'best-cocktails-try-mandalatickets-events'
    },
    fr: {
      title: 'Les meilleurs cocktails à essayer aux événements MandalaTickets',
      excerpt: 'Une sélection des boissons les plus populaires et délicieuses que vous trouverez à nos événements.',
      slug: 'meilleurs-cocktails-essayer-evenements-mandalatickets'
    },
    pt: {
      title: 'Os Melhores Coquetéis para Experimentar nos Eventos da MandalaTickets',
      excerpt: 'Uma seleção das bebidas mais populares e deliciosas que você encontrará em nossos eventos.',
      slug: 'melhores-coqueteis-experimentar-eventos-mandalatickets'
    }
  },
  // Post 20: Guía de transporte: cómo moverse entre eventos en Playa del Carmen
  '20': {
    es: {
      title: 'Guía de transporte: cómo moverse entre eventos en Playa del Carmen',
      excerpt: 'Opciones de transporte y tips para moverte eficientemente entre diferentes eventos en Playa del Carmen.',
      slug: 'guia-transporte-moverse-eventos-playa-carmen'
    },
    en: {
      title: 'Transportation Guide: How to Get Around Between Events in Playa del Carmen',
      excerpt: 'Transportation options and tips to move efficiently between different events in Playa del Carmen.',
      slug: 'transportation-guide-get-around-events-playa-del-carmen'
    },
    fr: {
      title: 'Guide de transport : comment se déplacer entre les événements à Playa del Carmen',
      excerpt: 'Options de transport et conseils pour se déplacer efficacement entre différents événements à Playa del Carmen.',
      slug: 'guide-transport-deplacer-evenements-playa-del-carmen'
    },
    pt: {
      title: 'Guia de Transporte: Como Se Locomover Entre Eventos em Playa del Carmen',
      excerpt: 'Opções de transporte e dicas para se mover com eficiência entre diferentes eventos em Playa del Carmen.',
      slug: 'guia-transporte-locomover-eventos-playa-del-carmen'
    }
  },
  // Post 21: Entrevista con el diseñador de los escenarios en Tulum
  '21': {
    es: {
      title: 'Entrevista con el diseñador de los escenarios en Tulum',
      excerpt: 'Descubre el proceso creativo detrás de los impresionantes escenarios que hacen únicos los eventos en Tulum.',
      slug: 'entrevista-disenador-escenarios-tulum'
    },
    en: {
      title: 'Interview with the Stage Designer in Tulum',
      excerpt: 'Discover the creative process behind the impressive stages that make Tulum events unique.',
      slug: 'interview-stage-designer-tulum'
    },
    fr: {
      title: 'Interview avec le concepteur de scènes à Tulum',
      excerpt: 'Découvrez le processus créatif derrière les scènes impressionnantes qui rendent les événements de Tulum uniques.',
      slug: 'interview-concepteur-scenes-tulum'
    },
    pt: {
      title: 'Entrevista com o Designer de Palcos em Tulum',
      excerpt: 'Descubra o processo criativo por trás dos palcos impressionantes que tornam os eventos de Tulum únicos.',
      slug: 'entrevista-designer-palcos-tulum'
    }
  },
  // Post 22: Los 10 artistas emergentes que debes conocer este año
  '22': {
    es: {
      title: 'Los 10 artistas emergentes que debes conocer este año',
      excerpt: 'Una lista de los talentos nuevos que están revolucionando la escena musical y que verás en nuestros eventos.',
      slug: '10-artistas-emergentes-conocer-ano'
    },
    en: {
      title: 'The 10 Emerging Artists You Should Know This Year',
      excerpt: 'A list of new talents who are revolutionizing the music scene and who you\'ll see at our events.',
      slug: '10-emerging-artists-know-year'
    },
    fr: {
      title: 'Les 10 artistes émergents que vous devriez connaître cette année',
      excerpt: 'Une liste des nouveaux talents qui révolutionnent la scène musicale et que vous verrez à nos événements.',
      slug: '10-artistes-emergents-connaitre-annee'
    },
    pt: {
      title: 'Os 10 Artistas Emergentes que Você Deve Conhecer Este Ano',
      excerpt: 'Uma lista dos novos talentos que estão revolucionando a cena musical e que você verá em nossos eventos.',
      slug: '10-artistas-emergentes-conhecer-ano'
    }
  },
  // Post 23: Cómo organizar una fiesta privada en Mandala Beach
  '23': {
    es: {
      title: 'Cómo organizar una fiesta privada en Mandala Beach',
      excerpt: 'Guía paso a paso para planificar y ejecutar una celebración privada inolvidable en Mandala Beach.',
      slug: 'organizar-fiesta-privada-mandala-beach'
    },
    en: {
      title: 'How to Organize a Private Party at Mandala Beach',
      excerpt: 'Step-by-step guide to plan and execute an unforgettable private celebration at Mandala Beach.',
      slug: 'organize-private-party-mandala-beach'
    },
    fr: {
      title: 'Comment organiser une fête privée à Mandala Beach',
      excerpt: 'Guide étape par étape pour planifier et exécuter une célébration privée inoubliable à Mandala Beach.',
      slug: 'organiser-fete-privee-mandala-beach'
    },
    pt: {
      title: 'Como Organizar uma Festa Privada no Mandala Beach',
      excerpt: 'Guia passo a passo para planejar e executar uma celebração privada inesquecível no Mandala Beach.',
      slug: 'organizar-festa-privada-mandala-beach'
    }
  },
  // Post 24: Los mejores lugares para ver el atardecer antes de una fiesta en Puerto Vallarta
  '24': {
    es: {
      title: 'Los mejores lugares para ver el atardecer antes de una fiesta en Puerto Vallarta',
      excerpt: 'Spots perfectos para disfrutar de una puesta de sol espectacular antes de comenzar tu noche de fiesta.',
      slug: 'mejores-lugares-atardecer-fiesta-puerto-vallarta'
    },
    en: {
      title: 'The Best Places to Watch the Sunset Before a Party in Puerto Vallarta',
      excerpt: 'Perfect spots to enjoy a spectacular sunset before starting your party night.',
      slug: 'best-places-watch-sunset-party-puerto-vallarta'
    },
    fr: {
      title: 'Les meilleurs endroits pour regarder le coucher de soleil avant une fête à Puerto Vallarta',
      excerpt: 'Endroits parfaits pour profiter d\'un coucher de soleil spectaculaire avant de commencer votre nuit de fête.',
      slug: 'meilleurs-endroits-coucher-soleil-fete-puerto-vallarta'
    },
    pt: {
      title: 'Os Melhores Lugares para Ver o Pôr do Sol Antes de uma Festa em Puerto Vallarta',
      excerpt: 'Pontos perfeitos para desfrutar de um pôr do sol espetacular antes de começar sua noite de festa.',
      slug: 'melhores-lugares-por-sol-festa-puerto-vallarta'
    }
  },
  // Post 25: Tendencias en moda para la vida nocturna en 2025
  '25': {
    es: {
      title: 'Tendencias en moda para la vida nocturna en 2025',
      excerpt: 'Las tendencias de moda que dominarán las pistas de baile y eventos nocturnos este año.',
      slug: 'tendencias-moda-vida-nocturna-2025'
    },
    en: {
      title: 'Fashion Trends for Nightlife in 2025',
      excerpt: 'The fashion trends that will dominate dance floors and nightlife events this year.',
      slug: 'fashion-trends-nightlife-2025'
    },
    fr: {
      title: 'Tendances de la mode pour la vie nocturne en 2025',
      excerpt: 'Les tendances de la mode qui domineront les pistes de danse et les événements nocturnes cette année.',
      slug: 'tendances-mode-vie-nocturne-2025'
    },
    pt: {
      title: 'Tendências de Moda para a Vida Noturna em 2025',
      excerpt: 'As tendências de moda que dominarão as pistas de dança e eventos noturnos este ano.',
      slug: 'tendencias-moda-vida-noturna-2025'
    }
  },
  // Post 26: Cómo evitar las filas y entrar rápido a los eventos
  '26': {
    es: {
      title: 'Cómo evitar las filas y entrar rápido a los eventos',
      excerpt: 'Estrategias y tips para acceder rápidamente a los eventos sin perder tiempo en filas.',
      slug: 'evitar-filas-entrar-rapido-eventos'
    },
    en: {
      title: 'How to Avoid Lines and Get Into Events Quickly',
      excerpt: 'Strategies and tips to quickly access events without wasting time in lines.',
      slug: 'avoid-lines-get-into-events-quickly'
    },
    fr: {
      title: 'Comment éviter les files d\'attente et entrer rapidement aux événements',
      excerpt: 'Stratégies et conseils pour accéder rapidement aux événements sans perdre de temps dans les files d\'attente.',
      slug: 'eviter-files-attente-entrer-rapidement-evenements'
    },
    pt: {
      title: 'Como Evitar Filas e Entrar Rápido nos Eventos',
      excerpt: 'Estratégias e dicas para acessar rapidamente os eventos sem perder tempo em filas.',
      slug: 'evitar-filas-entrar-rapido-eventos'
    }
  },
  // Post 27: Entrevista con el fotógrafo oficial de MandalaTickets
  '27': {
    es: {
      title: 'Entrevista con el fotógrafo oficial de MandalaTickets',
      excerpt: 'Conoce al artista detrás de las increíbles fotografías que capturan la esencia de nuestros eventos.',
      slug: 'entrevista-fotografo-oficial-mandalatickets'
    },
    en: {
      title: 'Interview with MandalaTickets Official Photographer',
      excerpt: 'Meet the artist behind the incredible photographs that capture the essence of our events.',
      slug: 'interview-mandalatickets-official-photographer'
    },
    fr: {
      title: 'Interview avec le photographe officiel de MandalaTickets',
      excerpt: 'Rencontrez l\'artiste derrière les photographies incroyables qui capturent l\'essence de nos événements.',
      slug: 'interview-photographe-officiel-mandalatickets'
    },
    pt: {
      title: 'Entrevista com o Fotógrafo Oficial da MandalaTickets',
      excerpt: 'Conheça o artista por trás das fotografias incríveis que capturam a essência de nossos eventos.',
      slug: 'entrevista-fotografo-oficial-mandalatickets'
    }
  },
  // Post 28: Los 5 festivales de música más esperados en México este año
  '28': {
    es: {
      title: 'Los 5 festivales de música más esperados en México este año',
      excerpt: 'Una guía completa de los festivales musicales más importantes que se realizarán en México durante este año.',
      slug: '5-festivales-musica-esperados-mexico'
    },
    en: {
      title: 'The 5 Most Anticipated Music Festivals in Mexico This Year',
      excerpt: 'A complete guide to the most important music festivals that will take place in Mexico this year.',
      slug: '5-most-anticipated-music-festivals-mexico-year'
    },
    fr: {
      title: 'Les 5 festivals de musique les plus attendus au Mexique cette année',
      excerpt: 'Un guide complet des festivals de musique les plus importants qui se dérouleront au Mexique cette année.',
      slug: '5-festivals-musique-plus-attendus-mexique-annee'
    },
    pt: {
      title: 'Os 5 Festivais de Música Mais Esperados no México Este Ano',
      excerpt: 'Um guia completo dos festivais de música mais importantes que acontecerão no México este ano.',
      slug: '5-festivais-musica-mais-esperados-mexico-ano'
    }
  },
  // Post 29: Cómo mantenerte hidratado y energizado durante una noche de fiesta
  '29': {
    es: {
      title: 'Cómo mantenerte hidratado y energizado durante una noche de fiesta',
      excerpt: 'Consejos de salud para disfrutar toda la noche sin comprometer tu bienestar.',
      slug: 'mantenerse-hidratado-energizado-noche-fiesta'
    },
    en: {
      title: 'How to Stay Hydrated and Energized During a Party Night',
      excerpt: 'Health tips to enjoy the whole night without compromising your well-being.',
      slug: 'stay-hydrated-energized-party-night'
    },
    fr: {
      title: 'Comment rester hydraté et énergisé pendant une nuit de fête',
      excerpt: 'Conseils de santé pour profiter de toute la nuit sans compromettre votre bien-être.',
      slug: 'rester-hydrate-energise-nuit-fete'
    },
    pt: {
      title: 'Como Se Manter Hidratado e Energizado Durante uma Noite de Festa',
      excerpt: 'Dicas de saúde para aproveitar a noite toda sem comprometer seu bem-estar.',
      slug: 'manter-hidratado-energizado-noite-festa'
    }
  },
  // Post 30: Los mejores souvenirs para llevar de tu experiencia en Tulum
  '30': {
    es: {
      title: 'Los mejores souvenirs para llevar de tu experiencia en Tulum',
      excerpt: 'Ideas de recuerdos únicos que puedes llevar contigo para recordar tu increíble experiencia en Tulum.',
      slug: 'mejores-souvenirs-experiencia-tulum'
    },
    en: {
      title: 'The Best Souvenirs to Take Home from Your Tulum Experience',
      excerpt: 'Unique souvenir ideas you can take with you to remember your incredible experience in Tulum.',
      slug: 'best-souvenirs-take-home-tulum-experience'
    },
    fr: {
      title: 'Les meilleurs souvenirs à rapporter de votre expérience à Tulum',
      excerpt: 'Idées de souvenirs uniques que vous pouvez emporter pour vous souvenir de votre incroyable expérience à Tulum.',
      slug: 'meilleurs-souvenirs-rapporter-experience-tulum'
    },
    pt: {
      title: 'Os Melhores Souvenirs para Levar da sua Experiência em Tulum',
      excerpt: 'Ideias de lembranças únicas que você pode levar para lembrar sua experiência incrível em Tulum.',
      slug: 'melhores-souvenirs-levar-experiencia-tulum'
    }
  },
  // Post 31: Entrevista con el equipo de seguridad de MandalaTickets
  '31': {
    es: {
      title: 'Entrevista con el equipo de seguridad de MandalaTickets: cómo garantizan tu bienestar',
      excerpt: 'Conoce las medidas de seguridad implementadas para garantizar una experiencia segura en todos nuestros eventos.',
      slug: 'entrevista-equipo-seguridad-mandalatickets'
    },
    en: {
      title: 'Interview with MandalaTickets Security Team: How They Ensure Your Wellbeing',
      excerpt: 'Learn about the security measures implemented to guarantee a safe experience at all our events.',
      slug: 'interview-mandalatickets-security-team-wellbeing'
    },
    fr: {
      title: 'Interview avec l\'équipe de sécurité de MandalaTickets : comment ils garantissent votre bien-être',
      excerpt: 'Découvrez les mesures de sécurité mises en place pour garantir une expérience sûre à tous nos événements.',
      slug: 'interview-equipe-securite-mandalatickets-bien-etre'
    },
    pt: {
      title: 'Entrevista com a Equipe de Segurança da MandalaTickets: Como Garantem seu Bem-Estar',
      excerpt: 'Conheça as medidas de segurança implementadas para garantir uma experiência segura em todos os nossos eventos.',
      slug: 'entrevista-equipe-seguranca-mandalatickets-bem-estar'
    }
  },
  // Post 32: Los 10 mejores DJs que han pasado por los eventos de MandalaTickets
  '32': {
    es: {
      title: 'Los 10 mejores DJs que han pasado por los eventos de MandalaTickets',
      excerpt: 'Un recuento de los artistas más destacados que han animado nuestros eventos a lo largo del tiempo.',
      slug: '10-mejores-djs-eventos-mandalatickets'
    },
    en: {
      title: 'The 10 Best DJs Who Have Performed at MandalaTickets Events',
      excerpt: 'A recount of the most outstanding artists who have entertained at our events over time.',
      slug: '10-best-djs-performed-mandalatickets-events'
    },
    fr: {
      title: 'Les 10 meilleurs DJ qui ont joué aux événements MandalaTickets',
      excerpt: 'Un récit des artistes les plus remarquables qui ont animé nos événements au fil du temps.',
      slug: '10-meilleurs-djs-joue-evenements-mandalatickets'
    },
    pt: {
      title: 'Os 10 Melhores DJs que Passaram pelos Eventos da MandalaTickets',
      excerpt: 'Um relato dos artistas mais destacados que animaram nossos eventos ao longo do tempo.',
      slug: '10-melhores-djs-eventos-mandalatickets'
    }
  },
  // Post 33: Cómo celebrar tu cumpleaños en grande con MandalaTickets
  '33': {
    es: {
      title: 'Cómo celebrar tu cumpleaños en grande con MandalaTickets',
      excerpt: 'Ideas y opciones para hacer de tu cumpleaños una celebración inolvidable en uno de nuestros eventos.',
      slug: 'celebrar-cumpleanos-grande-mandalatickets'
    },
    en: {
      title: 'How to Celebrate Your Birthday in Style with MandalaTickets',
      excerpt: 'Ideas and options to make your birthday an unforgettable celebration at one of our events.',
      slug: 'celebrate-birthday-style-mandalatickets'
    },
    fr: {
      title: 'Comment célébrer votre anniversaire en grand avec MandalaTickets',
      excerpt: 'Idées et options pour faire de votre anniversaire une célébration inoubliable à l\'un de nos événements.',
      slug: 'celebrer-anniversaire-grand-mandalatickets'
    },
    pt: {
      title: 'Como Celebrar seu Aniversário em Grande com a MandalaTickets',
      excerpt: 'Ideias e opções para tornar seu aniversário uma celebração inesquecível em um de nossos eventos.',
      slug: 'celebrar-aniversario-grande-mandalatickets'
    }
  },
  // Post 34: Los mejores lugares para cenar antes de una fiesta en Cancún
  '34': {
    es: {
      title: 'Los mejores lugares para cenar antes de una fiesta en Cancún',
      excerpt: 'Restaurantes recomendados para disfrutar una cena deliciosa antes de comenzar tu noche de fiesta.',
      slug: 'mejores-lugares-cenar-fiesta-cancun'
    },
    en: {
      title: 'The Best Places to Dine Before a Party in Cancun',
      excerpt: 'Recommended restaurants to enjoy a delicious dinner before starting your party night.',
      slug: 'best-places-dine-party-cancun'
    },
    fr: {
      title: 'Les meilleurs endroits pour dîner avant une fête à Cancún',
      excerpt: 'Restaurants recommandés pour profiter d\'un délicieux dîner avant de commencer votre nuit de fête.',
      slug: 'meilleurs-endroits-diner-fete-cancun'
    },
    pt: {
      title: 'Os Melhores Lugares para Jantar Antes de uma Festa em Cancún',
      excerpt: 'Restaurantes recomendados para desfrutar de um jantar delicioso antes de começar sua noite de festa.',
      slug: 'melhores-lugares-jantar-festa-cancun'
    }
  },
  // Post 35: Tendencias en iluminación y efectos visuales para eventos en 2025
  '35': {
    es: {
      title: 'Tendencias en iluminación y efectos visuales para eventos en 2025',
      excerpt: 'Las innovaciones tecnológicas que están transformando la experiencia visual en los eventos nocturnos.',
      slug: 'tendencias-iluminacion-efectos-visuales-eventos-2025'
    },
    en: {
      title: 'Lighting and Visual Effects Trends for Events in 2025',
      excerpt: 'The technological innovations that are transforming the visual experience at nightlife events.',
      slug: 'lighting-visual-effects-trends-events-2025'
    },
    fr: {
      title: 'Tendances en éclairage et effets visuels pour les événements en 2025',
      excerpt: 'Les innovations technologiques qui transforment l\'expérience visuelle lors des événements nocturnes.',
      slug: 'tendances-eclairage-effets-visuels-evenements-2025'
    },
    pt: {
      title: 'Tendências em Iluminação e Efeitos Visuais para Eventos em 2025',
      excerpt: 'As inovações tecnológicas que estão transformando a experiência visual nos eventos noturnos.',
      slug: 'tendencias-iluminacao-efeitos-visuais-eventos-2025'
    }
  },
  // Post 36: Cómo aprovechar las redes sociales para compartir tu experiencia en los eventos
  '36': {
    es: {
      title: 'Cómo aprovechar las redes sociales para compartir tu experiencia en los eventos',
      excerpt: 'Tips para crear contenido atractivo y compartir tus mejores momentos de los eventos en redes sociales.',
      slug: 'aprovechar-redes-sociales-compartir-experiencia-eventos'
    },
    en: {
      title: 'How to Leverage Social Media to Share Your Event Experience',
      excerpt: 'Tips to create engaging content and share your best moments from events on social media.',
      slug: 'leverage-social-media-share-event-experience'
    },
    fr: {
      title: 'Comment tirer parti des réseaux sociaux pour partager votre expérience d\'événement',
      excerpt: 'Conseils pour créer du contenu attrayant et partager vos meilleurs moments d\'événements sur les réseaux sociaux.',
      slug: 'tirer-parti-reseaux-sociaux-partager-experience-evenement'
    },
    pt: {
      title: 'Como Aproveitar as Redes Sociais para Compartilhar sua Experiência nos Eventos',
      excerpt: 'Dicas para criar conteúdo atraente e compartilhar seus melhores momentos dos eventos nas redes sociais.',
      slug: 'aproveitar-redes-sociais-compartilhar-experiencia-eventos'
    }
  },
  // Post 37: Entrevista con el bartender estrella de Mandala Beach
  '37': {
    es: {
      title: 'Entrevista con el bartender estrella de Mandala Beach',
      excerpt: 'Conoce los secretos detrás de los cócteles más populares y la filosofía del mejor bartender de la Riviera Maya.',
      slug: 'entrevista-bartender-estrella-mandala-beach'
    },
    en: {
      title: 'Interview with Mandala Beach Star Bartender',
      excerpt: 'Learn the secrets behind the most popular cocktails and the philosophy of the best bartender in the Riviera Maya.',
      slug: 'interview-mandala-beach-star-bartender'
    },
    fr: {
      title: 'Interview avec le barman vedette de Mandala Beach',
      excerpt: 'Découvrez les secrets derrière les cocktails les plus populaires et la philosophie du meilleur barman de la Riviera Maya.',
      slug: 'interview-barman-vedette-mandala-beach'
    },
    pt: {
      title: 'Entrevista com o Barman Estrela do Mandala Beach',
      excerpt: 'Conheça os segredos por trás dos coquetéis mais populares e a filosofia do melhor barman da Riviera Maya.',
      slug: 'entrevista-barman-estrela-mandala-beach'
    }
  },
  // Post 38: Los 5 eventos temáticos más divertidos en Playa del Carmen
  '38': {
    es: {
      title: 'Los 5 eventos temáticos más divertidos en Playa del Carmen',
      excerpt: 'Una selección de los eventos con temáticas únicas que hacen de Playa del Carmen un destino especial.',
      slug: '5-eventos-tematicos-divertidos-playa-carmen'
    },
    en: {
      title: 'The 5 Most Fun Themed Events in Playa del Carmen',
      excerpt: 'A selection of events with unique themes that make Playa del Carmen a special destination.',
      slug: '5-most-fun-themed-events-playa-del-carmen'
    },
    fr: {
      title: 'Les 5 événements à thème les plus amusants à Playa del Carmen',
      excerpt: 'Une sélection d\'événements aux thèmes uniques qui font de Playa del Carmen une destination spéciale.',
      slug: '5-evenements-theme-plus-amusants-playa-del-carmen'
    },
    pt: {
      title: 'Os 5 Eventos Temáticos Mais Divertidos em Playa del Carmen',
      excerpt: 'Uma seleção de eventos com temas únicos que tornam Playa del Carmen um destino especial.',
      slug: '5-eventos-tematicos-mais-divertidos-playa-del-carmen'
    }
  },
  // Post 39: Cómo prepararte para una fiesta en la playa: consejos y trucos
  '39': {
    es: {
      title: 'Cómo prepararte para una fiesta en la playa: consejos y trucos',
      excerpt: 'Todo lo que necesitas saber para disfrutar al máximo de una fiesta en la playa sin contratiempos.',
      slug: 'prepararse-fiesta-playa-consejos-trucos'
    },
    en: {
      title: 'How to Prepare for a Beach Party: Tips and Tricks',
      excerpt: 'Everything you need to know to fully enjoy a beach party without setbacks.',
      slug: 'prepare-beach-party-tips-tricks'
    },
    fr: {
      title: 'Comment se préparer pour une fête sur la plage : conseils et astuces',
      excerpt: 'Tout ce que vous devez savoir pour profiter au maximum d\'une fête sur la plage sans revers.',
      slug: 'preparer-fete-plage-conseils-astuces'
    },
    pt: {
      title: 'Como Se Preparar para uma Festa na Praia: Dicas e Truques',
      excerpt: 'Tudo o que você precisa saber para aproveitar ao máximo uma festa na praia sem contratempos.',
      slug: 'preparar-festa-praia-dicas-truques'
    }
  },
  // Post 40: Los mejores after-parties en Tulum que no te puedes perder
  '40': {
    es: {
      title: 'Los mejores after-parties en Tulum que no te puedes perder',
      excerpt: 'Guía de los after-parties más exclusivos y vibrantes que continúan la fiesta después del evento principal.',
      slug: 'mejores-after-parties-tulum'
    },
    en: {
      title: 'The Best After-Parties in Tulum You Can\'t Miss',
      excerpt: 'Guide to the most exclusive and vibrant after-parties that continue the party after the main event.',
      slug: 'best-after-parties-tulum-cant-miss'
    },
    fr: {
      title: 'Les meilleurs after-parties à Tulum que vous ne pouvez pas manquer',
      excerpt: 'Guide des after-parties les plus exclusifs et vibrants qui continuent la fête après l\'événement principal.',
      slug: 'meilleurs-after-parties-tulum-ne-pas-manquer'
    },
    pt: {
      title: 'Os Melhores After-Parties em Tulum que Você Não Pode Perder',
      excerpt: 'Guia dos after-parties mais exclusivos e vibrantes que continuam a festa após o evento principal.',
      slug: 'melhores-after-parties-tulum-nao-perder'
    }
  },
  // Post 41: Entrevista con el equipo de producción detrás de los eventos de MandalaTickets
  '41': {
    es: {
      title: 'Entrevista con el equipo de producción detrás de los eventos de MandalaTickets',
      excerpt: 'Descubre cómo se crea la magia detrás de escena en cada uno de nuestros eventos.',
      slug: 'entrevista-equipo-produccion-eventos-mandalatickets'
    },
    en: {
      title: 'Interview with the Production Team Behind MandalaTickets Events',
      excerpt: 'Discover how the magic is created behind the scenes at each of our events.',
      slug: 'interview-production-team-mandalatickets-events'
    },
    fr: {
      title: 'Interview avec l\'équipe de production derrière les événements MandalaTickets',
      excerpt: 'Découvrez comment la magie est créée dans les coulisses de chacun de nos événements.',
      slug: 'interview-equipe-production-evenements-mandalatickets'
    },
    pt: {
      title: 'Entrevista com a Equipe de Produção por Trás dos Eventos da MandalaTickets',
      excerpt: 'Descubra como a mágica é criada nos bastidores de cada um de nossos eventos.',
      slug: 'entrevista-equipe-producao-eventos-mandalatickets'
    }
  },
  // Post 42: Los 10 momentos más memorables en la historia de MandalaTickets
  '42': {
    es: {
      title: 'Los 10 momentos más memorables en la historia de MandalaTickets',
      excerpt: 'Un recorrido por los hitos más importantes que han marcado la trayectoria de MandalaTickets.',
      slug: '10-momentos-memorables-historia-mandalatickets'
    },
    en: {
      title: 'The 10 Most Memorable Moments in MandalaTickets History',
      excerpt: 'A journey through the most important milestones that have marked MandalaTickets\' trajectory.',
      slug: '10-most-memorable-moments-mandalatickets-history'
    },
    fr: {
      title: 'Les 10 moments les plus mémorables de l\'histoire de MandalaTickets',
      excerpt: 'Un voyage à travers les jalons les plus importants qui ont marqué la trajectoire de MandalaTickets.',
      slug: '10-moments-plus-memorables-histoire-mandalatickets'
    },
    pt: {
      title: 'Os 10 Momentos Mais Memoráveis na História da MandalaTickets',
      excerpt: 'Uma jornada pelos marcos mais importantes que marcaram a trajetória da MandalaTickets.',
      slug: '10-momentos-memoraveis-historia-mandalatickets'
    }
  },
  // Post 43: Cómo planificar una escapada de fin de semana llena de fiestas en Los Cabos
  '43': {
    es: {
      title: 'Cómo planificar una escapada de fin de semana llena de fiestas en Los Cabos',
      excerpt: 'Guía completa para organizar un fin de semana perfecto lleno de eventos y diversión en Los Cabos.',
      slug: 'planificar-escapada-fin-semana-fiestas-los-cabos'
    },
    en: {
      title: 'How to Plan a Weekend Getaway Full of Parties in Los Cabos',
      excerpt: 'Complete guide to organize a perfect weekend full of events and fun in Los Cabos.',
      slug: 'plan-weekend-getaway-parties-los-cabos'
    },
    fr: {
      title: 'Comment planifier une escapade de week-end pleine de fêtes à Los Cabos',
      excerpt: 'Guide complet pour organiser un week-end parfait plein d\'événements et de plaisir à Los Cabos.',
      slug: 'planifier-escapade-week-end-fetes-los-cabos'
    },
    pt: {
      title: 'Como Planejar uma Escapada de Fim de Semana Cheia de Festas em Los Cabos',
      excerpt: 'Guia completo para organizar um fim de semana perfeito cheio de eventos e diversão em Los Cabos.',
      slug: 'planejar-escapada-fim-semana-festas-los-cabos'
    }
  },
  // Post 44: Los mejores lugares para tomar fotos durante los eventos en Puerto Vallarta
  '44': {
    es: {
      title: 'Los mejores lugares para tomar fotos durante los eventos en Puerto Vallarta',
      excerpt: 'Spots fotográficos perfectos para capturar los mejores momentos de tus eventos en Puerto Vallarta.',
      slug: 'mejores-lugares-fotos-eventos-puerto-vallarta'
    },
    en: {
      title: 'The Best Places to Take Photos During Events in Puerto Vallarta',
      excerpt: 'Perfect photography spots to capture the best moments of your events in Puerto Vallarta.',
      slug: 'best-places-take-photos-events-puerto-vallarta'
    },
    fr: {
      title: 'Les meilleurs endroits pour prendre des photos pendant les événements à Puerto Vallarta',
      excerpt: 'Endroits photographiques parfaits pour capturer les meilleurs moments de vos événements à Puerto Vallarta.',
      slug: 'meilleurs-endroits-prendre-photos-evenements-puerto-vallarta'
    },
    pt: {
      title: 'Os Melhores Lugares para Tirar Fotos Durante os Eventos em Puerto Vallarta',
      excerpt: 'Pontos fotográficos perfeitos para capturar os melhores momentos de seus eventos em Puerto Vallarta.',
      slug: 'melhores-lugares-tirar-fotos-eventos-puerto-vallarta'
    }
  },
  // Post 45: Tendencias en música latina para 2025
  '45': {
    es: {
      title: 'Tendencias en música latina para 2025',
      excerpt: 'Los ritmos y géneros latinos que dominarán los eventos este año.',
      slug: 'tendencias-musica-latina-2025'
    },
    en: {
      title: 'Latin Music Trends for 2025',
      excerpt: 'The Latin rhythms and genres that will dominate events this year.',
      slug: 'latin-music-trends-2025'
    },
    fr: {
      title: 'Tendances de la musique latine pour 2025',
      excerpt: 'Les rythmes et genres latins qui domineront les événements cette année.',
      slug: 'tendances-musique-latine-2025'
    },
    pt: {
      title: 'Tendências em Música Latina para 2025',
      excerpt: 'Os ritmos e gêneros latinos que dominarão os eventos este ano.',
      slug: 'tendencias-musica-latina-2025'
    }
  },
  // Post 46: Cómo hacer networking y conocer gente nueva en los eventos
  '46': {
    es: {
      title: 'Cómo hacer networking y conocer gente nueva en los eventos',
      excerpt: 'Estrategias para expandir tu red de contactos mientras disfrutas de los eventos.',
      slug: 'hacer-networking-conocer-gente-eventos'
    },
    en: {
      title: 'How to Network and Meet New People at Events',
      excerpt: 'Strategies to expand your network of contacts while enjoying events.',
      slug: 'network-meet-new-people-events'
    },
    fr: {
      title: 'Comment réseauter et rencontrer de nouvelles personnes aux événements',
      excerpt: 'Stratégies pour élargir votre réseau de contacts tout en profitant des événements.',
      slug: 'reseaute-rencontrer-nouvelles-personnes-evenements'
    },
    pt: {
      title: 'Como Fazer Networking e Conhecer Pessoas Novas nos Eventos',
      excerpt: 'Estratégias para expandir sua rede de contatos enquanto aproveita os eventos.',
      slug: 'fazer-networking-conhecer-pessoas-eventos'
    }
  },
  // Post 47: Entrevista con el diseñador de los flyers y materiales promocionales de MandalaTickets
  '47': {
    es: {
      title: 'Entrevista con el diseñador de los flyers y materiales promocionales de MandalaTickets',
      excerpt: 'Conoce el proceso creativo detrás del diseño visual que identifica a MandalaTickets.',
      slug: 'entrevista-disenador-flyers-materiales-promocionales-mandalatickets'
    },
    en: {
      title: 'Interview with the Designer of MandalaTickets Flyers and Promotional Materials',
      excerpt: 'Learn about the creative process behind the visual design that identifies MandalaTickets.',
      slug: 'interview-designer-flyers-promotional-materials-mandalatickets'
    },
    fr: {
      title: 'Interview avec le concepteur des flyers et matériaux promotionnels de MandalaTickets',
      excerpt: 'Découvrez le processus créatif derrière le design visuel qui identifie MandalaTickets.',
      slug: 'interview-concepteur-flyers-materiaux-promotionnels-mandalatickets'
    },
    pt: {
      title: 'Entrevista com o Designer dos Flyers e Materiais Promocionais da MandalaTickets',
      excerpt: 'Conheça o processo criativo por trás do design visual que identifica a MandalaTickets.',
      slug: 'entrevista-designer-flyers-materiais-promocionais-mandalatickets'
    }
  },
  // Post 48: Los 5 eventos más románticos para parejas en Cancún
  '48': {
    es: {
      title: 'Los 5 eventos más románticos para parejas en Cancún',
      excerpt: 'Eventos especiales diseñados para parejas que buscan una experiencia romántica y memorable.',
      slug: '5-eventos-romanticos-parejas-cancun'
    },
    en: {
      title: 'The 5 Most Romantic Events for Couples in Cancun',
      excerpt: 'Special events designed for couples seeking a romantic and memorable experience.',
      slug: '5-most-romantic-events-couples-cancun'
    },
    fr: {
      title: 'Les 5 événements les plus romantiques pour les couples à Cancún',
      excerpt: 'Événements spéciaux conçus pour les couples recherchant une expérience romantique et mémorable.',
      slug: '5-evenements-plus-romantiques-couples-cancun'
    },
    pt: {
      title: 'Os 5 Eventos Mais Românticos para Casais em Cancún',
      excerpt: 'Eventos especiais projetados para casais que buscam uma experiência romântica e memorável.',
      slug: '5-eventos-romanticos-casais-cancun'
    }
  },
  // Post 49: Cómo cuidar tus pertenencias durante una noche de fiesta
  '49': {
    es: {
      title: 'Cómo cuidar tus pertenencias durante una noche de fiesta',
      excerpt: 'Consejos prácticos para mantener seguras tus cosas mientras disfrutas de los eventos.',
      slug: 'cuidar-pertenencias-noche-fiesta'
    },
    en: {
      title: 'How to Take Care of Your Belongings During a Party Night',
      excerpt: 'Practical tips to keep your things safe while enjoying events.',
      slug: 'take-care-belongings-party-night'
    },
    fr: {
      title: 'Comment prendre soin de vos affaires pendant une nuit de fête',
      excerpt: 'Conseils pratiques pour garder vos affaires en sécurité tout en profitant des événements.',
      slug: 'prendre-soin-affaires-nuit-fete'
    },
    pt: {
      title: 'Como Cuidar de seus Pertences Durante uma Noite de Festa',
      excerpt: 'Dicas práticas para manter suas coisas seguras enquanto aproveita os eventos.',
      slug: 'cuidar-pertence-noite-festa'
    }
  },
  // Post 50: Los mejores lugares para desayunar después de una noche de fiesta en Tulum
  '50': {
    es: {
      title: 'Los mejores lugares para desayunar después de una noche de fiesta en Tulum',
      excerpt: 'Restaurantes perfectos para recuperarte con un delicioso desayuno después de una noche increíble.',
      slug: 'mejores-lugares-desayunar-despues-fiesta-tulum'
    },
    en: {
      title: 'The Best Places to Have Breakfast After a Party Night in Tulum',
      excerpt: 'Perfect restaurants to recover with a delicious breakfast after an incredible night.',
      slug: 'best-places-breakfast-after-party-night-tulum'
    },
    fr: {
      title: 'Les meilleurs endroits pour prendre le petit-déjeuner après une nuit de fête à Tulum',
      excerpt: 'Restaurants parfaits pour récupérer avec un délicieux petit-déjeuner après une nuit incroyable.',
      slug: 'meilleurs-endroits-petit-dejeuner-apres-nuit-fete-tulum'
    },
    pt: {
      title: 'Os Melhores Lugares para Tomar Café da Manhã Depois de uma Noite de Festa em Tulum',
      excerpt: 'Restaurantes perfeitos para se recuperar com um delicioso café da manhã após uma noite incrível.',
      slug: 'melhores-lugares-cafe-manha-depois-festa-tulum'
    }
  },
  // Post 51: Entrevista con el equipo de marketing de MandalaTickets
  '51': {
    es: {
      title: 'Entrevista con el equipo de marketing de MandalaTickets: estrategias detrás del éxito',
      excerpt: 'Descubre cómo MandalaTickets ha construido su marca y conectado con miles de asistentes.',
      slug: 'entrevista-equipo-marketing-mandalatickets'
    },
    en: {
      title: 'Interview with MandalaTickets Marketing Team: Strategies Behind Success',
      excerpt: 'Discover how MandalaTickets has built its brand and connected with thousands of attendees.',
      slug: 'interview-mandalatickets-marketing-team-strategies'
    },
    fr: {
      title: 'Interview avec l\'équipe marketing de MandalaTickets : stratégies derrière le succès',
      excerpt: 'Découvrez comment MandalaTickets a construit sa marque et connecté avec des milliers de participants.',
      slug: 'interview-equipe-marketing-mandalatickets-strategies'
    },
    pt: {
      title: 'Entrevista com a Equipe de Marketing da MandalaTickets: Estratégias por Trás do Sucesso',
      excerpt: 'Descubra como a MandalaTickets construiu sua marca e se conectou com milhares de participantes.',
      slug: 'entrevista-equipe-marketing-mandalatickets-estrategias'
    }
  },
  // Post 52: Los 10 mejores momentos capturados en fotos en los eventos de MandalaTickets
  '52': {
    es: {
      title: 'Los 10 mejores momentos capturados en fotos en los eventos de MandalaTickets',
      excerpt: 'Una galería de los momentos más especiales capturados en nuestros eventos a lo largo del tiempo.',
      slug: '10-mejores-momentos-fotos-eventos-mandalatickets'
    },
    en: {
      title: 'The 10 Best Moments Captured in Photos at MandalaTickets Events',
      excerpt: 'A gallery of the most special moments captured at our events over time.',
      slug: '10-best-moments-captured-photos-mandalatickets-events'
    },
    fr: {
      title: 'Les 10 meilleurs moments capturés en photos aux événements MandalaTickets',
      excerpt: 'Une galerie des moments les plus spéciaux capturés à nos événements au fil du temps.',
      slug: '10-meilleurs-moments-captures-photos-evenements-mandalatickets'
    },
    pt: {
      title: 'Os 10 Melhores Momentos Capturados em Fotos nos Eventos da MandalaTickets',
      excerpt: 'Uma galeria dos momentos mais especiais capturados em nossos eventos ao longo do tempo.',
      slug: '10-melhores-momentos-fotos-eventos-mandalatickets'
    }
  },
  // Post 53: Cómo organizar una propuesta de matrimonio inolvidable en un evento de MandalaTickets
  '53': {
    es: {
      title: 'Cómo organizar una propuesta de matrimonio inolvidable en un evento de MandalaTickets',
      excerpt: 'Ideas creativas para hacer tu propuesta de matrimonio en uno de nuestros eventos especiales.',
      slug: 'organizar-propuesta-matrimonio-evento-mandalatickets'
    },
    en: {
      title: 'How to Organize an Unforgettable Marriage Proposal at a MandalaTickets Event',
      excerpt: 'Creative ideas to make your marriage proposal at one of our special events.',
      slug: 'organize-unforgettable-marriage-proposal-mandalatickets-event'
    },
    fr: {
      title: 'Comment organiser une demande en mariage inoubliable à un événement MandalaTickets',
      excerpt: 'Idées créatives pour faire votre demande en mariage à l\'un de nos événements spéciaux.',
      slug: 'organiser-demande-mariage-inoubliable-evenement-mandalatickets'
    },
    pt: {
      title: 'Como Organizar um Pedido de Casamento Inesquecível em um Evento da MandalaTickets',
      excerpt: 'Ideias criativas para fazer seu pedido de casamento em um de nossos eventos especiais.',
      slug: 'organizar-pedido-casamento-inesquecivel-evento-mandalatickets'
    }
  },
  // Post 54: Los mejores lugares para comprar outfits de fiesta en Playa del Carmen
  '54': {
    es: {
      title: 'Los mejores lugares para comprar outfits de fiesta en Playa del Carmen',
      excerpt: 'Tiendas y boutiques donde encontrarás el outfit perfecto para tus eventos en Playa del Carmen.',
      slug: 'mejores-lugares-comprar-outfits-fiesta-playa-carmen'
    },
    en: {
      title: 'The Best Places to Buy Party Outfits in Playa del Carmen',
      excerpt: 'Stores and boutiques where you\'ll find the perfect outfit for your events in Playa del Carmen.',
      slug: 'best-places-buy-party-outfits-playa-del-carmen'
    },
    fr: {
      title: 'Les meilleurs endroits pour acheter des tenues de fête à Playa del Carmen',
      excerpt: 'Magasins et boutiques où vous trouverez la tenue parfaite pour vos événements à Playa del Carmen.',
      slug: 'meilleurs-endroits-acheter-tenues-fete-playa-del-carmen'
    },
    pt: {
      title: 'Os Melhores Lugares para Comprar Outfits de Festa em Playa del Carmen',
      excerpt: 'Lojas e boutiques onde você encontrará o outfit perfeito para seus eventos em Playa del Carmen.',
      slug: 'melhores-lugares-comprar-outfits-festa-playa-del-carmen'
    }
  },
  // Post 55: Tendencias en bebidas y mixología para eventos en 2025
  '55': {
    es: {
      title: 'Tendencias en bebidas y mixología para eventos en 2025',
      excerpt: 'Las innovaciones en cócteles y bebidas que verás en los eventos este año.',
      slug: 'tendencias-bebidas-mixologia-eventos-2025'
    },
    en: {
      title: 'Drink and Mixology Trends for Events in 2025',
      excerpt: 'The innovations in cocktails and drinks you\'ll see at events this year.',
      slug: 'drink-mixology-trends-events-2025'
    },
    fr: {
      title: 'Tendances en boissons et mixologie pour les événements en 2025',
      excerpt: 'Les innovations en cocktails et boissons que vous verrez aux événements cette année.',
      slug: 'tendances-boissons-mixologie-evenements-2025'
    },
    pt: {
      title: 'Tendências em Bebidas e Mixologia para Eventos em 2025',
      excerpt: 'As inovações em coquetéis e bebidas que você verá nos eventos este ano.',
      slug: 'tendencias-bebidas-mixologia-eventos-2025'
    }
  },
  // Post 56: Cómo mantener la energía durante una noche de fiesta sin excederte
  '56': {
    es: {
      title: 'Cómo mantener la energía durante una noche de fiesta sin excederte',
      excerpt: 'Consejos para disfrutar toda la noche manteniendo un equilibrio saludable.',
      slug: 'mantener-energia-noche-fiesta-sin-excederte'
    },
    en: {
      title: 'How to Maintain Energy During a Party Night Without Overdoing It',
      excerpt: 'Tips to enjoy the whole night while maintaining a healthy balance.',
      slug: 'maintain-energy-party-night-without-overdoing'
    },
    fr: {
      title: 'Comment maintenir l\'énergie pendant une nuit de fête sans en faire trop',
      excerpt: 'Conseils pour profiter de toute la nuit tout en maintenant un équilibre sain.',
      slug: 'maintenir-energie-nuit-fete-sans-faire-trop'
    },
    pt: {
      title: 'Como Manter a Energia Durante uma Noite de Festa sem Exagerar',
      excerpt: 'Dicas para aproveitar a noite toda mantendo um equilíbrio saudável.',
      slug: 'manter-energia-noite-festa-sem-exagerar'
    }
  },
  // Post 57: Entrevista con el equipo de logística de MandalaTickets
  '57': {
    es: {
      title: 'Entrevista con el equipo de logística de MandalaTickets: cómo organizan eventos exitosos',
      excerpt: 'Conoce el trabajo detrás de escena que hace posible cada evento perfecto.',
      slug: 'entrevista-equipo-logistica-mandalatickets'
    },
    en: {
      title: 'Interview with MandalaTickets Logistics Team: How They Organize Successful Events',
      excerpt: 'Learn about the behind-the-scenes work that makes each perfect event possible.',
      slug: 'interview-mandalatickets-logistics-team-successful-events'
    },
    fr: {
      title: 'Interview avec l\'équipe logistique de MandalaTickets : comment ils organisent des événements réussis',
      excerpt: 'Découvrez le travail dans les coulisses qui rend chaque événement parfait possible.',
      slug: 'interview-equipe-logistique-mandalatickets-evenements-reussis'
    },
    pt: {
      title: 'Entrevista com a Equipe de Logística da MandalaTickets: Como Organizam Eventos Bem-Sucedidos',
      excerpt: 'Conheça o trabalho nos bastidores que torna cada evento perfeito possível.',
      slug: 'entrevista-equipe-logistica-mandalatickets-eventos-sucesso'
    }
  },
  // Post 58: Los 5 eventos más exclusivos para celebrar Año Nuevo en Los Cabos
  '58': {
    es: {
      title: 'Los 5 eventos más exclusivos para celebrar Año Nuevo en Los Cabos',
      excerpt: 'Opciones VIP para recibir el Año Nuevo de forma inolvidable en Los Cabos.',
      slug: '5-eventos-exclusivos-ano-nuevo-los-cabos'
    },
    en: {
      title: 'The 5 Most Exclusive Events to Celebrate New Year in Los Cabos',
      excerpt: 'VIP options to welcome the New Year in an unforgettable way in Los Cabos.',
      slug: '5-most-exclusive-events-celebrate-new-year-los-cabos'
    },
    fr: {
      title: 'Les 5 événements les plus exclusifs pour célébrer le Nouvel An à Los Cabos',
      excerpt: 'Options VIP pour accueillir le Nouvel An de manière inoubliable à Los Cabos.',
      slug: '5-evenements-plus-exclusifs-celebrer-nouvel-an-los-cabos'
    },
    pt: {
      title: 'Os 5 Eventos Mais Exclusivos para Celebrar o Ano Novo em Los Cabos',
      excerpt: 'Opções VIP para receber o Ano Novo de forma inesquecível em Los Cabos.',
      slug: '5-eventos-exclusivos-ano-novo-los-cabos'
    }
  },
  // Post 59: Cómo elegir el evento perfecto según tus gustos musicales
  '59': {
    es: {
      title: 'Cómo elegir el evento perfecto según tus gustos musicales',
      excerpt: 'Guía para encontrar el evento que mejor se adapte a tu estilo musical preferido.',
      slug: 'elegir-evento-perfecto-gustos-musicales'
    },
    en: {
      title: 'How to Choose the Perfect Event According to Your Musical Tastes',
      excerpt: 'Guide to find the event that best fits your preferred musical style.',
      slug: 'choose-perfect-event-musical-tastes'
    },
    fr: {
      title: 'Comment choisir l\'événement parfait selon vos goûts musicaux',
      excerpt: 'Guide pour trouver l\'événement qui correspond le mieux à votre style musical préféré.',
      slug: 'choisir-evenement-parfait-gouts-musicaux'
    },
    pt: {
      title: 'Como Escolher o Evento Perfeito de Acordo com seus Gostos Musicais',
      excerpt: 'Guia para encontrar o evento que melhor se adapta ao seu estilo musical preferido.',
      slug: 'escolher-evento-perfeito-gostos-musicais'
    }
  },
  // Post 60: Los mejores lugares para relajarte después de una noche de fiesta en Puerto Vallarta
  '60': {
    es: {
      title: 'Los mejores lugares para relajarte después de una noche de fiesta en Puerto Vallarta',
      excerpt: 'Spas, playas y lugares tranquilos para recuperarte después de una noche increíble.',
      slug: 'mejores-lugares-relajarte-despues-fiesta-puerto-vallarta'
    },
    en: {
      title: 'The Best Places to Relax After a Party Night in Puerto Vallarta',
      excerpt: 'Spas, beaches and quiet places to recover after an incredible night.',
      slug: 'best-places-relax-after-party-night-puerto-vallarta'
    },
    fr: {
      title: 'Les meilleurs endroits pour se détendre après une nuit de fête à Puerto Vallarta',
      excerpt: 'Spas, plages et endroits tranquilles pour récupérer après une nuit incroyable.',
      slug: 'meilleurs-endroits-detendre-apres-nuit-fete-puerto-vallarta'
    },
    pt: {
      title: 'Os Melhores Lugares para Relaxar Depois de uma Noite de Festa em Puerto Vallarta',
      excerpt: 'Spas, praias e lugares tranquilos para se recuperar após uma noite incrível.',
      slug: 'melhores-lugares-relaxar-depois-festa-puerto-vallarta'
    }
  },
  // Post 61: Entrevista con el equipo de relaciones públicas de MandalaTickets
  '61': {
    es: {
      title: 'Entrevista con el equipo de relaciones públicas de MandalaTickets: cómo construyen la comunidad',
      excerpt: 'Descubre cómo MandalaTickets ha creado una comunidad vibrante de amantes de la fiesta.',
      slug: 'entrevista-equipo-rrpp-mandalatickets'
    },
    en: {
      title: 'Interview with MandalaTickets Public Relations Team: How They Build Community',
      excerpt: 'Discover how MandalaTickets has created a vibrant community of party lovers.',
      slug: 'interview-mandalatickets-pr-team-build-community'
    },
    fr: {
      title: 'Interview avec l\'équipe des relations publiques de MandalaTickets : comment ils construisent la communauté',
      excerpt: 'Découvrez comment MandalaTickets a créé une communauté vibrante d\'amateurs de fête.',
      slug: 'interview-equipe-relations-publiques-mandalatickets-communaute'
    },
    pt: {
      title: 'Entrevista com a Equipe de Relações Públicas da MandalaTickets: Como Constroem a Comunidade',
      excerpt: 'Descubra como a MandalaTickets criou uma comunidade vibrante de amantes de festa.',
      slug: 'entrevista-equipe-rp-mandalatickets-comunidade'
    }
  },
  // Post 62: Los 10 mejores momentos en video de los eventos de MandalaTickets
  '62': {
    es: {
      title: 'Los 10 mejores momentos en video de los eventos de MandalaTickets',
      excerpt: 'Una compilación de los videos más emocionantes y memorables de nuestros eventos.',
      slug: '10-mejores-momentos-video-eventos-mandalatickets'
    },
    en: {
      title: 'The 10 Best Video Moments from MandalaTickets Events',
      excerpt: 'A compilation of the most exciting and memorable videos from our events.',
      slug: '10-best-video-moments-mandalatickets-events'
    },
    fr: {
      title: 'Les 10 meilleurs moments vidéo des événements MandalaTickets',
      excerpt: 'Une compilation des vidéos les plus excitantes et mémorables de nos événements.',
      slug: '10-meilleurs-moments-video-evenements-mandalatickets'
    },
    pt: {
      title: 'Os 10 Melhores Momentos em Vídeo dos Eventos da MandalaTickets',
      excerpt: 'Uma compilação dos vídeos mais emocionantes e memoráveis de nossos eventos.',
      slug: '10-melhores-momentos-video-eventos-mandalatickets'
    }
  },
  // Post 63: Cómo organizar una fiesta sorpresa en uno de los eventos de MandalaTickets
  '63': {
    es: {
      title: 'Cómo organizar una fiesta sorpresa en uno de los eventos de MandalaTickets',
      excerpt: 'Guía paso a paso para planificar una fiesta sorpresa exitosa en uno de nuestros eventos.',
      slug: 'organizar-fiesta-sorpresa-evento-mandalatickets'
    },
    en: {
      title: 'How to Organize a Surprise Party at a MandalaTickets Event',
      excerpt: 'Step-by-step guide to plan a successful surprise party at one of our events.',
      slug: 'organize-surprise-party-mandalatickets-event'
    },
    fr: {
      title: 'Comment organiser une fête surprise à un événement MandalaTickets',
      excerpt: 'Guide étape par étape pour planifier une fête surprise réussie à l\'un de nos événements.',
      slug: 'organiser-fete-surprise-evenement-mandalatickets'
    },
    pt: {
      title: 'Como Organizar uma Festa Surpresa em um Evento da MandalaTickets',
      excerpt: 'Guia passo a passo para planejar uma festa surpresa bem-sucedida em um de nossos eventos.',
      slug: 'organizar-festa-surpresa-evento-mandalatickets'
    }
  },
  // Post 64: Los mejores lugares para comprar accesorios de fiesta en Cancún
  '64': {
    es: {
      title: 'Los mejores lugares para comprar accesorios de fiesta en Cancún',
      excerpt: 'Tiendas donde encontrarás los accesorios perfectos para complementar tu look de fiesta.',
      slug: 'mejores-lugares-comprar-accesorios-fiesta-cancun'
    },
    en: {
      title: 'The Best Places to Buy Party Accessories in Cancun',
      excerpt: 'Stores where you\'ll find the perfect accessories to complement your party look.',
      slug: 'best-places-buy-party-accessories-cancun'
    },
    fr: {
      title: 'Les meilleurs endroits pour acheter des accessoires de fête à Cancún',
      excerpt: 'Magasins où vous trouverez les accessoires parfaits pour compléter votre look de fête.',
      slug: 'meilleurs-endroits-acheter-accessoires-fete-cancun'
    },
    pt: {
      title: 'Os Melhores Lugares para Comprar Acessórios de Festa em Cancún',
      excerpt: 'Lojas onde você encontrará os acessórios perfeitos para complementar seu look de festa.',
      slug: 'melhores-lugares-comprar-acessorios-festa-cancun'
    }
  },
  // Post 65: Tendencias en decoración y ambientación para eventos en 2025
  '65': {
    es: {
      title: 'Tendencias en decoración y ambientación para eventos en 2025',
      excerpt: 'Las tendencias de diseño que transformarán la experiencia visual de los eventos.',
      slug: 'tendencias-decoracion-ambientacion-eventos-2025'
    },
    en: {
      title: 'Decoration and Ambiance Trends for Events in 2025',
      excerpt: 'The design trends that will transform the visual experience of events.',
      slug: 'decoration-ambiance-trends-events-2025'
    },
    fr: {
      title: 'Tendances en décoration et ambiance pour les événements en 2025',
      excerpt: 'Les tendances de design qui transformeront l\'expérience visuelle des événements.',
      slug: 'tendances-decoration-ambiance-evenements-2025'
    },
    pt: {
      title: 'Tendências em Decoração e Ambientação para Eventos em 2025',
      excerpt: 'As tendências de design que transformarão a experiência visual dos eventos.',
      slug: 'tendencias-decoracao-ambientacao-eventos-2025'
    }
  },
  // Post 66: Cómo mantener una actitud positiva y disfrutar al máximo de los eventos
  '66': {
    es: {
      title: 'Cómo mantener una actitud positiva y disfrutar al máximo de los eventos',
      excerpt: 'Consejos para tener la mejor actitud y aprovechar cada momento de los eventos.',
      slug: 'mantener-actitud-positiva-disfrutar-maximo-eventos'
    },
    en: {
      title: 'How to Maintain a Positive Attitude and Enjoy Events to the Fullest',
      excerpt: 'Tips to have the best attitude and make the most of every moment at events.',
      slug: 'maintain-positive-attitude-enjoy-events-fullest'
    },
    fr: {
      title: 'Comment maintenir une attitude positive et profiter au maximum des événements',
      excerpt: 'Conseils pour avoir la meilleure attitude et tirer le meilleur parti de chaque moment des événements.',
      slug: 'maintenir-attitude-positive-profiter-maximum-evenements'
    },
    pt: {
      title: 'Como Manter uma Atitude Positiva e Aproveitar os Eventos ao Máximo',
      excerpt: 'Dicas para ter a melhor atitude e aproveitar cada momento dos eventos.',
      slug: 'manter-atitude-positiva-aproveitar-eventos-maximo'
    }
  },
  // Post 67: Entrevista con el equipo de atención al cliente de MandalaTickets
  '67': {
    es: {
      title: 'Entrevista con el equipo de atención al cliente de MandalaTickets: cómo garantizan una experiencia excepcional',
      excerpt: 'Conoce cómo el equipo de atención al cliente asegura que cada asistente tenga la mejor experiencia.',
      slug: 'entrevista-equipo-atencion-cliente-mandalatickets'
    },
    en: {
      title: 'Interview with MandalaTickets Customer Service Team: How They Ensure an Exceptional Experience',
      excerpt: 'Learn how the customer service team ensures that each attendee has the best experience.',
      slug: 'interview-mandalatickets-customer-service-exceptional-experience'
    },
    fr: {
      title: 'Interview avec l\'équipe du service client de MandalaTickets : comment ils garantissent une expérience exceptionnelle',
      excerpt: 'Découvrez comment l\'équipe du service client assure que chaque participant ait la meilleure expérience.',
      slug: 'interview-equipe-service-client-mandalatickets-experience-exceptionnelle'
    },
    pt: {
      title: 'Entrevista com a Equipe de Atendimento ao Cliente da MandalaTickets: Como Garantem uma Experiência Excepcional',
      excerpt: 'Conheça como a equipe de atendimento ao cliente garante que cada participante tenha a melhor experiência.',
      slug: 'entrevista-equipe-atendimento-cliente-mandalatickets-experiencia-excepcional'
    }
  },
  // Post 68: Los 5 eventos más esperados para la temporada de primavera en Tulum
  '68': {
    es: {
      title: 'Los 5 eventos más esperados para la temporada de primavera en Tulum',
      excerpt: 'Una selección de los eventos más emocionantes que llegarán a Tulum esta primavera.',
      slug: '5-eventos-esperados-temporada-primavera-tulum'
    },
    en: {
      title: 'The 5 Most Anticipated Events for Spring Season in Tulum',
      excerpt: 'A selection of the most exciting events coming to Tulum this spring.',
      slug: '5-most-anticipated-events-spring-season-tulum'
    },
    fr: {
      title: 'Les 5 événements les plus attendus pour la saison de printemps à Tulum',
      excerpt: 'Une sélection des événements les plus excitants qui arriveront à Tulum ce printemps.',
      slug: '5-evenements-plus-attendus-saison-printemps-tulum'
    },
    pt: {
      title: 'Os 5 Eventos Mais Esperados para a Temporada de Primavera em Tulum',
      excerpt: 'Uma seleção dos eventos mais emocionantes que chegarão a Tulum nesta primavera.',
      slug: '5-eventos-esperados-temporada-primavera-tulum'
    }
  },
  // Post 69: Guía completa de Cancún: playas, eventos y vida nocturna
  '69': {
    es: {
      title: 'Guía completa de Cancún: playas, eventos y vida nocturna',
      excerpt: 'Todo lo que necesitas saber sobre Cancún, desde sus playas hasta su vibrante escena nocturna.',
      slug: 'guia-completa-cancun-playas-eventos-vida-nocturna'
    },
    en: {
      title: 'Complete Guide to Cancun: Beaches, Events and Nightlife',
      excerpt: 'Everything you need to know about Cancun, from its beaches to its vibrant nightlife scene.',
      slug: 'complete-guide-cancun-beaches-events-nightlife'
    },
    fr: {
      title: 'Guide complet de Cancún : plages, événements et vie nocturne',
      excerpt: 'Tout ce que vous devez savoir sur Cancún, de ses plages à sa scène nocturne vibrante.',
      slug: 'guide-complet-cancun-plages-evenements-vie-nocturne'
    },
    pt: {
      title: 'Guia Completo de Cancún: Praias, Eventos e Vida Noturna',
      excerpt: 'Tudo o que você precisa saber sobre Cancún, desde suas praias até sua cena noturna vibrante.',
      slug: 'guia-completo-cancun-praias-eventos-vida-noturna'
    }
  },
  // Post 70: Cómo aprovechar los paquetes especiales de MandalaTickets
  '70': {
    es: {
      title: 'Cómo aprovechar los paquetes especiales de MandalaTickets',
      excerpt: 'Guía para elegir y aprovechar los mejores paquetes que incluyen eventos, hospedaje y más.',
      slug: 'aprovechar-paquetes-especiales-mandalatickets'
    },
    en: {
      title: 'How to Make the Most of MandalaTickets Special Packages',
      excerpt: 'Guide to choose and make the most of the best packages that include events, accommodation and more.',
      slug: 'make-most-mandalatickets-special-packages'
    },
    fr: {
      title: 'Comment profiter au maximum des forfaits spéciaux MandalaTickets',
      excerpt: 'Guide pour choisir et profiter au maximum des meilleurs forfaits qui incluent événements, hébergement et plus.',
      slug: 'profiter-maximum-forfaits-speciaux-mandalatickets'
    },
    pt: {
      title: 'Como Aproveitar ao Máximo os Pacotes Especiais da MandalaTickets',
      excerpt: 'Guia para escolher e aproveitar ao máximo os melhores pacotes que incluem eventos, hospedagem e mais.',
      slug: 'aproveitar-maximo-pacotes-especiais-mandalatickets'
    }
  },
  // Post 71: Los mejores eventos para solteros en Playa del Carmen
  '71': {
    es: {
      title: 'Los mejores eventos para solteros en Playa del Carmen',
      excerpt: 'Eventos diseñados especialmente para personas solteras que buscan conocer gente nueva.',
      slug: 'mejores-eventos-solteros-playa-carmen'
    },
    en: {
      title: 'The Best Events for Singles in Playa del Carmen',
      excerpt: 'Events designed especially for single people looking to meet new people.',
      slug: 'best-events-singles-playa-del-carmen'
    },
    fr: {
      title: 'Les meilleurs événements pour célibataires à Playa del Carmen',
      excerpt: 'Événements conçus spécialement pour les personnes célibataires qui cherchent à rencontrer de nouvelles personnes.',
      slug: 'meilleurs-evenements-celibataires-playa-del-carmen'
    },
    pt: {
      title: 'Os Melhores Eventos para Solteiros em Playa del Carmen',
      excerpt: 'Eventos projetados especialmente para pessoas solteiras que buscam conhecer pessoas novas.',
      slug: 'melhores-eventos-solteiros-playa-del-carmen'
    }
  },
  // Post 72: Cómo planificar tu primera visita a un evento de MandalaTickets
  '72': {
    es: {
      title: 'Cómo planificar tu primera visita a un evento de MandalaTickets',
      excerpt: 'Todo lo que un principiante necesita saber antes de asistir a su primer evento.',
      slug: 'planificar-primera-visita-evento-mandalatickets'
    },
    en: {
      title: 'How to Plan Your First Visit to a MandalaTickets Event',
      excerpt: 'Everything a beginner needs to know before attending their first event.',
      slug: 'plan-first-visit-mandalatickets-event'
    },
    fr: {
      title: 'Comment planifier votre première visite à un événement MandalaTickets',
      excerpt: 'Tout ce qu\'un débutant doit savoir avant d\'assister à son premier événement.',
      slug: 'planifier-premiere-visite-evenement-mandalatickets'
    },
    pt: {
      title: 'Como Planejar sua Primeira Visita a um Evento da MandalaTickets',
      excerpt: 'Tudo o que um iniciante precisa saber antes de participar de seu primeiro evento.',
      slug: 'planejar-primeira-visita-evento-mandalatickets'
    }
  },
  // Post 73: Entrevista con el DJ internacional que debutará en Los Cabos
  '73': {
    es: {
      title: 'Entrevista con el DJ internacional que debutará en Los Cabos',
      excerpt: 'Conoce al artista internacional que por primera vez se presentará en Los Cabos.',
      slug: 'entrevista-dj-internacional-debutara-los-cabos'
    },
    en: {
      title: 'Interview with the International DJ Making Debut in Los Cabos',
      excerpt: 'Meet the international artist who will perform in Los Cabos for the first time.',
      slug: 'interview-international-dj-debut-los-cabos'
    },
    fr: {
      title: 'Interview avec le DJ international qui fera ses débuts à Los Cabos',
      excerpt: 'Rencontrez l\'artiste international qui se produira à Los Cabos pour la première fois.',
      slug: 'interview-dj-international-debut-los-cabos'
    },
    pt: {
      title: 'Entrevista com o DJ Internacional que Estreará em Los Cabos',
      excerpt: 'Conheça o artista internacional que se apresentará em Los Cabos pela primeira vez.',
      slug: 'entrevista-dj-internacional-estreia-los-cabos'
    }
  },
  // Post 74: Los mejores eventos al aire libre en Puerto Vallarta
  '74': {
    es: {
      title: 'Los mejores eventos al aire libre en Puerto Vallarta',
      excerpt: 'Una selección de eventos al aire libre que aprovechan el clima perfecto de Puerto Vallarta.',
      slug: 'mejores-eventos-aire-libre-puerto-vallarta'
    },
    en: {
      title: 'The Best Outdoor Events in Puerto Vallarta',
      excerpt: 'A selection of outdoor events that take advantage of Puerto Vallarta\'s perfect weather.',
      slug: 'best-outdoor-events-puerto-vallarta'
    },
    fr: {
      title: 'Les meilleurs événements en plein air à Puerto Vallarta',
      excerpt: 'Une sélection d\'événements en plein air qui profitent du temps parfait de Puerto Vallarta.',
      slug: 'meilleurs-evenements-plein-air-puerto-vallarta'
    },
    pt: {
      title: 'Os Melhores Eventos ao Ar Livre em Puerto Vallarta',
      excerpt: 'Uma seleção de eventos ao ar livre que aproveitam o clima perfeito de Puerto Vallarta.',
      slug: 'melhores-eventos-ar-livre-puerto-vallarta'
    }
  },
  // Post 75: Tendencias en tecnología para eventos: realidad aumentada y más
  '75': {
    es: {
      title: 'Tendencias en tecnología para eventos: realidad aumentada y más',
      excerpt: 'Cómo la tecnología está transformando la experiencia en los eventos nocturnos.',
      slug: 'tendencias-tecnologia-eventos-realidad-aumentada'
    },
    en: {
      title: 'Technology Trends for Events: Augmented Reality and More',
      excerpt: 'How technology is transforming the experience at nightlife events.',
      slug: 'technology-trends-events-augmented-reality'
    },
    fr: {
      title: 'Tendances technologiques pour les événements : réalité augmentée et plus',
      excerpt: 'Comment la technologie transforme l\'expérience lors des événements nocturnes.',
      slug: 'tendances-technologiques-evenements-realite-augmentee'
    },
    pt: {
      title: 'Tendências em Tecnologia para Eventos: Realidade Aumentada e Mais',
      excerpt: 'Como a tecnologia está transformando a experiência nos eventos noturnos.',
      slug: 'tendencias-tecnologia-eventos-realidade-aumentada'
    }
  },
  // Post 76: Cómo combinar eventos y turismo en tu visita a Tulum
  '76': {
    es: {
      title: 'Cómo combinar eventos y turismo en tu visita a Tulum',
      excerpt: 'Estrategias para disfrutar tanto de los eventos como de las atracciones turísticas de Tulum.',
      slug: 'combinar-eventos-turismo-visita-tulum'
    },
    en: {
      title: 'How to Combine Events and Tourism on Your Visit to Tulum',
      excerpt: 'Strategies to enjoy both events and tourist attractions in Tulum.',
      slug: 'combine-events-tourism-visit-tulum'
    },
    fr: {
      title: 'Comment combiner événements et tourisme lors de votre visite à Tulum',
      excerpt: 'Stratégies pour profiter à la fois des événements et des attractions touristiques de Tulum.',
      slug: 'combiner-evenements-tourisme-visite-tulum'
    },
    pt: {
      title: 'Como Combinar Eventos e Turismo em sua Visita a Tulum',
      excerpt: 'Estratégias para aproveitar tanto os eventos quanto as atrações turísticas de Tulum.',
      slug: 'combinar-eventos-turismo-visita-tulum'
    }
  },
  // Post 77: Los mejores eventos temáticos de los 80s y 90s en Cancún
  '77': {
    es: {
      title: 'Los mejores eventos temáticos de los 80s y 90s en Cancún',
      excerpt: 'Eventos nostálgicos que reviven la música y el estilo de las décadas de los 80s y 90s.',
      slug: 'mejores-eventos-tematicos-80s-90s-cancun'
    },
    en: {
      title: 'The Best 80s and 90s Themed Events in Cancun',
      excerpt: 'Nostalgic events that revive the music and style of the 80s and 90s decades.',
      slug: 'best-80s-90s-themed-events-cancun'
    },
    fr: {
      title: 'Les meilleurs événements à thème des années 80 et 90 à Cancún',
      excerpt: 'Événements nostalgiques qui ravivent la musique et le style des décennies 80 et 90.',
      slug: 'meilleurs-evenements-theme-annees-80-90-cancun'
    },
    pt: {
      title: 'Os Melhores Eventos Temáticos dos Anos 80 e 90 em Cancún',
      excerpt: 'Eventos nostálgicos que revivem a música e o estilo das décadas de 80 e 90.',
      slug: 'melhores-eventos-tematicos-anos-80-90-cancun'
    }
  },
  // Post 78: Guía de etiqueta para eventos VIP en Los Cabos
  '78': {
    es: {
      title: 'Guía de etiqueta para eventos VIP en Los Cabos',
      excerpt: 'Consejos sobre cómo comportarse y qué esperar en eventos VIP exclusivos.',
      slug: 'guia-etiqueta-eventos-vip-los-cabos'
    },
    en: {
      title: 'Etiquette Guide for VIP Events in Los Cabos',
      excerpt: 'Tips on how to behave and what to expect at exclusive VIP events.',
      slug: 'etiquette-guide-vip-events-los-cabos'
    },
    fr: {
      title: 'Guide de l\'étiquette pour les événements VIP à Los Cabos',
      excerpt: 'Conseils sur la façon de se comporter et ce à quoi s\'attendre lors d\'événements VIP exclusifs.',
      slug: 'guide-etiquette-evenements-vip-los-cabos'
    },
    pt: {
      title: 'Guia de Etiqueta para Eventos VIP em Los Cabos',
      excerpt: 'Dicas sobre como se comportar e o que esperar em eventos VIP exclusivos.',
      slug: 'guia-etiqueta-eventos-vip-los-cabos'
    }
  },
  // Post 79: Entrevista con el productor musical detrás de los eventos más exitosos
  '79': {
    es: {
      title: 'Entrevista con el productor musical detrás de los eventos más exitosos',
      excerpt: 'Conoce al productor que ha creado algunos de los eventos más memorables de la Riviera Maya.',
      slug: 'entrevista-productor-musical-eventos-exitosos'
    },
    en: {
      title: 'Interview with the Music Producer Behind the Most Successful Events',
      excerpt: 'Meet the producer who has created some of the most memorable events in the Riviera Maya.',
      slug: 'interview-music-producer-successful-events'
    },
    fr: {
      title: 'Interview avec le producteur musical derrière les événements les plus réussis',
      excerpt: 'Rencontrez le producteur qui a créé certains des événements les plus mémorables de la Riviera Maya.',
      slug: 'interview-producteur-musical-evenements-reussis'
    },
    pt: {
      title: 'Entrevista com o Produtor Musical por Trás dos Eventos Mais Bem-Sucedidos',
      excerpt: 'Conheça o produtor que criou alguns dos eventos mais memoráveis da Riviera Maya.',
      slug: 'entrevista-produtor-musical-eventos-sucesso'
    }
  },
  // Post 80: Los mejores eventos para grupos grandes en Playa del Carmen
  '80': {
    es: {
      title: 'Los mejores eventos para grupos grandes en Playa del Carmen',
      excerpt: 'Eventos ideales para celebrar con grupos grandes de amigos o familiares.',
      slug: 'mejores-eventos-grupos-grandes-playa-carmen'
    },
    en: {
      title: 'The Best Events for Large Groups in Playa del Carmen',
      excerpt: 'Ideal events to celebrate with large groups of friends or family.',
      slug: 'best-events-large-groups-playa-del-carmen'
    },
    fr: {
      title: 'Les meilleurs événements pour les grands groupes à Playa del Carmen',
      excerpt: 'Événements idéaux pour célébrer avec de grands groupes d\'amis ou de famille.',
      slug: 'meilleurs-evenements-grands-groupes-playa-del-carmen'
    },
    pt: {
      title: 'Os Melhores Eventos para Grupos Grandes em Playa del Carmen',
      excerpt: 'Eventos ideais para celebrar com grandes grupos de amigos ou familiares.',
      slug: 'melhores-eventos-grupos-grandes-playa-del-carmen'
    }
  },
  // Post 81: Cómo documentar tu experiencia en eventos: fotografía y video
  '81': {
    es: {
      title: 'Cómo documentar tu experiencia en eventos: fotografía y video',
      excerpt: 'Tips profesionales para capturar los mejores momentos de los eventos.',
      slug: 'documentar-experiencia-eventos-fotografia-video'
    },
    en: {
      title: 'How to Document Your Event Experience: Photography and Video',
      excerpt: 'Professional tips to capture the best moments of events.',
      slug: 'document-event-experience-photography-video'
    },
    fr: {
      title: 'Comment documenter votre expérience d\'événement : photographie et vidéo',
      excerpt: 'Conseils professionnels pour capturer les meilleurs moments des événements.',
      slug: 'documenter-experience-evenement-photographie-video'
    },
    pt: {
      title: 'Como Documentar sua Experiência em Eventos: Fotografia e Vídeo',
      excerpt: 'Dicas profissionais para capturar os melhores momentos dos eventos.',
      slug: 'documentar-experiencia-eventos-fotografia-video'
    }
  },
  // Post 82: Tendencias en sostenibilidad en eventos nocturnos
  '82': {
    es: {
      title: 'Tendencias en sostenibilidad en eventos nocturnos',
      excerpt: 'Cómo la industria de eventos está adoptando prácticas más sostenibles y ecológicas.',
      slug: 'tendencias-sostenibilidad-eventos-nocturnos'
    },
    en: {
      title: 'Sustainability Trends in Nightlife Events',
      excerpt: 'How the events industry is adopting more sustainable and eco-friendly practices.',
      slug: 'sustainability-trends-nightlife-events'
    },
    fr: {
      title: 'Tendances de durabilité dans les événements nocturnes',
      excerpt: 'Comment l\'industrie des événements adopte des pratiques plus durables et écologiques.',
      slug: 'tendances-durabilite-evenements-nocturnes'
    },
    pt: {
      title: 'Tendências em Sustentabilidade em Eventos Noturnos',
      excerpt: 'Como a indústria de eventos está adotando práticas mais sustentáveis e ecológicas.',
      slug: 'tendencias-sustentabilidade-eventos-noturnos'
    }
  },
  // Post 83: Los mejores eventos para celebrar San Valentín en Cancún
  '83': {
    es: {
      title: 'Los mejores eventos para celebrar San Valentín en Cancún',
      excerpt: 'Opciones románticas y especiales para celebrar el Día de San Valentín.',
      slug: 'mejores-eventos-san-valentin-cancun'
    },
    en: {
      title: 'The Best Events to Celebrate Valentine\'s Day in Cancun',
      excerpt: 'Romantic and special options to celebrate Valentine\'s Day.',
      slug: 'best-events-celebrate-valentines-day-cancun'
    },
    fr: {
      title: 'Les meilleurs événements pour célébrer la Saint-Valentin à Cancún',
      excerpt: 'Options romantiques et spéciales pour célébrer la Saint-Valentin.',
      slug: 'meilleurs-evenements-celebrer-saint-valentin-cancun'
    },
    pt: {
      title: 'Os Melhores Eventos para Celebrar o Dia dos Namorados em Cancún',
      excerpt: 'Opções românticas e especiais para celebrar o Dia dos Namorados.',
      slug: 'melhores-eventos-dia-namorados-cancun'
    }
  },
  // Post 84: Guía de seguridad personal para eventos nocturnos
  '84': {
    es: {
      title: 'Guía de seguridad personal para eventos nocturnos',
      excerpt: 'Consejos importantes de seguridad para disfrutar de los eventos de forma responsable.',
      slug: 'guia-seguridad-personal-eventos-nocturnos'
    },
    en: {
      title: 'Personal Safety Guide for Nightlife Events',
      excerpt: 'Important safety tips to enjoy events responsibly.',
      slug: 'personal-safety-guide-nightlife-events'
    },
    fr: {
      title: 'Guide de sécurité personnelle pour les événements nocturnes',
      excerpt: 'Conseils de sécurité importants pour profiter des événements de manière responsable.',
      slug: 'guide-securite-personnelle-evenements-nocturnes'
    },
    pt: {
      title: 'Guia de Segurança Pessoal para Eventos Noturnos',
      excerpt: 'Dicas importantes de segurança para aproveitar os eventos de forma responsável.',
      slug: 'guia-seguranca-pessoal-eventos-noturnos'
    }
  },
  // Post 85: Entrevista con el creador de contenido que documenta los eventos de MandalaTickets
  '85': {
    es: {
      title: 'Entrevista con el creador de contenido que documenta los eventos de MandalaTickets',
      excerpt: 'Conoce al influencer que está compartiendo la experiencia de MandalaTickets con el mundo.',
      slug: 'entrevista-creador-contenido-documenta-eventos-mandalatickets'
    },
    en: {
      title: 'Interview with the Content Creator Documenting MandalaTickets Events',
      excerpt: 'Meet the influencer who is sharing the MandalaTickets experience with the world.',
      slug: 'interview-content-creator-documenting-mandalatickets-events'
    },
    fr: {
      title: 'Interview avec le créateur de contenu qui documente les événements MandalaTickets',
      excerpt: 'Rencontrez l\'influenceur qui partage l\'expérience MandalaTickets avec le monde.',
      slug: 'interview-createur-contenu-documente-evenements-mandalatickets'
    },
    pt: {
      title: 'Entrevista com o Criador de Conteúdo que Documenta os Eventos da MandalaTickets',
      excerpt: 'Conheça o influencer que está compartilhando a experiência da MandalaTickets com o mundo.',
      slug: 'entrevista-criador-conteudo-documenta-eventos-mandalatickets'
    }
  },
  // Post 86: Los mejores eventos de música house en Tulum
  '86': {
    es: {
      title: 'Los mejores eventos de música house en Tulum',
      excerpt: 'Una selección de los mejores eventos de música house que encontrarás en Tulum.',
      slug: 'mejores-eventos-musica-house-tulum'
    },
    en: {
      title: 'The Best House Music Events in Tulum',
      excerpt: 'A selection of the best house music events you\'ll find in Tulum.',
      slug: 'best-house-music-events-tulum'
    },
    fr: {
      title: 'Les meilleurs événements de musique house à Tulum',
      excerpt: 'Une sélection des meilleurs événements de musique house que vous trouverez à Tulum.',
      slug: 'meilleurs-evenements-musique-house-tulum'
    },
    pt: {
      title: 'Os Melhores Eventos de Música House em Tulum',
      excerpt: 'Uma seleção dos melhores eventos de música house que você encontrará em Tulum.',
      slug: 'melhores-eventos-musica-house-tulum'
    }
  },
  // Post 87: Cómo crear el playlist perfecto para prepararte para un evento
  '87': {
    es: {
      title: 'Cómo crear el playlist perfecto para prepararte para un evento',
      excerpt: 'Tips para crear una lista de reproducción que te ponga en el mood perfecto antes del evento.',
      slug: 'crear-playlist-perfecto-prepararse-evento'
    },
    en: {
      title: 'How to Create the Perfect Playlist to Prepare for an Event',
      excerpt: 'Tips to create a playlist that puts you in the perfect mood before the event.',
      slug: 'create-perfect-playlist-prepare-event'
    },
    fr: {
      title: 'Comment créer la playlist parfaite pour se préparer à un événement',
      excerpt: 'Conseils pour créer une liste de lecture qui vous met dans l\'ambiance parfaite avant l\'événement.',
      slug: 'creer-playlist-parfaite-preparer-evenement'
    },
    pt: {
      title: 'Como Criar a Playlist Perfeita para se Preparar para um Evento',
      excerpt: 'Dicas para criar uma playlist que te coloque no clima perfeito antes do evento.',
      slug: 'criar-playlist-perfeita-preparar-evento'
    }
  },
  // Post 88: Los mejores eventos para celebrar el Día de la Independencia en México
  '88': {
    es: {
      title: 'Los mejores eventos para celebrar el Día de la Independencia en México',
      excerpt: 'Eventos especiales para celebrar las fiestas patrias en los destinos de MandalaTickets.',
      slug: 'mejores-eventos-dia-independencia-mexico'
    },
    en: {
      title: 'The Best Events to Celebrate Independence Day in Mexico',
      excerpt: 'Special events to celebrate the national holidays in MandalaTickets destinations.',
      slug: 'best-events-celebrate-independence-day-mexico'
    },
    fr: {
      title: 'Les meilleurs événements pour célébrer le Jour de l\'Indépendance au Mexique',
      excerpt: 'Événements spéciaux pour célébrer les fêtes nationales dans les destinations MandalaTickets.',
      slug: 'meilleurs-evenements-celebrer-jour-independance-mexique'
    },
    pt: {
      title: 'Os Melhores Eventos para Celebrar o Dia da Independência no México',
      excerpt: 'Eventos especiais para celebrar as festas nacionais nos destinos da MandalaTickets.',
      slug: 'melhores-eventos-dia-independencia-mexico'
    }
  },
  // Post 89: Tendencias en experiencias inmersivas en eventos
  '89': {
    es: {
      title: 'Tendencias en experiencias inmersivas en eventos',
      excerpt: 'Cómo los eventos están creando experiencias más inmersivas y envolventes.',
      slug: 'tendencias-experiencias-inmersivas-eventos'
    },
    en: {
      title: 'Trends in Immersive Experiences at Events',
      excerpt: 'How events are creating more immersive and engaging experiences.',
      slug: 'trends-immersive-experiences-events'
    },
    fr: {
      title: 'Tendances des expériences immersives dans les événements',
      excerpt: 'Comment les événements créent des expériences plus immersives et engageantes.',
      slug: 'tendances-experiences-immersives-evenements'
    },
    pt: {
      title: 'Tendências em Experiências Imersivas em Eventos',
      excerpt: 'Como os eventos estão criando experiências mais imersivas e envolventes.',
      slug: 'tendencias-experiencias-imersivas-eventos'
    }
  },
  // Post 90: Guía completa de Los Cabos: eventos, playas y aventuras
  '90': {
    es: {
      title: 'Guía completa de Los Cabos: eventos, playas y aventuras',
      excerpt: 'Todo sobre Los Cabos: desde eventos nocturnos hasta actividades de aventura durante el día.',
      slug: 'guia-completa-los-cabos-eventos-playas-aventuras'
    },
    en: {
      title: 'Complete Guide to Los Cabos: Events, Beaches and Adventures',
      excerpt: 'Everything about Los Cabos: from nightlife events to adventure activities during the day.',
      slug: 'complete-guide-los-cabos-events-beaches-adventures'
    },
    fr: {
      title: 'Guide complet de Los Cabos : événements, plages et aventures',
      excerpt: 'Tout sur Los Cabos : des événements nocturnes aux activités d\'aventure pendant la journée.',
      slug: 'guide-complet-los-cabos-evenements-plages-aventures'
    },
    pt: {
      title: 'Guia Completo de Los Cabos: Eventos, Praias e Aventuras',
      excerpt: 'Tudo sobre Los Cabos: desde eventos noturnos até atividades de aventura durante o dia.',
      slug: 'guia-completo-los-cabos-eventos-praias-aventuras'
    }
  },
  // Post 91: Cómo aprovechar los descuentos de último minuto en MandalaTickets
  '91': {
    es: {
      title: 'Cómo aprovechar los descuentos de último minuto en MandalaTickets',
      excerpt: 'Estrategias para encontrar y aprovechar las mejores ofertas de último minuto.',
      slug: 'aprovechar-descuentos-ultimo-minuto-mandalatickets'
    },
    en: {
      title: 'How to Take Advantage of Last-Minute Discounts on MandalaTickets',
      excerpt: 'Strategies to find and take advantage of the best last-minute deals.',
      slug: 'take-advantage-last-minute-discounts-mandalatickets'
    },
    fr: {
      title: 'Comment profiter des remises de dernière minute sur MandalaTickets',
      excerpt: 'Stratégies pour trouver et profiter des meilleures offres de dernière minute.',
      slug: 'profiter-remises-derniere-minute-mandalatickets'
    },
    pt: {
      title: 'Como Aproveitar os Descontos de Última Hora na MandalaTickets',
      excerpt: 'Estratégias para encontrar e aproveitar as melhores ofertas de última hora.',
      slug: 'aproveitar-descontos-ultima-hora-mandalatickets'
    }
  },
  // Post 92: Los mejores eventos para amantes del reggaetón en Cancún
  '92': {
    es: {
      title: 'Los mejores eventos para amantes del reggaetón en Cancún',
      excerpt: 'Una selección de eventos dedicados al reggaetón y música urbana latina.',
      slug: 'mejores-eventos-reggaeton-cancun'
    },
    en: {
      title: 'The Best Events for Reggaeton Lovers in Cancun',
      excerpt: 'A selection of events dedicated to reggaeton and Latin urban music.',
      slug: 'best-events-reggaeton-lovers-cancun'
    },
    fr: {
      title: 'Les meilleurs événements pour les amateurs de reggaeton à Cancún',
      excerpt: 'Une sélection d\'événements dédiés au reggaeton et à la musique urbaine latine.',
      slug: 'meilleurs-evenements-amateurs-reggaeton-cancun'
    },
    pt: {
      title: 'Os Melhores Eventos para Amantes do Reggaeton em Cancún',
      excerpt: 'Uma seleção de eventos dedicados ao reggaeton e música urbana latina.',
      slug: 'melhores-eventos-reggaeton-cancun'
    }
  },
  // Post 93: Cómo mantenerte conectado durante los eventos: WiFi y carga de batería
  '93': {
    es: {
      title: 'Cómo mantenerte conectado durante los eventos: WiFi y carga de batería',
      excerpt: 'Tips para mantener tu dispositivo cargado y conectado durante los eventos.',
      slug: 'mantenerse-conectado-eventos-wifi-carga-bateria'
    },
    en: {
      title: 'How to Stay Connected During Events: WiFi and Battery Charging',
      excerpt: 'Tips to keep your device charged and connected during events.',
      slug: 'stay-connected-events-wifi-battery-charging'
    },
    fr: {
      title: 'Comment rester connecté pendant les événements : WiFi et charge de batterie',
      excerpt: 'Conseils pour garder votre appareil chargé et connecté pendant les événements.',
      slug: 'rester-connecte-evenements-wifi-charge-batterie'
    },
    pt: {
      title: 'Como Se Manter Conectado Durante os Eventos: WiFi e Carga de Bateria',
      excerpt: 'Dicas para manter seu dispositivo carregado e conectado durante os eventos.',
      slug: 'manter-conectado-eventos-wifi-carga-bateria'
    }
  },
  // Post 94: Entrevista con el equipo de sonido de MandalaTickets
  '94': {
    es: {
      title: 'Entrevista con el equipo de sonido de MandalaTickets',
      excerpt: 'Conoce cómo se crea la experiencia de audio perfecta en cada evento.',
      slug: 'entrevista-equipo-sonido-mandalatickets'
    },
    en: {
      title: 'Interview with MandalaTickets Sound Team',
      excerpt: 'Learn how the perfect audio experience is created at each event.',
      slug: 'interview-mandalatickets-sound-team'
    },
    fr: {
      title: 'Interview avec l\'équipe son de MandalaTickets',
      excerpt: 'Découvrez comment l\'expérience audio parfaite est créée à chaque événement.',
      slug: 'interview-equipe-son-mandalatickets'
    },
    pt: {
      title: 'Entrevista com a Equipe de Som da MandalaTickets',
      excerpt: 'Conheça como a experiência de áudio perfeita é criada em cada evento.',
      slug: 'entrevista-equipe-som-mandalatickets'
    }
  },
  // Post 95: Los mejores eventos para celebrar el Día de las Madres
  '95': {
    es: {
      title: 'Los mejores eventos para celebrar el Día de las Madres',
      excerpt: 'Eventos especiales para celebrar a las mamás en los destinos de MandalaTickets.',
      slug: 'mejores-eventos-dia-madres'
    },
    en: {
      title: 'The Best Events to Celebrate Mother\'s Day',
      excerpt: 'Special events to celebrate mothers in MandalaTickets destinations.',
      slug: 'best-events-celebrate-mothers-day'
    },
    fr: {
      title: 'Les meilleurs événements pour célébrer la Fête des Mères',
      excerpt: 'Événements spéciaux pour célébrer les mères dans les destinations MandalaTickets.',
      slug: 'meilleurs-evenements-celebrer-fete-meres'
    },
    pt: {
      title: 'Os Melhores Eventos para Celebrar o Dia das Mães',
      excerpt: 'Eventos especiais para celebrar as mães nos destinos da MandalaTickets.',
      slug: 'melhores-eventos-dia-maes'
    }
  },
  // Post 96: Tendencias en eventos híbridos: presenciales y virtuales
  '96': {
    es: {
      title: 'Tendencias en eventos híbridos: presenciales y virtuales',
      excerpt: 'Cómo los eventos están combinando experiencias presenciales y virtuales.',
      slug: 'tendencias-eventos-hibridos-presenciales-virtuales'
    },
    en: {
      title: 'Trends in Hybrid Events: In-Person and Virtual',
      excerpt: 'How events are combining in-person and virtual experiences.',
      slug: 'trends-hybrid-events-in-person-virtual'
    },
    fr: {
      title: 'Tendances des événements hybrides : en personne et virtuels',
      excerpt: 'Comment les événements combinent des expériences en personne et virtuelles.',
      slug: 'tendances-evenements-hybrides-personne-virtuels'
    },
    pt: {
      title: 'Tendências em Eventos Híbridos: Presenciais e Virtuais',
      excerpt: 'Como os eventos estão combinando experiências presenciais e virtuais.',
      slug: 'tendencias-eventos-hibridos-presenciais-virtuais'
    }
  },
  // Post 97: Guía completa de Playa del Carmen: eventos y atracciones
  '97': {
    es: {
      title: 'Guía completa de Playa del Carmen: eventos y atracciones',
      excerpt: 'Todo lo que necesitas saber sobre Playa del Carmen, desde eventos hasta atracciones turísticas.',
      slug: 'guia-completa-playa-carmen-eventos-atracciones'
    },
    en: {
      title: 'Complete Guide to Playa del Carmen: Events and Attractions',
      excerpt: 'Everything you need to know about Playa del Carmen, from events to tourist attractions.',
      slug: 'complete-guide-playa-del-carmen-events-attractions'
    },
    fr: {
      title: 'Guide complet de Playa del Carmen : événements et attractions',
      excerpt: 'Tout ce que vous devez savoir sur Playa del Carmen, des événements aux attractions touristiques.',
      slug: 'guide-complet-playa-del-carmen-evenements-attractions'
    },
    pt: {
      title: 'Guia Completo de Playa del Carmen: Eventos e Atrações',
      excerpt: 'Tudo o que você precisa saber sobre Playa del Carmen, desde eventos até atrações turísticas.',
      slug: 'guia-completo-playa-del-carmen-eventos-atracoes'
    }
  },
  // Post 98: Cómo crear recuerdos duraderos de tus eventos favoritos
  '98': {
    es: {
      title: 'Cómo crear recuerdos duraderos de tus eventos favoritos',
      excerpt: 'Ideas creativas para preservar y recordar tus mejores momentos en los eventos.',
      slug: 'crear-recuerdos-duraderos-eventos-favoritos'
    },
    en: {
      title: 'How to Create Lasting Memories of Your Favorite Events',
      excerpt: 'Creative ideas to preserve and remember your best moments at events.',
      slug: 'create-lasting-memories-favorite-events'
    },
    fr: {
      title: 'Comment créer des souvenirs durables de vos événements favoris',
      excerpt: 'Idées créatives pour préserver et se souvenir de vos meilleurs moments aux événements.',
      slug: 'creer-souvenirs-durables-evenements-favoris'
    },
    pt: {
      title: 'Como Criar Lembranças Duradouras de seus Eventos Favoritos',
      excerpt: 'Ideias criativas para preservar e lembrar seus melhores momentos nos eventos.',
      slug: 'criar-lembrancas-duradouras-eventos-favoritos'
    }
  },
  // Post 99: Los mejores eventos para celebrar el Día del Padre
  '99': {
    es: {
      title: 'Los mejores eventos para celebrar el Día del Padre',
      excerpt: 'Eventos especiales para celebrar a los papás en los destinos de MandalaTickets.',
      slug: 'mejores-eventos-dia-padre'
    },
    en: {
      title: 'The Best Events to Celebrate Father\'s Day',
      excerpt: 'Special events to celebrate fathers in MandalaTickets destinations.',
      slug: 'best-events-celebrate-fathers-day'
    },
    fr: {
      title: 'Les meilleurs événements pour célébrer la Fête des Pères',
      excerpt: 'Événements spéciaux pour célébrer les pères dans les destinations MandalaTickets.',
      slug: 'meilleurs-evenements-celebrer-fete-peres'
    },
    pt: {
      title: 'Os Melhores Eventos para Celebrar o Dia dos Pais',
      excerpt: 'Eventos especiais para celebrar os pais nos destinos da MandalaTickets.',
      slug: 'melhores-eventos-dia-pais'
    }
  },
  // Post 100: El futuro de los eventos nocturnos: predicciones para 2026
  '100': {
    es: {
      title: 'El futuro de los eventos nocturnos: predicciones para 2026',
      excerpt: 'Una mirada hacia el futuro de la industria de eventos nocturnos y las tendencias que veremos.',
      slug: 'futuro-eventos-nocturnos-predicciones-2026'
    },
    en: {
      title: 'The Future of Nightlife Events: Predictions for 2026',
      excerpt: 'A look into the future of the nightlife events industry and the trends we\'ll see.',
      slug: 'future-nightlife-events-predictions-2026'
    },
    fr: {
      title: 'L\'avenir des événements nocturnes : prédictions pour 2026',
      excerpt: 'Un aperçu de l\'avenir de l\'industrie des événements nocturnes et des tendances que nous verrons.',
      slug: 'avenir-evenements-nocturnes-predictions-2026'
    },
    pt: {
      title: 'O Futuro dos Eventos Noturnos: Previsões para 2026',
      excerpt: 'Uma visão do futuro da indústria de eventos noturnos e as tendências que veremos.',
      slug: 'futuro-eventos-noturnos-previsoes-2026'
    }
  }
};

// Helper para generar slug SEO-friendly
export function generateSEOSlug(text: string, locale: 'es' | 'en' | 'fr' | 'pt'): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}









