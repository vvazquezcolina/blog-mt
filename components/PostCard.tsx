import Link from 'next/link';
import { BlogPost, getCategoryById } from '@/data/blogPosts';
import { type Locale } from '@/i18n';

interface PostCardProps {
  post: BlogPost;
  featured?: boolean;
  locale: Locale;
}

export default function PostCard({ post, featured = false, locale }: PostCardProps) {
  const category = getCategoryById(post.category);
  const cardClass = featured ? 'post-card featured-post' : 'post-card';

  return (
    <Link href={`/${locale}/posts/${post.slug}`}>
      <div className={cardClass}>
        <div className="post-image image-placeholder">
          <div className="placeholder-content">
            <span className="placeholder-icon">📷</span>
            {featured ? (
              <>
                <span className="placeholder-text">640px × 300px</span>
                <span className="placeholder-subtext">Featured Post Image<br/>1280 × 600px recommended (2x)</span>
              </>
            ) : (
              <>
                <span className="placeholder-text">365px × 200px</span>
                <span className="placeholder-subtext">Post Card Image<br/>Min: 320px × 200px</span>
              </>
            )}
          </div>
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
          <h2 className="post-title">{post.title}</h2>
          <p className="post-excerpt">{post.excerpt}</p>
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

