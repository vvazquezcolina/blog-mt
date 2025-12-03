'use client';

interface SafeImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
}

export default function SafeImage({ src, alt, title, className, style, loading = 'lazy' }: SafeImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      title={title}
      className={className}
      style={style}
      loading={loading}
      onError={(e) => {
        const img = e.target as HTMLImageElement;
        if (!(img as any).__errorHandled) {
          (img as any).__errorHandled = true;
          img.style.display = 'none';
        }
      }}
    />
  );
}

