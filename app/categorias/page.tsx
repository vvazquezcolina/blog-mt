import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryCard from '@/components/CategoryCard';
import { categories } from '@/data/blogPosts';
import { defaultLocale } from '@/i18n/config';

export default function CategoriesPage() {
  return (
    <>
      <Header locale={defaultLocale} />
      
      <section className="category-header">
        <div className="container">
          <h1>Todas las Categorías</h1>
          <p>Explora nuestros artículos organizados por temas</p>
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <div className="categories-grid">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} locale={defaultLocale} />
            ))}
          </div>
        </div>
      </section>

      <Footer locale={defaultLocale} />
    </>
  );
}



