"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../../../utils/supabase'
import { Loader2, X } from 'lucide-react'

export default function KeywordForm({ onClose, onSuccess, keyword = null, clients = [] }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    keyword: keyword?.keyword || '',
    client_id: keyword?.client_id || '',
    current_position: keyword?.current_position || '',
    previous_position: keyword?.previous_position || '',
    best_position: keyword?.best_position || '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: name.includes('position') ? (value === '' ? null : parseInt(value, 10)) : value 
    }))
  }

  // Update best position automatically if current position is better
  useEffect(() => {
    if (formData.current_position && 
        (!formData.best_position || formData.current_position < formData.best_position)) {
      setFormData(prev => ({
        ...prev,
        best_position: formData.current_position
      }))
    }
  }, [formData.current_position])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.keyword.trim()) {
      setError("Le mot-clé est obligatoire")
      return
    }
    
    if (!formData.client_id) {
      setError("Veuillez sélectionner un client")
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      if (keyword) {
        // Modification d'un mot-clé existant
        const { error } = await supabase
          .from('keywords')
          .update({
            ...formData,
            updated_at: new Date()
          })
          .eq('id', keyword.id)
        
        if (error) throw error
        
      } else {
        // Création d'un nouveau mot-clé
        const { error } = await supabase
          .from('keywords')
          .insert([formData])
        
        if (error) throw error
      }
      
      if (onSuccess) onSuccess()
      if (onClose) onClose()
      
    } catch (error) {
      console.error('Error saving keyword:', error)
      setError("Une erreur est survenue lors de l'enregistrement. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <X className="h-5 w-5" />
      </button>
      
      <h2 className="text-xl font-bold mb-6">
        {keyword ? 'Modifier le mot-clé' : 'Ajouter un nouveau mot-clé'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="keyword" className="form-label">
              Mot-clé <span className="text-red-500">*</span>
            </label>
            <input
              id="keyword"
              name="keyword"
              type="text"
              required
              value={formData.keyword}
              onChange={handleChange}
              className="form-input"
              disabled={loading}
              placeholder="ex: agence seo paris"
            />
          </div>
          
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="current_position" className="form-label">
                Position actuelle
              </label>
              <input
                id="current_position"
                name="current_position"
                type="number"
                min="1"
                value={formData.current_position === null ? '' : formData.current_position}
                onChange={handleChange}
                className="form-input"
                disabled={loading}
                placeholder="ex: 5"
              />
            </div>
            
            <div>
              <label htmlFor="previous_position" className="form-label">
                Position précédente
              </label>
              <input
                id="previous_position"
                name="previous_position"
                type="number"
                min="1"
                value={formData.previous_position === null ? '' : formData.previous_position}
                onChange={handleChange}
                className="form-input"
                disabled={loading}
                placeholder="ex: 8"
              />
            </div>
            
            <div>
              <label htmlFor="best_position" className="form-label">
                Meilleure position
              </label>
              <input
                id="best_position"
                name="best_position"
                type="number"
                min="1"
                value={formData.best_position === null ? '' : formData.best_position}
                onChange={handleChange}
                className="form-input"
                disabled={loading}
                placeholder="Auto"
              />
              <p className="text-xs text-gray-500 mt-1">
                Se met à jour automatiquement
              </p>
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