"use client"
import { useState, useEffect } from 'react'
import { useAuth } from '../../utils/AuthContext'
import { useRouter } from 'next/navigation'
import { LineChart, Users, BarChart2, ExternalLink, Search, Plus, Loader2 } from 'lucide-react'
import { supabase } from '../../utils/supabase'

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalClients: 0,
    totalKeywords: 0,
    totalBacklinks: 0,
    averageRanking: 0
  })
  const [clients, setClients] = useState([])

  // Protect this route - redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // Fetch data from Supabase
  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (clientsError) throw clientsError
      
      // For now, use mock data for stats
      // In a real app, we would calculate these from actual data
      setStats({
        totalClients: clientsData?.length || 0,
        totalKeywords: 546,
        totalBacklinks: 287,
        averageRanking: 14.8
      })
      
      setClients(clientsData || [])
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
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
    <div className="min-h-screen bg-gray-50">
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Bienvenue, {user.user_metadata?.full_name || user.email}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex">
              <button className="btn btn-primary flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un client
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          {loading ? (
            <div className="mt-8 flex justify-center">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Clients</dt>
                        <dd>
                          <div className="text-lg font-semibold text-gray-900">{stats.totalClients}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                      <Search className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Mots-clés suivis</dt>
                        <dd>
                          <div className="text-lg font-semibold text-gray-900">{stats.totalKeywords}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                      <ExternalLink className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Backlinks</dt>
                        <dd>
                          <div className="text-lg font-semibold text-gray-900">{stats.totalBacklinks}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                      <BarChart2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Position moyenne</dt>
                        <dd>
                          <div className="text-lg font-semibold text-gray-900">{stats.averageRanking}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Clients */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">Clients récents</h2>
            <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
              {loading ? (
                <div className="p-6 flex justify-center">
                  <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
              ) : clients.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {clients.map((client) => (
                    <li key={client.id}>
                      <a href={`/clients/${client.id}`} className="block hover:bg-gray-50">
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-blue-600 truncate">{client.name}</div>
                              <div className={`ml-2 inline-flex flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded-full ${
                                client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {client.status === 'active' ? 'Actif' : 'En attente'}
                              </div>
                            </div>
                            <div className="ml-2 flex-shrink-0 flex">
                              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <ExternalLink className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                <p>{client.website || 'Non spécifié'}</p>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <p>Ajouté le: {new Date(client.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">Aucun client pour le moment</p>
                  <button className="mt-4 btn btn-primary flex items-center mx-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter votre premier client
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}