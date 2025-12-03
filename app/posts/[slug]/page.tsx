import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { blogPosts, getCategoryById, findPostBySlug, getPostContent } from '@/data/blogPosts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { defaultLocale } from '@/i18n/config';
import { getMandalaTicketsUrl } from '@/utils/urlUtils';

interface PostPageProps {
  params: {
    slug: string;
  };
}

export default function PostPage({ params }: PostPageProps) {
  const post = findPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }

  const content = getPostContent(post, defaultLocale);
  const category = getCategoryById(post.category);

  return (
    <>
      <Header locale={defaultLocale} />
      
      <article style={{ padding: '4rem 0', background: '#000' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          {category && (
            <Link 
              href={`/categorias/${category.id}`}
              style={{ 
                display: 'inline-block',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                backgroundColor: category.color,
                color: 'var(--white)',
                fontSize: '0.875rem',
                fontWeight: 600,
                marginBottom: '1.5rem',
                textDecoration: 'none'
              }}
            >
              {category.name}
            </Link>
          )}
          
          <h1 style={{ 
            fontSize: '2.5rem', 
            marginBottom: '1rem',
            color: 'var(--white)',
            lineHeight: 1.2
          }}>
            {content.title}
          </h1>
          
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginBottom: '2rem',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.95rem'
          }}>
            <span>Por {post.author}</span>
            <span>•</span>
            <span>{new Date(post.date).toLocaleDateString('es-MX', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>

          <div style={{
            width: '100%',
            height: '400px',
            background: `linear-gradient(135deg, ${category?.color || '#FF6B6B'}, ${category?.color || '#45B7D1'}dd)`,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '5rem',
            marginBottom: '2rem'
          }}>
            🎉
          </div>

          <div style={{ 
            fontSize: '1.125rem',
            lineHeight: 1.8,
            color: 'var(--white)'
          }}>
            <p style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 500 }}>
              {content.excerpt}
            </p>
            
            <p style={{ marginBottom: '1.5rem' }}>
              Este artículo está en desarrollo. Próximamente encontrarás contenido completo sobre: <strong>{content.title}</strong>
            </p>
            
            <p style={{ marginBottom: '1.5rem' }}>
              Mientras tanto, no te pierdas nuestros eventos exclusivos en los mejores destinos de México. 
              Explora nuestras categorías para descubrir más contenido sobre eventos, guías de destinos, 
              consejos para asistentes y mucho más.
            </p>

            <div style={{
              marginTop: '3rem',
              padding: '2rem',
              background: '#1a1a1a',
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--white)' }}>¿Listo para vivir la experiencia?</h3>
              <a 
                href={getMandalaTicketsUrl(post.category, defaultLocale)} 
                target="_blank"
                rel="noopener noreferrer"
                className="cta-button"
                style={{
                  display: 'inline-block',
                  padding: '1rem 2rem',
                  background: 'linear-gradient(290deg, rgb(101, 247, 238) 0%, rgb(26, 105, 217) 90%)',
                  color: 'var(--white)',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 15px rgba(26, 105, 217, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(290deg, rgb(120, 250, 240) 0%, rgb(40, 120, 230) 90%)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(290deg, rgb(101, 247, 238) 0%, rgb(26, 105, 217) 90%)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Comprar Boletos Ahora
              </a>
            </div>
          </div>
        </div>
      </article>

      <Footer locale={defaultLocale} />
    </>
  );
}

