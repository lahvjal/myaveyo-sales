import type { Metadata } from 'next'
import './globals.css'
import { ChatProvider } from '@/components/chat/ChatProvider'

// app/layout.tsx
export const metadata = {
  metadataBase: new URL('https://your-domain.com'),
  title: {
    default: 'Aveyo Sales',
    template: '%s | Aveyo Sales',
  },
  description: 'Earn more with Aveyo. Real numbers, real incentives, real freedom.',
  openGraph: {
    type: 'website',
    url: '/',
    title: 'Aveyo Sales',
    description: 'Earn more with Aveyo. Real numbers, real incentives, real freedom.',
    siteName: 'Aveyo Sales',
    images: [
      { url: '/images/Alpha Aveyo-4.jpeg', width: 1200, height: 630, alt: 'Aveyo Sales' },
    ],
  },
  icons: {
    icon: [
      // { url: '/favicon.ico' },
      { url: '/images/favicon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [{ url: '/images/favicon.png', sizes: '180x180', type: 'image/png' }],
  },
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ChatProvider>
          {children}
        </ChatProvider>
      </body>
    </html>
  )
}
