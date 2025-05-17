import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function RegisterSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Inscription réussie !
        </h2>
        <p className="mt-2 text-center text-lg text-gray-600">
          Votre compte a été créé avec succès.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <p className="mb-4">
            Un email de confirmation a été envoyé à votre adresse email. Veuillez vérifier votre boîte de réception et confirmer votre adresse pour activer votre compte.
          </p>
          <div className="mt-6">
            <Link href="/login" className="btn btn-primary">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}