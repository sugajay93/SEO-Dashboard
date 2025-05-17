import Link from 'next/link'
import { LineChart } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="flex justify-center">
            <LineChart className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="mt-6 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            CRM & Dashboard SEO
          </h1>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Gérez vos clients et suivez les performances SEO de leurs sites web
          </p>
        </div>

        <div className="mt-16 flex flex-col items-center gap-8">
          <Link 
            href="/login" 
            className="btn btn-primary py-3 px-8 text-lg shadow-md hover:shadow-lg"
          >
            Connexion
          </Link>
          
          <Link 
            href="/admin/setup" 
            className="text-blue-600 hover:text-blue-800 hover:underline text-lg font-medium"
          >
            Configuration admin
          </Link>
        </div>
        
        <div className="mt-24 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Gestion des clients</h3>
            <p className="text-gray-600">Créez et gérez facilement les profils de vos clients avec toutes leurs informations.</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Suivi des mots-clés</h3>
            <p className="text-gray-600">Suivez les positions des mots-clés de vos clients et visualisez leur évolution.</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Analyse des backlinks</h3>
            <p className="text-gray-600">Surveillez les backlinks de vos clients et identifiez de nouvelles opportunités.</p>
          </div>
        </div>
      </div>
    </main>
  )
}