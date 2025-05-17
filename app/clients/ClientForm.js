"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'
import { Loader2, X } from 'lucide-react'

export default function ClientForm({ onClose, onSuccess, client }) {
  const isEdit = !!client
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    contact_email: '',
    contact_phone: '',
    status: 'active'
  })

  // If editing, populate form with client data
  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        website: client.website || '',
        contact_email: client.contact_email || '',
        contact_phone: client.contact_phone || '',
        status: client.status || 'active'
      })
    }
  }, [client])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setError("Le nom du client est obligatoire")
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      if (isEdit) {
        // Update existing client
        const { error } = await supabase
          .from('clients')
          .update({
            ...formData,
            updated_at: new Date()
          })
          .eq('id', client.id)
        
        if (error) throw error
      } else {
        // Create new client
        const { error } = await supabase
          .from('clients')
          .insert([{ ...formData }])
        
        if (error) throw error
      }
      
      if (onSuccess) onSuccess()
      if (onClose) onClose()
    } catch (error) {
      console.error('Error saving client:', error)
      setError('Une erreur est survenue lors de l\'enregistrement du client')
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
        {isEdit ? `Modifier ${client.name}` : 'Ajouter un nouveau client'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="form-label">
              Nom du client <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="website" className="form-label">
              Site web
            </label>
            <input
              id="website"
              name="website"
              type="url"
              placeholder="https://example.com"
              value={formData.website}
              onChange={handleChange}
              className="form-input"
              disabled={loading}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact_email" className="form-label">
                Email de contact
              </label>
              <input
                id="contact_email"
                name="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={handleChange}
                className="form-input"
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="contact_phone" className="form-label">
                Téléphone de contact
              </label>
              <input
                id="contact_phone"
                name="contact_phone"
                type="tel"
                value={formData.contact_phone}
                onChange={handleChange}
                className="form-input"
                disabled={loading}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="status" className="form-label">
              Statut
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-input"
              disabled={loading}
            >
              <option value="active">Actif</option>
              <option value="pending">En attente</option>
              <option value="inactive">Inactif</option>
            </select>
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
                {isEdit ? 'Mise à jour...' : 'Création en cours...'}
              </>
            ) : (
              isEdit ? 'Mettre à jour' : 'Créer le client'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}