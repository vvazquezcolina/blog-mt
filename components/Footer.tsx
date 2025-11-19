import Image from 'next/image';
import { getTranslations, type Locale } from '@/i18n';

interface FooterProps {
  locale: Locale;
}

export default function Footer({ locale }: FooterProps) {
  const t = getTranslations(locale);

  return (
    <footer className="site-footer">
      <div className="container" style={{ width: '100%', maxWidth: '100%' }}>
        <div className="sec_footer">
          <div className="cont_footer_mt">
            <Image
              src="https://mandalatickets.com/assets/img/logo_mt.png"
              alt="MandalaTickets"
              width={200}
              height={60}
              style={{ height: 'auto' }}
            />
          </div>
          <div className="cont_footer_redes">
            <a 
              href="https://www.facebook.com/Mandalatickets?mibextid=LQQJ4d" 
              title="Facebook"
              target="_blank"
              rel="noopener noreferrer"
              style={{ padding: '0px 5px' }}
            >
              <Image
                src="https://mandalatickets.com/assets/img/redes/facebook.png"
                alt="Facebook"
                width={35}
                height={35}
              />
            </a>
            <a 
              href="https://www.instagram.com/mandalatickets/?hl=es" 
              title="Instagram"
              target="_blank"
              rel="noopener noreferrer"
              style={{ padding: '0px 5px' }}
            >
              <Image
                src="https://mandalatickets.com/assets/img/redes/instagram.png"
                alt="Instagram"
                width={35}
                height={35}
              />
            </a>
            <a 
              href="https://wa.me/5215649802193" 
              title="WhatsApp"
              target="_blank"
              rel="noopener noreferrer"
              style={{ padding: '0px 5px' }}
            >
              <Image
                src="https://mandalatickets.com/assets/img/redes/whatsapp_blanco.png"
                alt="WhatsApp"
                width={35}
                height={35}
              />
            </a>
            <a 
              href="https://mandalatickets.com/info/contactanos/es" 
              title={t.footer.contact}
              target="_blank"
              rel="noopener noreferrer"
              style={{ padding: '0px 5px', marginTop: '-6px' }}
            >
              <i className="icon-mail" style={{ color: '#fff', fontWeight: 500, fontSize: '30px' }}>✉</i>
            </a>
          </div>
        </div>
        <div className="row footer_sec_in">
          <div className="col-md-4 footer_sec_cont">
            <h3 className="widget-title">{t.footer.mandalatickets}</h3>
            <a href="https://mandalatickets.com/info/privacidad/es" style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }} target="_blank" rel="noopener noreferrer">
              {t.footer.privacy}
            </a>
            <a href="https://mandalatickets.com/info/terminos/es" style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }} target="_blank" rel="noopener noreferrer">
              {t.footer.terms}
            </a>
            <a href="https://mandalatickets.com/info/faqs/es" style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }} target="_blank" rel="noopener noreferrer">
              {t.footer.faqs}
            </a>
            <a href="https://mandalatickets.com/info/contactanos/es" style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }} target="_blank" rel="noopener noreferrer">
              {t.footer.contact}
            </a>
          </div>
          <div className="col-md-4 footer_sec_cont">
            <h3 className="widget-title">{t.footer.paymentMethods}</h3>
            <Image
              src="https://mandalatickets.com/assets/img/metodos_pago.png"
              alt={t.footer.paymentMethods}
              width={210}
              height={60}
              style={{ width: '210px', height: 'auto' }}
            />
          </div>
          <div className="col-md-4 footer_sec_cont">
            <h3 className="widget-title">{t.footer.associations}</h3>
            <a 
              href="https://bonbonniere.mx/" 
              style={{ 
                textDecoration: 'none',
                fontSize: '16px',
                color: '#fff',
                display: 'block',
                marginBottom: '0.5rem'
              }} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Bonbonniere Tulum ®
            </a>
            <a 
              href="https://tehmplo.com/" 
              style={{ 
                textDecoration: 'none',
                fontSize: '16px',
                color: '#fff',
                display: 'block',
                marginBottom: '0.5rem'
              }} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Tehmplo Tulum ®
            </a>
            <a 
              href="https://mandalatickets.com/en/tulum/disco/Vagalume" 
              style={{ 
                textDecoration: 'none',
                fontSize: '16px',
                color: '#fff',
                display: 'block',
                marginBottom: '0.5rem'
              }} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Vagalume ®
            </a>
          </div>
        </div>
      </div>
      <div className="container" style={{ width: '100%', maxWidth: '100%' }}>
        <div className="row" style={{ marginTop: '1.5rem', paddingTop: '0.5rem' }}>
          <div className="col-md-12" style={{ display: 'flex', justifyContent: 'center' }}>
            <a 
              href="https://www.trustpilot.com/review/mandalatickets.com" 
              title="Trustpilot"
              style={{ width: '11%', minWidth: '150px' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="https://mandalatickets.com/assets/img/trustpilot.svg"
                alt="Trustpilot"
                width={150}
                height={50}
                style={{ width: '100%', height: 'auto' }}
              />
            </a>
          </div>
        </div>
      </div>
      <div className="container" style={{ width: '100%', maxWidth: '100%' }}>
        <div className="row" style={{ marginTop: '1rem', paddingTop: '0.5rem' }}>
          <div className="col-md-12">
            <div className="footer-copyright f_copy_web" style={{
              marginBottom: '1rem',
              fontSize: '14px',
              width: '100%',
              paddingTop: '0.5rem',
              paddingBottom: '0px',
              display: 'flex',
              justifyContent: 'center',
              color: '#fff'
            }}>
              {t.footer.copyright}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

