import type { Metadata, Viewport } from 'next'
// import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { Providers } from '@/components/Providers'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import './globals.css'

// const inter = Inter({ 
//   subsets: ["latin"],
//   variable: '--font-inter',
//   display: 'swap',
// })

// const poppins = Poppins({ 
//   subsets: ["latin"],
//   weight: ['400', '500', '600', '700'],
//   variable: '--font-poppins',
//   display: 'swap',
// })

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'InterviewAI | Master Your Interviews with AI Coaching',
  description: 'Get personalized coaching from an AI interview assistant. Upload your resume, practice questions, and get real-time feedback to ace your interviews.',
  keywords: 'interview preparation, AI coaching, resume review, interview practice, career assistant',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://interviewai.com',
    title: 'InterviewAI | Master Your Interviews',
    description: 'Get personalized coaching from an AI interview assistant',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'InterviewAI - AI Interview Coach',
      },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased bg-background text-foreground">
        <ErrorBoundary>
          <Providers>
            {children}
            <Analytics />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}
