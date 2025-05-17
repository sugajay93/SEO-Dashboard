"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../utils/supabase'
import { Loader2, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AdminSetup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [company, setCompany] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [adminExists, setAdminExists] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)
  const router = useRouter()

  // Check if admin already exists
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'admin')
          .limit(1)
        
        if (error) throw error
        
        setAdminExists(data && data.length > 0)
        setCheckingStatus(false)
      } catch (err) {
        console.error('Error checking admin status:', err)
        setError('Erreur lors de la vérification du statut administrateur.')
        setCheckingStatus(false)
      }
    }
    
    checkAdmin()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    // Validate inputs
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      setLoading(false)
      return
    }
    
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      setLoading(false)
      return
    }
    
    try {
      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (authError) throw authError
      
      if (authData.user) {
        // Now create profile with admin role
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              full_name: fullName,
              company_name: company,
              email: email,
              role: 'admin',
              status: 'active'
            }
          ])
        
        if (profileError) throw profileError
        
        setSuccess(true)
        
        // Redirect after 3 seconds
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      }
    } catch (error) {
      console.error('Admin setup error:', error)
      setError(error.message || 'Une erreur est survenue lors de la création du compte administrateur.')
    } finally {
      setLoading(false)
    }
  }
  
  if (checkingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-700">Vérification du statut administrateur...</p>
        </div>
      </div>
    )
  }
  
  if (adminExists) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div>
            <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Administrateur déjà configuré
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Un compte administrateur existe déjà pour cette application.
            </p>
          </div>
          <div className="flex justify-center">
            <Link href="/login" className="btn btn-primary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la page de connexion
            </Link>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Configuration administrateur
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Créez votre compte administrateur principal pour gérer le CRM
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}
          
          {success && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <p className="text-sm text-green-700">
                  Compte administrateur créé avec succès ! Vous allez être redirigé vers la page de connexion.
                </p>
              </div>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="form-label">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                disabled={loading || success}
              />
            </div>
            
            <div>
              <label htmlFor="fullName" className="form-label">
                Nom complet
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="form-input"
                disabled={loading || success}
              />
            </div>
            
            <div>
              <label htmlFor="company" className="form-label">
                Nom de l'entreprise
              </label>
              <input
                id="company"
                name="company"
                type="text"
                autoComplete="organization"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="form-input"
                disabled={loading || success}
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                disabled={loading || success}
              />
              <p className="mt-1 text-xs text-gray-500">
                Au moins 8 caractères
              </p>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
                disabled={loading || success}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || success}
                className="w-full btn btn-primary py-2 flex justify-center items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Création en cours...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Compte créé
                  </>
                ) : (
                  'Créer le compte administrateur'
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="text-center">
              <Link 
                href="/login"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center justify-center"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}