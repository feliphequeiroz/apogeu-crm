import './globals.css'
import { ThemeProvider } from 'next-themes'
import { Open_Sans } from 'next/font/google'

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Apogeu CRM',
  description: 'CRM para consultores de automação WhatsApp',
  
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
        
        <meta name="application-name" content="Apogeu CRM" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Apogeu CRM" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={openSans.className} suppressHydrationWarning>
        {/* ✅ CORRIGIDO: Adicionado disableTransitionOnChange para evitar flicker ao alternar temas */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}