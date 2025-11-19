import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import { blogPosts } from '@/data/blogPosts';
import { defaultLocale } from '@/i18n/config';

export default function AllPostsPage() {
  return (
    <>
      <Header locale={defaultLocale} />
      
      <section className="category-header">
        <div className="container">
          <h1>Todos los Artículos</h1>
          <p>Explora nuestra colección completa de {blogPosts.length} artículos</p>
        </div>
      </section>

      <section className="posts-section">
        <div className="container">
          <div className="posts-grid">
            {blogPosts.map((post) => (
              <PostCard key={post.id} post={post} locale={defaultLocale} />
            ))}
          </div>
        </div>
      </section>

      <Footer locale={defaultLocale} />
    </>
  );
}



