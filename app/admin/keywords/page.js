"use client"
import { useState, useEffect } from 'react'
import { useAuth } from '../../../utils/AuthContext'
import { useRouter } from 'next/navigation'
import { 
  Search, Plus, Loader2, Trash2, Edit, ArrowUpDown, 
  Filter, ChevronUp, ChevronDown, Minus, BarChart2
} from 'lucide-react'
import { supabase } from '../../../utils/supabase'
import KeywordForm from './KeywordForm'

export default function KeywordsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [keywords, setKeywords] = useState([])
  const [clients, setClients] = useState([])
  const [showAddKeyword, setShowAddKeyword] = useState(false)
  const [selectedKeyword, setSelectedKeyword] = useState(null)
  const [sortField, setSortField] = useState('keyword')
  const [sortOrder, setSortOrder] = useState('asc')
  const [filterClient, setFilterClient] = useState('all')

  // Protect this route - redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // Fetch data from Supabase
  useEffect(() => {
    if (user) {
      fetchClients()
      fetchKeywords()
    }
  }, [user, sortField, sortOrder, filterClient])

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name')
        .eq('user_id', user.id)
        .order('name')
      
      if (error) throw error
      
      setClients(data || [])
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }

  const fetchKeywords = async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('keywords')
        .select(`
          *,
          clients:client_id (
            id,
            name,
            website
          )
        `)
        .order(sortField, { ascending: sortOrder === 'asc' })
      
      if (filterClient !== 'all') {
        query = query.eq('client_id', filterClient)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      
      setKeywords(data || [])
    } catch (error) {
      console.error('Error fetching keywords:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle sort order if same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      // Default to ascending for new field
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce mot-clé ?')) return
    
    try {
      setLoading(true)
      const { error } = await supabase
        .from('keywords')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      fetchKeywords()
    } catch (error) {
      console.error('Error deleting keyword:', error)
      alert('Une erreur est survenue lors de la suppression')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (keyword) => {
    setSelectedKeyword(keyword)
    setShowAddKeyword(true)
  }

  const closeForm = () => {
    setShowAddKeyword(false)
    setSelectedKeyword(null)
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

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Gestion des mots-clés</h1>
          <button 
            className="btn btn-primary flex items-center"
            onClick={() => setShowAddKeyword(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un mot-clé
          </button>
        </div>

        {/* Keyword Form Modal */}
        {showAddKeyword && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-2xl">
              <KeywordForm 
                onClose={closeForm} 
                onSuccess={fetchKeywords}
                keyword={selectedKeyword}
                clients={clients}
              />
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <div>
              <label htmlFor="filterClient" className="text-sm text-gray-500 mr-2">Client:</label>
              <select 
                id="filterClient" 
                value={filterClient}
                onChange={(e) => setFilterClient(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="all">Tous les clients</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Keywords Table */}
        <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('keyword')}
                  >
                    <div className="flex items-center">
                      Mot-clé
                      {sortField === 'keyword' && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  >
                    <div className="flex items-center">
                      Client
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('current_position')}
                  >
                    <div className="flex items-center">
                      Position
                      {sortField === 'current_position' && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Évolution
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('best_position')}
                  >
                    <div className="flex items-center">
                      Meilleure position
                      {sortField === 'best_position' && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">
                      <Loader2 className="h-6 w-6 text-blue-600 animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : keywords.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      Aucun mot-clé n'a été trouvé
                    </td>
                  </tr>
                ) : (
                  keywords.map((keyword) => (
                    <tr key={keyword.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{keyword.keyword}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{keyword.clients?.name || 'Client inconnu'}</div>
                        {keyword.clients?.website && (
                          <div className="text-xs text-gray-500">{keyword.clients.website.replace(/(^\w+:|^)\/\//, '')}</div>
                        )}
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
                          <span className="text-gray-400 italic">Non défini</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => handleEdit(keyword)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(keyword.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}