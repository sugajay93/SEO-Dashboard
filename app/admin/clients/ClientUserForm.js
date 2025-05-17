"use client"
import { useState } from 'react'
import { supabase } from '../../../utils/supabase'
import { useAuth } from '../../../utils/AuthContext'
import { Loader2, X } from 'lucide-react'

export default function ClientUserForm({ onClose, onSuccess, client }) {
  const { registerClient } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.email.trim()) {
      setError("L'adresse email est obligatoire")
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }
    
    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères")
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      // Create user account with client role
      const userData = {
        full_name: client.name,
        client_id: client.id,
        role: 'client',
      }
      
      const { success, data, error: authError } = await registerClient(
        formData.email, 
        formData.password, 
        userData
      )
      
      if (!success || authError) {
        throw new Error(authError || "Erreur lors de la création du compte utilisateur")
      }
      
      // Update client with auth_user_id
      if (data?.user?.id) {
        const { error: updateError } = await supabase
          .from('clients')
          .update({ 
            auth_user_id: data.user.id,
            updated_at: new Date()
          })
          .eq('id', client.id)
        
        if (updateError) throw updateError
        
        // Save email in user_profiles table
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([{ 
            id: data.user.id,
            email: formData.email,
            client_id: client.id
          }])
        
        if (profileError) console.error("Error saving user profile:", profileError)
      }
      
      if (onSuccess) onSuccess()
      if (onClose) onClose()
      
    } catch (error) {
      console.error('Error creating client user account:', error)
      setError(error.message || "Une erreur est survenue lors de la création du compte utilisateur")
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
        Créer un compte utilisateur pour {client.name}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="form-label">
              Adresse email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Cette adresse sera utilisée par le client pour se connecter au dashboard
            </p>
          </div>
          
          <div>
            <label htmlFor="password" className="form-label">
              Mot de passe <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum 6 caractères
            </p>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="form-label">
              Confirmer le mot de passe <span className="text-red-500">*</span>
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-input"
              disabled={loading}
            />
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
                Création en cours...
              </>
            ) : (
              'Créer le compte'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}