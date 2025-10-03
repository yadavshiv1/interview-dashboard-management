import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import { SnackbarProvider } from '@/components/SnackbarProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Interview Management Dashboard',
  description: 'Manage interviews and candidate feedback',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SnackbarProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </SnackbarProvider>
      </body>
    </html>
  )
}