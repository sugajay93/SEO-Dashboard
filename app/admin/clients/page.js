"use client"
import { useState, useEffect } from 'react'
import { useAuth } from '../../../utils/AuthContext'
import { useRouter } from 'next/navigation'
import { 
  Users, Plus, Loader2, Trash2, Edit, ArrowUpDown, 
  Filter, Mail, Key
} from 'lucide-react'
import { supabase } from '../../../utils/supabase'
import ClientForm from '../../clients/ClientForm'
import ClientUserForm from './ClientUserForm'

export default function ClientsPage() {
  const { user, loading: authLoading, isAdmin } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState([])
  const [showAddClient, setShowAddClient] = useState(false)
  const [showAddUser, setShowAddUser] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [sortField, setSortField] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [filterStatus, setFilterStatus] = useState('all')

  // Protect this route - redirect if not logged in or not admin
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login')
      } else if (!isAdmin()) {
        router.push('/client/dashboard')
      }
    }
  }, [user, authLoading, router, isAdmin])

  // Fetch data from Supabase
  useEffect(() => {
    if (user && isAdmin()) {
      fetchClients()
    }
  }, [user, sortField, sortOrder, filterStatus])

  const fetchClients = async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('clients')
        .select('*')
        .order(sortField, { ascending: sortOrder === 'asc' })
      
      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      
      // Get user account information for each client
      const clientsWithUsers = await Promise.all(data.map(async (client) => {
        if (client.auth_user_id) {
          try {
            const { data: userData, error: userError } = await supabase
              .from('user_profiles')
              .select('email')
              .eq('id', client.auth_user_id)
              .single()
            
            if (!userError && userData) {
              return { ...client, user_email: userData.email }
            }
          } catch (e) {
            console.error("Error fetching user data for client", e)
          }
        }
        return client
      }))
      
      setClients(clientsWithUsers || [])
    } catch (error) {
      console.error('Error fetching clients:', error)
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
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) return
    
    try {
      setLoading(true)
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      fetchClients()
    } catch (error) {
      console.error('Error deleting client:', error)
      alert('Une erreur est survenue lors de la suppression')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (client) => {
    setSelectedClient(client)
    setShowAddClient(true)
  }

  const handleAddUserAccount = (client) => {
    setSelectedClient(client)
    setShowAddUser(true)
  }

  const closeClientForm = () => {
    setShowAddClient(false)
    setSelectedClient(null)
  }

  const closeUserForm = () => {
    setShowAddUser(false)
    setSelectedClient(null)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
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

  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Accès non autorisé</h2>
          <p className="mt-2 text-gray-600">Vous n'avez pas les droits pour accéder à cette page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Gestion des clients</h1>
          <button 
            className="btn btn-primary flex items-center"
            onClick={() => setShowAddClient(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un client
          </button>
        </div>

        {/* Client Form Modal */}
        {showAddClient && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-2xl">
              <ClientForm 
                onClose={closeClientForm} 
                onSuccess={fetchClients}
                client={selectedClient}
              />
            </div>
          </div>
        )}

        {/* User Account Form Modal */}
        {showAddUser && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-2xl">
              <ClientUserForm 
                onClose={closeUserForm} 
                onSuccess={fetchClients}
                client={selectedClient}
              />
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <div>
              <label htmlFor="filterStatus" className="text-sm text-gray-500 mr-2">Statut:</label>
              <select 
                id="filterStatus" 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="all">Tous</option>
                <option value="active">Actifs</option>
                <option value="pending">En attente</option>
                <option value="inactive">Inactifs</option>
              </select>
            </div>
          </div>
        </div>

        {/* Clients Table */}
        <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Nom
                      {sortField === 'name' && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Site web
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Statut
                      {sortField === 'status' && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Compte utilisateur
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center">
                      Date d'ajout
                      {sortField === 'created_at' && (
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
                ) : clients.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      Aucun client n'a été trouvé
                    </td>
                  </tr>
                ) : (
                  clients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{client.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {client.website ? (
                          <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                            {client.website.replace(/(^\w+:|^)\/\//, '').replace(/\/$/, '')}
                          </a>
                        ) : (
                          <span className="text-gray-400 italic">Non renseigné</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {client.contact_email && (
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1 text-gray-400" />
                            {client.contact_email}
                          </div>
                        )}
                        {client.contact_phone && (
                          <div>{client.contact_phone}</div>
                        )}
                        {!client.contact_email && !client.contact_phone && (
                          <span className="text-gray-400 italic">Non renseigné</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          client.status === 'active' ? 'bg-green-100 text-green-800' :
                          client.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {client.status === 'active' ? 'Actif' :
                           client.status === 'pending' ? 'En attente' :
                           'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {client.auth_user_id ? (
                          <div className="flex items-center text-sm text-gray-700">
                            <Key className="h-4 w-4 mr-1 text-green-500" />
                            {client.user_email || "Compte actif"}
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddUserAccount(client)}
                            className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                          >
                            Créer un accès
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(client.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => handleEdit(client)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Modifier"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(client.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Supprimer"
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