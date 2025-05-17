"use client"
import { useState } from 'react'
import { useAuth } from '../../utils/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LineChart, AlertTriangle, Loader2 } from 'lucide-react'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [registrationStatus, setRegistrationStatus] = useState(null)
  const { register, authError, setAuthError } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setAuthError(null)
    
    // Validation
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }
    
    setLoading(true)
    setRegistrationStatus('pending')

    try {
      const userData = {
        full_name: fullName,
        company_name: companyName,
        role: 'user', // default role
      }
      
      console.log("Submitting registration...");
      const result = await register(email, password, userData)
      console.log("Registration result:", result);
      
      if (!result.success) {
        setError(result.error || "Une erreur est survenue lors de l'inscription")
        setRegistrationStatus('error')
        return
      }
      
      // Inscription réussie
      setRegistrationStatus('success')
      
      // Rediriger vers la page de succès après un court délai
      setTimeout(() => {
        router.push('/register/success')
      }, 1000)
    } catch (err) {
      console.error("Registration error:", err);
      setError('Une erreur est survenue. Veuillez réessayer.')
      setRegistrationStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <LineChart className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Créer un nouveau compte
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            connectez-vous à votre compte existant
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {(error || authError) && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-sm text-red-700">{error || authError}</p>
              </div>
            </div>
          )}
          
          {registrationStatus === 'success' && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
              <p className="text-sm text-green-700">
                Inscription réussie ! Vous allez être redirigé...
              </p>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullName" className="form-label">
                Nom complet
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="form-input"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="companyName" className="form-label">
                Nom de l'entreprise
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="form-input"
                disabled={loading}
              />
            </div>

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
                disabled={loading}
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
                disabled={loading}
              />
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
                disabled={loading}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary py-2 flex justify-center items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Inscription en cours...
                  </>
                ) : (
                  'S\'inscrire'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}