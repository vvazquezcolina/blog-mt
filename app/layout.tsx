import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Blog MandalaTickets - Eventos, Fiestas y Vida Nocturna en México',
  description: 'Descubre los mejores eventos, fiestas y vida nocturna en Cancún, Tulum, Playa del Carmen, Los Cabos y Puerto Vallarta. Guías, consejos y entrevistas exclusivas.',
  icons: {
    icon: '/assets/img/favicon.png',
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
        {/* Para Acumin Variable desde Adobe Fonts, descomenta y agrega tu kit ID: */}
        {/* <link rel="stylesheet" href="https://use.typekit.net/[tu-kit-id].css" /> */}
      </head>
      <body>{children}</body>
    </html>
  )
}

