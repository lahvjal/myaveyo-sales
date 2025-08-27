import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Aveyo Campus - Your Career, Your Pace',
  description: 'Join Aveyo Campus and take control of your career journey',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
