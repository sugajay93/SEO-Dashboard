import AdminLayout from '@/components/layout/AdminLayout'
import { 
  BarChart3, TrendingUp, ExternalLink, Users, FileText, 
  Calendar, ArrowUp, ArrowDown, AlertCircle 
} from 'lucide-react'

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard Admin</h2>
      
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm">Clients actifs</p>
              <h3 className="text-2xl font-bold">24</h3>
            </div>
            <div className="bg-primary-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <ArrowUp className="h-4 w-4 mr-1" />
            <span>3 nouveaux ce mois</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm">Mots-clés suivis</p>
              <h3 className="text-2xl font-bold">1,243</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <ArrowUp className="h-4 w-4 mr-1" />
            <span>152 en progression</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm">Backlinks ajoutés</p>
              <h3 className="text-2xl font-bold">87</h3>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <ExternalLink className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <ArrowUp className="h-4 w-4 mr-1" />
            <span>12 ce mois-ci</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm">Rapports générés</p>
              <h3 className="text-2xl font-bold">36</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-orange-600">
            <Calendar className="h-4 w-4 mr-1" />
            <span>5 à faire cette semaine</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Vue d'ensemble des performances</h3>
            <div className="flex space-x-2">
              <select className="text-sm rounded border-gray-300 focus:border-primary-500 focus:ring focus:ring-primary-200">
                <option value="30days">30 derniers jours</option>
                <option value="90days">3 derniers mois</option>
                <option value="6months">6 derniers mois</option>
              </select>
            </div>
          </div>
          
          <div className="h-64 flex items-center justify-center">
            <div className="w-full h-full bg-gray-50 rounded border border-gray-100 flex items-center justify-center">
              <BarChart3 className="h-16 w-16 text-gray-300" />
              <span className="ml-3 text-gray-400">Graphique d'évolution des positions</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tâches en attente</h3>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <AlertCircle className="h-5 w-5 text-orange-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Importer positions client BestGroup</p>
                <p className="text-xs text-gray-500 mt-1">Échéance: Aujourd'hui</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Envoyer rapport mensuel TechSolutions</p>
                <p className="text-xs text-gray-500 mt-1">En retard: 2 jours</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <AlertCircle className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Valider stratégie de backlinks DigitalImpact</p>
                <p className="text-xs text-gray-500 mt-1">Échéance: 3 jours</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <AlertCircle className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Analyse concurrentielle HotelResort</p>
                <p className="text-xs text-gray-500 mt-1">Échéance: 5 jours</p>
              </div>
            </div>
          </div>
          
          <button className="mt-5 w-full text-center py-2 text-sm text-primary-600 hover:text-primary-800 font-medium">
            Voir toutes les tâches →
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Clients récemment actifs</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prestation</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière activité</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                      TG
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">TechGroup</div>
                      <div className="text-sm text-gray-500">techgroup.com</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">SEO Complet</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Il y a 2 heures</div>
                  <div className="text-sm text-gray-500">Consultation dashboard</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600">+12% positions</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Actif
                  </span>
                </td>
              </tr>
              
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                      FS
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">FashionStyle</div>
                      <div className="text-sm text-gray-500">fashionstyle.fr</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Netlinking</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Hier</div>
                  <div className="text-sm text-gray-500">Téléchargement rapport</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600">+5% positions</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Actif
                  </span>
                </td>
              </tr>
              
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                      HR
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">HôtelResort</div>
                      <div className="text-sm text-gray-500">hotel-resort.com</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">SEO International</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">3 jours</div>
                  <div className="text-sm text-gray-500">Consultation backlinks</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-red-600">-2% positions</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    En cours
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}