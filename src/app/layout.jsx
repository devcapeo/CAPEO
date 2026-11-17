import { SITE } from '@/config/site'
import { fontVariables } from '@/styles/fonts'
import Providers from '@/components/layout/Providers/Providers'
import Header from '@/components/layout/Header/Header'
import Footer from '@/components/layout/Footer/Footer'
import '@/styles/globals.css'

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.meaning}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.meaning}`,
    description: SITE.description,
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport = {
  themeColor: '#070B18',
  colorScheme: 'dark',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={fontVariables}>
      <body>
        <Providers>
          <Header />
          <main id="contenu">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
