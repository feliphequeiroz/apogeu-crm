import './globals.css'

export const metadata = {
  title: 'Apogeu CRM',
  description: 'CRM para consultores de automação WhatsApp',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0066FF',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>
        <div className="min-h-screen bg-white">
          {children}
        </div>
      </body>
    </html>
  )
}