'use client';

import Link from 'next/link';
import { BlogPost, getCategoryById, getPostContent } from '@/data/blogPosts';
import { type Locale } from '@/i18n';
import { getImageForPost, generateImageAltText, generateImageTitle } from '@/utils/imageUtils';

interface PostCardProps {
  post: BlogPost;
  featured?: boolean;
  locale: Locale;
}

export default function PostCard({ post, featured = false, locale }: PostCardProps) {
  const category = getCategoryById(post.category);
  const cardClass = featured ? 'post-card featured-post' : 'post-card';
  
  // Obtener contenido traducido según el locale
  const content = getPostContent(post, locale);
  
  // Mapeo de categorías a arrays de imágenes (usaremos estas si getImageForPost falla)
  const fallbackImageLists: Record<string, string[]> = {
    'cancun': [
      '/blog/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_01.jpg',
      '/blog/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_02.jpg',
      '/blog/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_03.jpg',
      '/blog/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_04.jpg',
      '/blog/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_05.jpg',
      '/blog/assets/PoolFotos/CUN/VAQUITA/MT_Vaquita_Cancun_01.jpg',
      '/blog/assets/PoolFotos/CUN/VAQUITA/MT_Vaquita_Cancun_02.jpg',
      '/blog/assets/PoolFotos/CUN/RAKATA/RAKATA_CUN_FOTOGRAFIA_1.jpg',
      '/blog/assets/PoolFotos/CUN/RAKATA/RAKATA_CUN_FOTOGRAFIA_2.jpg',
      '/blog/assets/PoolFotos/CUN/HOF/HOF_CUN_MT_Fotos1500x1000_1_V01.jpg',
    ],
    'tulum': [
      '/blog/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_01.jpg',
      '/blog/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_02.jpg',
      '/blog/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_03.jpg',
      '/blog/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_01.jpg',
      '/blog/assets/PoolFotos/TULUM/VAGALUME/MT_Vagalume_1.jpg',
      '/blog/assets/PoolFotos/TULUM/BAGATELLE/Pic1.jpg',
    ],
    'playa-del-carmen': [
      '/blog/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_1.jpg',
      '/blog/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_2.jpg',
      '/blog/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_3.jpg',
      '/blog/assets/PoolFotos/PDC/VAQUITA/MT_Vaquita_PDC_1.jpg',
      '/blog/assets/PoolFotos/PDC/SANTITO/MT_SANTITO_01.png',
    ],
    'los-cabos': [
      '/blog/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_1_V01.jpg',
      '/blog/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_2_V01.jpg',
      '/blog/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_3_V01.jpg',
      '/blog/assets/PoolFotos/CSL/VAQUITAA/LaVaquita_CSL_MandalaTickets_2025_NOV_Fotos_V01_U01.jpg',
    ],
    'puerto-vallarta': [
      '/blog/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_1.jpg',
      '/blog/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_2.jpg',
      '/blog/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_3.jpg',
      '/blog/assets/PoolFotos/VTA/VAQUITA/V1.jpg',
      '/blog/assets/PoolFotos/VTA/RAKATA/MT_Rakata_VTA_1.jpg',
    ],
    'general': [
      '/blog/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_01.jpg',
      '/blog/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_02.jpg',
      '/blog/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_01.jpg',
      '/blog/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_1.jpg',
    ],
  };
  
  // Obtener lista de imágenes disponibles para esta categoría
  const imageList = fallbackImageLists[post.category] || fallbackImageLists['general'];
  
  // Determinar qué imagen usar - priorizar post.image, luego getImageForPost, luego fallback
  let rawImageUrl: string;
  
  if (post.image) {
    rawImageUrl = post.image;
  } else {
    // Intentar obtener del imageMap con título y slug para mejor detección de venues
    const imageMapImage = getImageForPost(post.category, post.id, content.title, content.slug);
    if (imageMapImage) {
      rawImageUrl = imageMapImage;
    } else {
      // Usar fallback determinístico basado en el ID del post
      const postIdNum = parseInt(post.id) || 1;
      const imageIndex = (postIdNum - 1) % imageList.length;
      rawImageUrl = imageList[imageIndex] || imageList[0];
    }
  }
  
  // Función helper para codificar espacios en URLs correctamente
  // Next.js maneja las rutas estáticas en public/, pero necesitamos codificar espacios para el navegador
  const encodeUrl = (url: string): string => {
    // Si la URL ya está codificada, no hacer nada
    if (url.includes('%20') || url.includes('%2F')) {
      return url;
    }
    // Codificar cada segmento que tenga espacios
    return url.split('/').map(segment => {
      if (segment && segment.includes(' ')) {
        return encodeURIComponent(segment);
      }
      return segment;
    }).join('/');
  };
  
  // Codificar la URL para que funcione correctamente
  const imageUrl = encodeUrl(rawImageUrl);
  
  // Generar alt text y title optimizados para SEO
  const imageAlt = generateImageAltText(rawImageUrl, content.title, category?.name);
  const imageTitle = generateImageTitle(rawImageUrl, content.title, category?.name);

  return (
    <Link href={`/${locale}/posts/${content.slug}`}>
      <div className={cardClass}>
        <div className="post-image" style={{ position: 'relative', width: '100%', height: featured ? '300px' : '200px', overflow: 'hidden', backgroundColor: '#1a1a1a' }}>
          <img
            src={imageUrl}
            alt={imageAlt}
            title={imageTitle}
            loading={featured ? 'eager' : 'lazy'}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              zIndex: 10,
              minWidth: '100%',
              minHeight: '100%'
            }}
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              // Detener inmediatamente - no intentar fallbacks para evitar loops infinitos
              if ((img as any).__errorHandled) {
                return;
              }
              (img as any).__errorHandled = true;
              img.style.display = 'none';
              // Remover el handler para evitar que se ejecute de nuevo
              img.onerror = null;
            }}
            onLoad={() => {
              if (process.env.NODE_ENV === 'development') {
                console.log('✅ Image loaded successfully:', imageUrl);
              }
            }}
          />
        </div>
        <div className="post-content">
          {category && (
            <span 
              className="post-category"
              style={{ backgroundColor: category.color }}
            >
              {category.name}
            </span>
          )}
          <h2 className="post-title">{content.title}</h2>
          <p className="post-excerpt">{content.excerpt}</p>
          <div className="post-meta">
            <span>{new Date(post.date).toLocaleDateString(locale, { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

