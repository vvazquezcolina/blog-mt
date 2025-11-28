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
      '/assets/Pool Fotos/CUN/MANDALA/MT_Mandala Cancun_01.jpg',
      '/assets/Pool Fotos/CUN/MANDALA/MT_Mandala Cancun_02.jpg',
      '/assets/Pool Fotos/CUN/MANDALA/MT_Mandala Cancun_03.jpg',
      '/assets/Pool Fotos/CUN/MANDALA/MT_Mandala Cancun_04.jpg',
      '/assets/Pool Fotos/CUN/MANDALA/MT_Mandala Cancun_05.jpg',
      '/assets/Pool Fotos/CUN/VAQUITA/MT_Vaquita Cancun_01.jpg',
      '/assets/Pool Fotos/CUN/VAQUITA/MT_Vaquita Cancun_02.jpg',
      '/assets/Pool Fotos/CUN/RAKATA/RAKATA_CUN_FOTOGRAFIA_1.jpg',
      '/assets/Pool Fotos/CUN/RAKATA/RAKATA_CUN_FOTOGRAFIA_2.jpg',
      '/assets/Pool Fotos/CUN/HOF/HOF_CUN_MT_Fotos1500x1000_1_V01.jpg',
    ],
    'tulum': [
      '/assets/Pool Fotos/TULUM/BONBONNIERE/MT_Bonbinniere_01.jpg',
      '/assets/Pool Fotos/TULUM/BONBONNIERE/MT_Bonbinniere_02.jpg',
      '/assets/Pool Fotos/TULUM/BONBONNIERE/MT_Bonbinniere_03.jpg',
      '/assets/Pool Fotos/TULUM/TEHMPLO/MT_Themplo_01.jpg',
      '/assets/Pool Fotos/TULUM/VAGALUME/MT_Vagalume_1.jpg',
      '/assets/Pool Fotos/TULUM/BAGATELLE/Pic 1.jpg',
    ],
    'playa-del-carmen': [
      '/assets/Pool Fotos/PDC/MANDALA/MT_Mandala PDC_1.jpg',
      '/assets/Pool Fotos/PDC/MANDALA/MT_Mandala PDC_2.jpg',
      '/assets/Pool Fotos/PDC/MANDALA/MT_Mandala PDC_3.jpg',
      '/assets/Pool Fotos/PDC/VAQUITA/MT_VaquitaPDC_1.jpg',
      '/assets/Pool Fotos/PDC/SANTITO/MT_SANTITO_01.png',
    ],
    'los-cabos': [
      '/assets/Pool Fotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_1_V01.jpg',
      '/assets/Pool Fotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_2_V01.jpg',
      '/assets/Pool Fotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_3_V01.jpg',
      '/assets/Pool Fotos/CSL/VAQUITAA/LaVaquita_CSL_MandalaTickets_2025_NOV_Fotos_V01_U01.jpg',
    ],
    'puerto-vallarta': [
      '/assets/Pool Fotos/VTA/MANDALA/MT_Mandala Vta_1.jpg',
      '/assets/Pool Fotos/VTA/MANDALA/MT_Mandala Vta_2.jpg',
      '/assets/Pool Fotos/VTA/MANDALA/MT_Mandala Vta_3.jpg',
      '/assets/Pool Fotos/VTA/VAQUITA/V1.jpg',
      '/assets/Pool Fotos/VTA/RAKATA/MT_Rakata_VTA_1.jpg',
    ],
    'general': [
      '/assets/Pool Fotos/CUN/MANDALA/MT_Mandala Cancun_01.jpg',
      '/assets/Pool Fotos/CUN/MANDALA/MT_Mandala Cancun_02.jpg',
      '/assets/Pool Fotos/TULUM/BONBONNIERE/MT_Bonbinniere_01.jpg',
      '/assets/Pool Fotos/PDC/MANDALA/MT_Mandala PDC_1.jpg',
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
  const encodeUrl = (url: string): string => {
    return url.split('/').map(segment => {
      if (segment.includes(' ')) {
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
              if (process.env.NODE_ENV === 'development') {
                console.error('❌ Error loading image:', imageUrl);
              }
              const img = e.target as HTMLImageElement;
              // Intentar con una imagen de fallback codificada
              const fallback = '/assets/Pool%20Fotos/CUN/MANDALA/MT_Mandala%20Cancun_01.jpg';
              if (!img.src.includes('MT_Mandala%20Cancun_01')) {
                if (process.env.NODE_ENV === 'development') {
                  console.log('🔄 Trying fallback image...');
                }
                img.src = fallback;
              }
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

