import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import { blogPosts, getCategoryById, isValidCategoryId } from '@/data/blogPosts';
import { notFound } from 'next/navigation';
import { defaultLocale } from '@/i18n/config';

interface CategoryPageProps {
  params: {
    categoryId: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  // Validar que el categoryId sea válido antes de buscar la categoría
  if (!isValidCategoryId(params.categoryId)) {
    notFound();
  }
  
  const category = getCategoryById(params.categoryId);
  
  if (!category) {
    notFound();
  }

  const categoryPosts = blogPosts.filter(post => post.category === params.categoryId);

  return (
    <>
      <Header locale={defaultLocale} />
      
      <section className="category-header" style={{ background: `linear-gradient(135deg, ${category.color} 0%, ${category.color}dd 100%)` }}>
        <div className="container">
          <h1>{category.name}</h1>
          <p>{category.description}</p>
        </div>
      </section>

      <section className="posts-section">
        <div className="container">
          <h2 className="section-title">Artículos en {category.name}</h2>
          {categoryPosts.length > 0 ? (
            <div className="posts-grid">
              {categoryPosts.map((post) => (
                <PostCard key={post.id} post={post} locale={defaultLocale} />
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.8)', padding: '2rem' }}>
              No hay artículos disponibles en esta categoría aún.
            </p>
          )}
        </div>
      </section>

      <Footer locale={defaultLocale} />
    </>
  );
}

