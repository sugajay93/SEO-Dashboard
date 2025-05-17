"use client"
import Link from 'next/link'
import { LineChart, Menu, X, LogOut, User, Users, Search, ExternalLink, LayoutDashboard, Settings } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../utils/AuthContext'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout, isAdmin, isClient } = useAuth()
  const pathname = usePathname()

  // Define navigation links based on role
  const getNavLinks = () => {
    if (isAdmin()) {
      return [
        { href: '/admin', label: 'Clients', icon: <Users className="h-4 w-4 mr-2" /> },
        { href: '/admin/keywords', label: 'Mots-clés', icon: <Search className="h-4 w-4 mr-2" /> },
        { href: '/admin/backlinks', label: 'Backlinks', icon: <ExternalLink className="h-4 w-4 mr-2" /> },
        { href: '/admin/settings', label: 'Paramètres', icon: <Settings className="h-4 w-4 mr-2" /> },
      ]
    } else if (isClient()) {
      return [
        { href: '/client/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
        { href: '/client/keywords', label: 'Mots-clés', icon: <Search className="h-4 w-4 mr-2" /> },
        { href: '/client/backlinks', label: 'Backlinks', icon: <ExternalLink className="h-4 w-4 mr-2" /> },
      ]
    }
    return []
  }

  const navLinks = getNavLinks()

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href={user ? (isAdmin() ? '/admin' : '/client/dashboard') : '/'} className="flex items-center">
          <LineChart className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">CRM & Dashboard SEO</h1>
        </Link>
        
        <div className="hidden md:flex space-x-1">
          {user ? (
            <>
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                    pathname === link.href 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
              <button onClick={logout} className="btn btn-secondary flex items-center ml-2">
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-primary">
                Connexion
              </Link>
              <Link href="/admin/setup" className="btn btn-secondary">
                Configuration admin
              </Link>
            </>
          )}
        </div>
        
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-2 pt-2 pb-4 space-y-1">
          {user ? (
            <>
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                    pathname === link.href 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
              <button 
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }} 
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Connexion
              </Link>
              <Link 
                href="/admin/setup" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Configuration admin
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}