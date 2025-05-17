"use client"
import { useState, useEffect } from 'react'
import { useAuth } from '../../../utils/AuthContext'
import { useRouter } from 'next/navigation'
import { 
  Plus, Loader2, Trash2, Edit, ArrowUpDown, Filter, 
  Link as LinkIcon, Calendar, DollarSign, ExternalLink 
} from 'lucide-react'
import { supabase } from '../../../utils/supabase'
import BacklinkForm from './BacklinkForm'

export default function BacklinksPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [backlinks, setBacklinks] = useState([])
  const [clients, setClients] = useState([])
  const [showAddBacklink, setShowAddBacklink] = useState(false)
  const [selectedBacklink, setSelectedBacklink] = useState(null)
  const [sortField, setSortField] = useState('acquired_date')
  const [sortOrder, setSortOrder] = useState('desc')
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
      fetchBacklinks()
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

  const fetchBacklinks = async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('backlinks')
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
      
      setBacklinks(data || [])
    } catch (error) {
      console.error('Error fetching backlinks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle sort order if same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      // Default to descending for new field
      setSortField(field)
      setSortOrder('desc')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce backlink ?')) return
    
    try {
      setLoading(true)
      const { error } = await supabase
        .from('backlinks')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      fetchBacklinks()
    } catch (error) {
      console.error('Error deleting backlink:', error)
      alert('Une erreur est survenue lors de la suppression')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (backlink) => {
    setSelectedBacklink(backlink)
    setShowAddBacklink(true)
  }

  const closeForm = () => {
    setShowAddBacklink(false)
    setSelectedBacklink(null)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Non défini'
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return 'Non défini'
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des backlinks</h1>
          <button 
            className="btn btn-primary flex items-center"
            onClick={() => setShowAddBacklink(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un backlink
          </button>
        </div>

        {/* Backlink Form Modal */}
        {showAddBacklink && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-2xl">
              <BacklinkForm 
                onClose={closeForm} 
                onSuccess={fetchBacklinks}
                backlink={selectedBacklink}
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

        {/* Backlinks Table */}
        <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('source_url')}
                  >
                    <div className="flex items-center">
                      Source
                      {sortField === 'source_url' && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destination
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ancre
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('acquired_date')}
                  >
                    <div className="flex items-center">
                      Date d'acquisition
                      {sortField === 'acquired_date' && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('cost')}
                  >
                    <div className="flex items-center">
                      Coût
                      {sortField === 'cost' && (
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
                    <td colSpan="7" className="px-6 py-4 text-center">
                      <Loader2 className="h-6 w-6 text-blue-600 animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : backlinks.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      Aucun backlink n'a été trouvé
                    </td>
                  </tr>
                ) : (
                  backlinks.map((backlink) => (
                    <tr key={backlink.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a 
                          href={backlink.source_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <LinkIcon className="h-4 w-4 mr-1" />
                          {backlink.source_url.replace(/(^\w+:|^)\/\//, '').replace(/\/$/, '').substring(0, 30)}
                          {backlink.source_url.length > 30 ? '...' : ''}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                        <div className="text-xs text-gray-500 mt-1">
                          {backlink.do_follow ? (
                            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800">DoFollow</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">NoFollow</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a 
                          href={backlink.target_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-800"
                        >
                          {backlink.target_url.replace(/(^\w+:|^)\/\//, '').replace(/\/$/, '').substring(0, 30)}
                          {backlink.target_url.length > 30 ? '...' : ''}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{backlink.clients?.name || 'Client inconnu'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {backlink.anchor_text ? (
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">
                            {backlink.anchor_text}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">Non spécifié</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {formatDate(backlink.acquired_date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                          {formatCurrency(backlink.cost)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => handleEdit(backlink)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(backlink.id)}
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