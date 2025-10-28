import './globals.css'

export const metadata = {
  title: 'Apogeu CRM',
  description: 'CRM para consultores de automação WhatsApp',
  
  // Favicon configuração semântica completa
  icons: {
    icon: [
      {
        url: 'https://apogeu.io/wp-content/uploads/2024/11/cropped-1082-1-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: 'https://apogeu.io/wp-content/uploads/2024/11/cropped-1082-1-192x192.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    shortcut: 'https://apogeu.io/wp-content/uploads/2024/11/cropped-1082-1-192x192.png',
    apple: [
      {
        url: 'https://apogeu.io/wp-content/uploads/2024/11/cropped-1082-1-192x192.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },

  // Open Graph para redes sociais
  openGraph: {
    title: 'Apogeu CRM',
    description: 'CRM para consultores de automação WhatsApp',
    images: [
      {
        url: 'https://apogeu.io/wp-content/uploads/2024/11/cropped-1082-1-192x192.png',
        width: 192,
        height: 192,
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary',
    title: 'Apogeu CRM',
    description: 'CRM para consultores de automação WhatsApp',
    images: ['https://apogeu.io/wp-content/uploads/2024/11/cropped-1082-1-192x192.png'],
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0066FF',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <meta charSet="utf-8" />
        {/* Meta tags PWA */}
        <meta name="application-name" content="Apogeu CRM" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Apogeu CRM" />
        {/* Manifest PWA */}
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body suppressHydrationWarning>
        <div className="min-h-screen bg-white">
          {children}
        </div>
      </body>
    </html>
  )
}