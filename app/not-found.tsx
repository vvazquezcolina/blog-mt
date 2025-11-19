import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
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
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--white)' }}>
          Página no encontrada
        </h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '2rem', maxWidth: '500px' }}>
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <Link 
          href="/"
          className="cta-button"
          style={{
            display: 'inline-block',
            padding: '1rem 2rem',
            background: 'linear-gradient(290deg, rgb(101, 247, 238) 0%, rgb(26, 105, 217) 90%)',
            color: 'var(--white)',
            borderRadius: '8px',
            textDecoration: 'none'
          }}
        >
          Volver al Inicio
        </Link>
      </div>
      <Footer />
    </>
  );
}

