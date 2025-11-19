import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { defaultLocale } from '@/i18n/config';

export default function CategoryNotFound() {
  return (
    <>
      <Header locale={defaultLocale} />
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 0',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '6rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
          404
        </h1>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-dark)' }}>
          Categoría no encontrada
        </h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '2rem', maxWidth: '500px' }}>
          La categoría que buscas no existe.
        </p>
        <Link 
          href="/categorias"
          style={{
            display: 'inline-block',
            padding: '1rem 2rem',
            background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
            color: 'var(--white)',
            borderRadius: '8px',
            fontWeight: 600,
            textDecoration: 'none'
          }}
        >
          Ver Todas las Categorías
        </Link>
      </div>
      <Footer locale={defaultLocale} />
    </>
  );
}



