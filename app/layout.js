import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '../utils/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CRM & Dashboard SEO',
  description: 'Gérez vos clients et leurs performances SEO',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}