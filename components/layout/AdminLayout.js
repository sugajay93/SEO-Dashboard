"use client"
import { useState } from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { 
  LineChart, Users, ExternalLink, FileText, BarChart, 
  LogOut, Menu, X, Settings, ChevronDown, Search
} from 'lucide-react'

export default function AdminLayout({ children }) {
  const { data: session } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" 
          onClick={() => setSidebarOpen(false)}
        ></div>

        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-primary-700 transform ease-in-out duration-300">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Fermer la barre latérale</span>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <LineChart className="h-8 w-8 text-white" />
              <span className="ml-2 text-white font-bold text-xl">
                SEO CRM Admin
              </span>
            </div>

            <nav className="mt-5 px-2 space-y-1">
              <Link href="/admin/dashboard" className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-white bg-primary-800">
                <BarChart className="mr-4 h-6 w-6 text-primary-300" />
                Dashboard
              </Link>
              <Link href="/admin/clients" className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-primary-100 hover:text-white hover:bg-primary-600">
                <Users className="mr-4 h-6 w-6 text-primary-300" />
                Clients
              </Link>
              <Link href="/admin/positions" className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-primary-100 hover:text-white hover:bg-primary-600">
                <LineChart className="mr-4 h-6 w-6 text-primary-300" />
                Positions SEO
              </Link>
              <Link href="/admin/backlinks" className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-primary-100 hover:text-white hover:bg-primary-600">
                <ExternalLink className="mr-4 h-6 w-6 text-primary-300" />
                Backlinks
              </Link>
              <Link href="/admin/documents" className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-primary-100 hover:text-white hover:bg-primary-600">
                <FileText className="mr-4 h-6 w-6 text-primary-300" />
                Documents
              </Link>
            </nav>
          </div>

          <div className="flex-shrink-0 flex border-t border-primary-800 p-4">
            <button 
              onClick={() => signOut()}
              className="flex items-center text-primary-100 hover:text-white"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-primary-700">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <LineChart className="h-8 w-8 text-white" />
              <span className="ml-2 text-white font-bold text-xl">
                SEO CRM Admin
              </span>
            </div>

            <nav className="mt-5 flex-1 px-2 space-y-1">
              <Link href="/admin/dashboard" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-white bg-primary-800">
                <BarChart className="mr-3 h-5 w-5 text-primary-300" />
                Dashboard
              </Link>
              <Link href="/admin/clients" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-primary-100 hover:text-white hover:bg-primary-600">
                <Users className="mr-3 h-5 w-5 text-primary-300" />
                Clients
              </Link>
              <Link href="/admin/positions" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-primary-100 hover:text-white hover:bg-primary-600">
                <LineChart className="mr-3 h-5 w-5 text-primary-300" />
                Positions SEO
              </Link>
              <Link href="/admin/backlinks" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-primary-100 hover:text-white hover:bg-primary-600">
                <ExternalLink className="mr-3 h-5 w-5 text-primary-300" />
                Backlinks
              </Link>
              <Link href="/admin/documents" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-primary-100 hover:text-white hover:bg-primary-600">
                <FileText className="mr-3 h-5 w-5 text-primary-300" />
                Documents
              </Link>
            </nav>
          </div>

          <div className="flex-shrink-0 flex border-t border-primary-800 p-4">
            <button 
              onClick={() => signOut()}
              className="flex items-center text-primary-100 hover:text-white"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Ouvrir la barre latérale</span>
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 flex justify-between items-center">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Panel
              </h1>
            </div>
            
            <div className="ml-4 flex items-center md:ml-6">
              <div className="mr-3 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="search"
                  placeholder="Rechercher..."
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                />
              </div>
              
              <div className="ml-3 relative">
                <div>
                  <button
                    className="max-w-xs bg-gray-100 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  >
                    <span className="sr-only">Ouvrir le menu utilisateur</span>
                    <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary-700 text-white">
                      {session?.user?.name?.charAt(0) || 'A'}
                    </div>
                    <span className="ml-2 text-gray-700 hidden md:block">{session?.user?.name || 'Admin'}</span>
                    <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
                  </button>
                </div>
                
                {profileDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Link href="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setProfileDropdownOpen(false)}>
                      Profil
                    </Link>
                    <Link href="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setProfileDropdownOpen(false)}>
                      Paramètres
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}