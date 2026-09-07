import type { Metadata, Viewport } from 'next'
import { Archivo, Public_Sans, Martian_Mono } from 'next/font/google'
import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'
import { CustomCursor } from '@/components/CustomCursor'
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp'
import { ChatWidget } from '@/components/ChatWidget'
import { COMPANY } from '@/lib/data/company'
import './globals.css'

/**
 * Type.
 *
 * Archivo is loaded with its width axis so the display face can be pushed to
 * 112 to 125 percent. Every other brand in this category reaches for condensed
 * type, which is exactly why this one does not: wide reads as container
 * stencil and truck livery, and it is unmistakably not a template.
 *
 * Public Sans carries body copy. It is a workhorse built for public documents,
 * which suits a site people read at a counter under pressure.
 *
 * Martian Mono is reserved for data: part numbers, phone numbers, counts.
 */
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
})

const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-public-sans',
  display: 'swap',
})

const martianMono = Martian_Mono({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-martian-mono',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://partsmall.co.za'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Parts-Mall Africa | Korean vehicle parts, supplied from a branch near you',
    template: '%s | Parts-Mall Africa',
  },
  description:
    'Parts-Mall Africa supplies Kia, Hyundai, Chevrolet, Ssangyong, Ford, Nissan and Toyota replacement parts through 33 branches across South Africa and 5 pan-African country points. Trade accounts, branch stock checks and wholesale supply.',
  keywords: [
    'car parts South Africa',
    'Korean car parts',
    'Kia parts',
    'Hyundai parts',
    'wholesale auto parts',
    'trade account car parts',
    'Parts-Mall',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    siteName: COMPANY.name,
    url: siteUrl,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Zoom is never disabled.
  maximumScale: 5,
  themeColor: '#16244a',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-ZA"
      className={`${archivo.variable} ${publicSans.variable} ${martianMono.variable}`}
    >
      <head>
        {/* Runs before first paint. Only once this lands does the scroll-reveal
            hidden state apply, so a blocked bundle leaves the page static
            rather than blank. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body className="min-h-[100dvh] antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-[var(--radius-base)] focus:bg-navy-900 focus:px-4 focus:py-3 focus:text-on-navy"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <CustomCursor />
        <FloatingWhatsApp />
        <ChatWidget />
      </body>
    </html>
  )
}
