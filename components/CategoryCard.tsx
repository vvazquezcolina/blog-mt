import Link from 'next/link';
import { Category } from '@/data/blogPosts';
import { type Locale } from '@/i18n';

interface CategoryCardProps {
  category: Category;
  locale: Locale;
}

export default function CategoryCard({ category, locale }: CategoryCardProps) {
  return (
    <Link href={`/${locale}/categorias/${category.id}`}>
      <div className="category-card" style={{ borderTopColor: category.color }}>
        <h3>{category.name}</h3>
        <p>{category.description}</p>
      </div>
    </Link>
  );
}

