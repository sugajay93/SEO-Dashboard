"use client"
import { useState } from 'react'
import { supabase } from '../../../utils/supabase'
import { Loader2, X } from 'lucide-react'

export default function BacklinkForm({ onClose, onSuccess, backlink = null, clients = [] }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    source_url: backlink?.source_url || '',
    target_url: backlink?.target_url || '',
    client_id: backlink?.client_id || '',
    anchor_text: backlink?.anchor_text || '',
    do_follow: backlink?.do_follow !== undefined ? backlink.do_follow : true,
    cost: backlink?.cost || '',
    acquired_date: backlink?.acquired_date || new Date().toISOString().split('T')[0],
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const validateUrl = (url) => {
    if (!url) return false
    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.source_url.trim()) {
      setError("L'URL source est obligatoire")
      return
    }
    
    if (!validateUrl(formData.source_url)) {
      setError("L'URL source n'est pas valide. Assurez-vous d'inclure http:// ou https://")
      return
    }
    
    if (!formData.target_url.trim()) {
      setError("L'URL de destination est obligatoire")
      return
    }
    
    if (!validateUrl(formData.target_url)) {
      setError("L'URL de destination n'est pas valide. Assurez-vous d'inclure http:// ou https://")
      return
    }
    
    if (!formData.client_id) {
      setError("Veuillez sélectionner un client")
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const dataToSubmit = {
        ...formData,
        cost: formData.cost === '' ? null : parseFloat(formData.cost)
      }
      
      if (backlink) {
        // Modification d'un backlink existant
        const { error } = await supabase
          .from('backlinks')
          .update({
            ...dataToSubmit,
            updated_at: new Date()
          })
          .eq('id', backlink.id)
        
        if (error) throw error
        
      } else {
        // Création d'un nouveau backlink
        const { error } = await supabase
          .from('backlinks')
          .insert([dataToSubmit])
        
        if (error) throw error
      }
      
      if (onSuccess) onSuccess()
      if (onClose) onClose()
      
    } catch (error) {
      console.error('Error saving backlink:', error)
      setError("Une erreur est survenue lors de l'enregistrement. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg relative max-h-[90vh] overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <X className="h-5 w-5" />
      </button>
      
      <h2 className="text-xl font-bold mb-6">
        {backlink ? 'Modifier le backlink' : 'Ajouter un nouveau backlink'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="client_id" className="form-label">
              Client <span className="text-red-500">*</span>
            </label>
            <select
              id="client_id"
              name="client_id"
              required
              value={formData.client_id}
              onChange={handleChange}
              className="form-input"
              disabled={loading}
            >
              <option value="">Sélectionner un client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="source_url" className="form-label">
              URL source <span className="text-red-500">*</span>
            </label>
            <input
              id="source_url"
              name="source_url"
              type="url"
              required
              value={formData.source_url}
              onChange={handleChange}
              className="form-input"
              disabled={loading}
              placeholder="https://www.example.com"
            />
            <p className="text-xs text-gray-500 mt-1">
              URL du site externe où se trouve le lien
            </p>
          </div>
          
          <div>
            <label htmlFor="target_url" className="form-label">
              URL de destination <span className="text-red-500">*</span>
            </label>
            <input
              id="target_url"
              name="target_url"
              type="url"
              required
              value={formData.target_url}
              onChange={handleChange}
              className="form-input"
              disabled={loading}
              placeholder="https://www.votresite.com/page"
            />
            <p className="text-xs text-gray-500 mt-1">
              URL de votre site vers laquelle pointe le lien
            </p>
          </div>
          
          <div>
            <label htmlFor="anchor_text" className="form-label">
              Texte d'ancre
            </label>
            <input
              id="anchor_text"
              name="anchor_text"
              type="text"
              value={formData.anchor_text}
              onChange={handleChange}
              className="form-input"
              disabled={loading}
              placeholder="ex: agence SEO Paris"
            />
          </div>
          
          <div className="flex items-center">
            <input
              id="do_follow"
              name="do_follow"
              type="checkbox"
              checked={formData.do_follow}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={loading}
            />
            <label htmlFor="do_follow" className="ml-2 block text-sm text-gray-900">
              Lien DoFollow
            </label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="acquired_date" className="form-label">
                Date d'acquisition
              </label>
              <input
                id="acquired_date"
                name="acquired_date"
                type="date"
                value={formData.acquired_date}
                onChange={handleChange}
                className="form-input"
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="cost" className="form-label">
                Coût (€)
              </label>
              <input
                id="cost"
                name="cost"
                type="number"
                step="0.01"
                min="0"
                value={formData.cost}
                onChange={handleChange}
                className="form-input"
                disabled={loading}
                placeholder="ex: 150.00"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              'Enregistrer'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}