import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Blog MandalaTickets - Eventos, Fiestas y Vida Nocturna en México',
  description: 'Descubre los mejores eventos, fiestas y vida nocturna en Cancún, Tulum, Playa del Carmen, Los Cabos y Puerto Vallarta. Guías, consejos y entrevistas exclusivas.',
  icons: {
    icon: [
      { url: 'https://mandalatickets.com/assets/img/favicon_nuevo.ico', type: 'image/x-icon' },
      { url: 'https://mandalatickets.com/assets/img/favicon_nuevo.png', type: 'image/png' },
      { url: 'https://mandalatickets.com/assets/img/touch-icon-android.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: 'https://mandalatickets.com/assets/img/touch-icon-60.png', sizes: '60x60' },
      { url: 'https://mandalatickets.com/assets/img/touch-icon-120.png', sizes: '120x120' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
        {/* Favicons */}
        <link rel="icon" type="image/x-icon" href="https://mandalatickets.com/assets/img/favicon_nuevo.ico" />
        <link rel="icon" type="image/png" href="https://mandalatickets.com/assets/img/favicon_nuevo.png" />
        <link rel="icon" sizes="192x192" href="https://mandalatickets.com/assets/img/touch-icon-android.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="https://mandalatickets.com/assets/img/touch-icon-60.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="https://mandalatickets.com/assets/img/touch-icon-120.png" />
        <link rel="apple-touch-startup-image" href="https://mandalatickets.com/assets/img/start-up.png" />
        {/* Para Acumin Variable desde Adobe Fonts, descomenta y agrega tu kit ID: */}
        {/* <link rel="stylesheet" href="https://use.typekit.net/[tu-kit-id].css" /> */}
      </head>
      <body>{children}</body>
    </html>
  )
}

