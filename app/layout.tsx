import './globals.css'
import { fontMono } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'
import { Providers } from '@/components/providers'
import { Viewport } from 'next'

export const metadata = {
  title: 'CODE SANDBOX',
  description: 'Write, compile, and run code in the browser'
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '0 0% 100%' },
    { media: '(prefers-color-scheme: dark)', color: '222.2 84% 4.9%' }
  ]
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('font-mono', 'antialiased', fontMono.variable)}>
        <Providers attribute="class" defaultTheme="system" enableSystem>
          <div
            className={cn(
              'flex',
              'justify-center',
              'items-center',
              'p-2',
              'w-full'
            )}
          >
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
