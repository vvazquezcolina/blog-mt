import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryCard from '@/components/CategoryCard';
import { categories } from '@/data/blogPosts';

export default function CategoriesPage() {
  return (
    <>
      <Header />
      
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
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}



