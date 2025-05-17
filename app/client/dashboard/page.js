"use client"
import { useState, useEffect } from 'react'
import { useAuth } from '../../../utils/AuthContext'
import { useRouter } from 'next/navigation'
import { 
  LineChart, Search, BarChart2, ExternalLink, Link as LinkIcon,
  Loader2, ChevronUp, ChevronDown, Minus
} from 'lucide-react'
import { supabase } from '../../../utils/supabase'

export default function ClientDashboard() {
  const { user, loading: authLoading, isClient } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [clientData, setClientData] = useState(null)
  const [keywords, setKeywords] = useState([])
  const [backlinks, setBacklinks] = useState([])
  const [stats, setStats] = useState({
    totalKeywords: 0,
    totalBacklinks: 0,
    averageRanking: 0,
    improvedPositions: 0
  })

  // Protect this route - redirect if not logged in or not client
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login')
      } else if (!isClient()) {
        router.push('/admin')
      }
    }
  }, [user, authLoading, router, isClient])

  // Fetch client data
  useEffect(() => {
    if (user && isClient()) {
      fetchClientData()
    }
  }, [user])

  const fetchClientData = async () => {
    try {
      setLoading(true)
      
      // Get client ID from user metadata
      const clientId = user.user_metadata.client_id
      
      if (!clientId) {
        console.error("No client ID found in user metadata")
        return
      }
      
      // Fetch client details
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single()
      
      if (clientError) throw clientError
      
      setClientData(clientData)
      
      // Fetch keywords
      const { data: keywordsData, error: keywordsError } = await supabase
        .from('keywords')
        .select('*')
        .eq('client_id', clientId)
        .order('current_position', { ascending: true })
        .limit(10)
      
      if (keywordsError) throw keywordsError
      
      setKeywords(keywordsData || [])
      
      // Fetch backlinks
      const { data: backlinksData, error: backlinksError } = await supabase
        .from('backlinks')
        .select('*')
        .eq('client_id', clientId)
        .order('acquired_date', { ascending: false })
        .limit(5)
      
      if (backlinksError) throw backlinksError
      
      setBacklinks(backlinksData || [])
      
      // Calculate stats
      if (keywordsData) {
        const totalKeywords = keywordsData.length
        const rankedKeywords = keywordsData.filter(k => k.current_position)
        const totalRanking = rankedKeywords.reduce((sum, k) => sum + k.current_position, 0)
        const averageRanking = rankedKeywords.length ? (totalRanking / rankedKeywords.length).toFixed(1) : 0
        
        const improvedPositions = keywordsData.filter(k => 
          k.previous_position && k.current_position && k.current_position < k.previous_position
        ).length
        
        setStats({
          totalKeywords,
          totalBacklinks: backlinksData?.length || 0,
          averageRanking,
          improvedPositions
        })
      }
      
    } catch (error) {
      console.error('Error fetching client data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPositionChangeIcon = (current, previous) => {
    if (!previous || current === previous) {
      return <Minus className="h-4 w-4 text-gray-400" />
    } else if (current < previous) {
      return <ChevronUp className="h-4 w-4 text-green-600" />
    } else {
      return <ChevronDown className="h-4 w-4 text-red-600" />
    }
  }

  const getPositionChange = (current, previous) => {
    if (!previous || current === previous) {
      return 0
    } else {
      return previous - current
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!isClient()) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Accès non autorisé</h2>
          <p className="mt-2 text-gray-600">Cette page est réservée aux clients.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {loading ? 'Chargement...' : `Tableau de bord de ${clientData?.name || 'votre site'}`}
            </h1>
            {clientData?.website && (
              <a 
                href={clientData.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center mt-1"
              >
                {clientData.website.replace(/(^\w+:|^)\/\//, '')}
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Mots-clés suivis</p>
                <p className="text-lg font-semibold text-gray-900">{stats.totalKeywords}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <BarChart2 className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Position moyenne</p>
                <p className="text-lg font-semibold text-gray-900">{stats.averageRanking}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <ChevronUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Positions améliorées</p>
                <p className="text-lg font-semibold text-gray-900">{stats.improvedPositions}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                <LinkIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Backlinks acquis</p>
                <p className="text-lg font-semibold text-gray-900">{stats.totalBacklinks}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Keywords Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Vos mots-clés</h2>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 flex justify-center">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
            ) : keywords.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Aucun mot-clé suivi pour le moment
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mot-clé
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position actuelle
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Évolution
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Meilleure position
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {keywords.map((keyword) => (
                    <tr key={keyword.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {keyword.keyword}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {keyword.current_position ? (
                          <span className="px-2 py-1 text-sm font-medium rounded bg-blue-100 text-blue-800">
                            {keyword.current_position}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">Non positionné</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getPositionChangeIcon(keyword.current_position, keyword.previous_position)}
                          <span className={`ml-1 ${
                            getPositionChange(keyword.current_position, keyword.previous_position) > 0 
                              ? 'text-green-600' 
                              : getPositionChange(keyword.current_position, keyword.previous_position) < 0 
                                ? 'text-red-600' 
                                : 'text-gray-500'
                          }`}>
                            {Math.abs(getPositionChange(keyword.current_position, keyword.previous_position)) > 0 
                              ? Math.abs(getPositionChange(keyword.current_position, keyword.previous_position)) 
                              : '—'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {keyword.best_position ? (
                          <span className="px-2 py-1 text-sm font-medium rounded bg-green-100 text-green-800">
                            {keyword.best_position}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {keywords.length > 0 && (
            <div className="px-6 py-3 bg-gray-50 text-right text-sm">
              <a href="#" className="text-blue-600 hover:text-blue-900">Voir tous les mots-clés →</a>
            </div>
          )}
        </div>

        {/* Backlinks Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Derniers backlinks acquis</h2>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 flex justify-center">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
            ) : backlinks.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Aucun backlink enregistré pour le moment
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Site source
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Page cible
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ancre
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date d'acquisition
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {backlinks.map((backlink) => (
                    <tr key={backlink.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a 
                          href={backlink.source_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          {backlink.source_url.replace(/(^\w+:|^)\/\//, '').replace(/\/$/, '').substring(0, 30)}
                          {backlink.source_url.length > 30 ? '...' : ''}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {backlink.target_url.replace(/(^\w+:|^)\/\//, '').replace(/\/$/, '').substring(0, 30)}
                        {backlink.target_url.length > 30 ? '...' : ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {backlink.anchor_text ? (
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
                            {backlink.anchor_text}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {backlink.do_follow ? (
                          <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs">DoFollow</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 text-xs">NoFollow</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(backlink.acquired_date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {backlinks.length > 0 && (
            <div className="px-6 py-3 bg-gray-50 text-right text-sm">
              <a href="#" className="text-blue-600 hover:text-blue-900">Voir tous les backlinks →</a>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}