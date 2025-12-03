'use client';

import Link from 'next/link';
import { BlogPost, getCategoryById, getPostContent } from '@/data/blogPosts';
import { type Locale } from '@/i18n';
import { generateImageAltText, generateImageTitle } from '@/utils/imageUtils';

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
  
  // Listas de imágenes verificadas que realmente existen
  const categoryImages: Record<string, string[]> = {
    'cancun': [
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_01.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_02.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_03.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_05.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_06.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_07.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_08.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_09.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_10.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_11.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_12.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_13.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_14.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_15.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_16.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_17.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_18.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_19.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_20.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_21.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_22.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_23.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_24.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_25.jpg',
      '/assets/PoolFotos/CUN/VAQUITA/MT_Vaquita_Cancun_01.jpg',
      '/assets/PoolFotos/CUN/VAQUITA/MT_Vaquita_Cancun_02.jpg',
      '/assets/PoolFotos/CUN/VAQUITA/MT_Vaquita_Cancun_03.jpg',
      '/assets/PoolFotos/CUN/VAQUITA/MT_Vaquita_Cancun_04.jpg',
      '/assets/PoolFotos/CUN/VAQUITA/MT_Vaquita_Cancun_05.jpg',
      '/assets/PoolFotos/CUN/RAKATA/RAKATA_CUN_FOTOGRAFIA_1.jpg',
      '/assets/PoolFotos/CUN/RAKATA/RAKATA_CUN_FOTOGRAFIA_2.jpg',
      '/assets/PoolFotos/CUN/RAKATA/RAKATA_CUN_FOTOGRAFIA_3.jpg',
      '/assets/PoolFotos/CUN/RAKATA/RAKATA_CUN_FOTOGRAFIA_4.jpg',
      '/assets/PoolFotos/CUN/RAKATA/RAKATA_CUN_FOTOGRAFIA_5.jpg',
      '/assets/PoolFotos/CUN/HOF/HOF_CUN_MT_Fotos1500x1000_1_V01.jpg',
      '/assets/PoolFotos/CUN/HOF/HOF_CUN_MT_Fotos1500x1000_2_V01.jpg',
      '/assets/PoolFotos/CUN/HOF/HOF_CUN_MT_Fotos1500x1000_3_V01.jpg',
      '/assets/PoolFotos/CUN/HOF/HOF_CUN_MT_Fotos1500x1000_4_V01.jpg',
    ],
    'tulum': [
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_01.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_02.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_03.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_04.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_05.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_06.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_07.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_08.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_09.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_10.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_11.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_12.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_13.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_14.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_15.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_01.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_02.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_03.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_04.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_05.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_06.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_07.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_08.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_09.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_10.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_11.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_12.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_13.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_14.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_15.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_16.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_17.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_18.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_19.jpg',
      '/assets/PoolFotos/TULUM/TEHMPLO/MT_Themplo_20.jpg',
      '/assets/PoolFotos/TULUM/VAGALUME/MT_Vagalume_1.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_1.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_3.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_5.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_7.jpg',
      '/assets/PoolFotos/TULUM/BAGATELLE/Pic_9.jpg',
    ],
    'playa-del-carmen': [
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_1.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_2.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_3.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_4.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_5.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_6.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_7.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_8.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_9.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_10.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_11.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_12.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_13.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_14.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_15.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_16.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_17.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_18.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_19.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_20.jpg',
      '/assets/PoolFotos/PDC/VAQUITA/MT_Vaquita_PDC_1.jpg',
      '/assets/PoolFotos/PDC/SANTITO/MT_SANTITO_01.png',
    ],
    'los-cabos': [
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_1_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_2_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_3_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_4_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_5_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_6_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_7_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_8_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_9_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_10_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_11_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_12_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_13_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_14_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_15_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_16_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_17_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_18_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_19_V01.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_20_V01.jpg',
      '/assets/PoolFotos/CSL/VAQUITAA/LaVaquita_CSL_MandalaTickets_2025_NOV_Fotos_V01_U01.jpg',
      '/assets/PoolFotos/CSL/VAQUITAA/LaVaquita_CSL_MandalaTickets_2025_NOV_Fotos_V01_U02.jpg',
      '/assets/PoolFotos/CSL/VAQUITAA/LaVaquita_CSL_MandalaTickets_2025_NOV_Fotos_V01_U03.jpg',
    ],
    'puerto-vallarta': [
      '/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_1.jpg',
      '/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_2.jpg',
      '/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_3.jpg',
      '/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_4.jpg',
      '/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_5.jpg',
      '/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_6.jpg',
      '/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_7.jpg',
      '/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_8.jpg',
      '/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_9.jpg',
      '/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_10.jpg',
      '/assets/PoolFotos/VTA/VAQUITA/V1.jpg',
      '/assets/PoolFotos/VTA/VAQUITA/V2.jpg',
      '/assets/PoolFotos/VTA/VAQUITA/V3.jpg',
      '/assets/PoolFotos/VTA/VAQUITA/V4.jpg',
      '/assets/PoolFotos/VTA/VAQUITA/V5.jpg',
      '/assets/PoolFotos/VTA/RAKATA/MT_Rakata_VTA_1.jpg',
    ],
    'general': [
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_01.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_02.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_03.jpg',
      '/assets/PoolFotos/CUN/MANDALA/MT_Mandala_Cancun_05.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_01.jpg',
      '/assets/PoolFotos/TULUM/BONBONNIERE/MT_Bonbinniere_02.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_1.jpg',
      '/assets/PoolFotos/PDC/MANDALA/MT_Mandala_PDC_2.jpg',
      '/assets/PoolFotos/CSL/MANDALA/Mandala_CSL_MT_Fotos1500x1000_1_V01.jpg',
      '/assets/PoolFotos/VTA/MANDALA/MT_Mandala_Vta_1.jpg',
    ],
  };
  
  // Función hash simple para mejor distribución
  const hashPostId = (id: string): number => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      const char = id.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };
  
  // Asignar imagen determinística con mejor distribución
  const imageList = categoryImages[post.category] || categoryImages['general'];
  const postIdNum = parseInt(post.id) || 1;
  // Usar hash para mejor distribución y evitar repeticiones
  const hashValue = hashPostId(post.id);
  const imageIndex = (postIdNum + hashValue) % imageList.length;
  const imageUrl = post.image || imageList[imageIndex] || imageList[0];
  
  // Generar alt text y title optimizados para SEO
  const imageAlt = generateImageAltText(imageUrl, content.title, category?.name);
  const imageTitle = generateImageTitle(imageUrl, content.title, category?.name);

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
