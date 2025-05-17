"use client"
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react'
import Papa from 'papaparse'

export default function CsvImporter({ onImportComplete, clientId, importType }) {
  const [file, setFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [previewData, setPreviewData] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const onDrop = useCallback(acceptedFiles => {
    setError(null)
    setSuccess(false)
    
    const selectedFile = acceptedFiles[0]
    if (!selectedFile) return
    
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      setError('Veuillez sélectionner un fichier CSV valide')
      return
    }
    
    setFile(selectedFile)
    
    // Preview the CSV
    Papa.parse(selectedFile, {
      header: true,
      preview: 5, // Show only first 5 rows
      complete: function(results) {
        setPreviewData(results.data)
      },
      error: function(error) {
        setError(`Erreur lors de la lecture du fichier: ${error.message}`)
      }
    })
  }, [])
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1
  })
  
  const processImport = async () => {
    if (!file) return
    
    setIsProcessing(true)
    setError(null)
    
    try {
      Papa.parse(file, {
        header: true,
        complete: async function(results) {
          if (results.errors.length > 0) {
            setError(`Erreur dans le fichier CSV: ${results.errors[0].message}`)
            setIsProcessing(false)
            return
          }
          
          // Here would be the API call to your backend
          // For example:
          try {
            const response = await fetch(`/api/${importType}/import`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                clientId,
                data: results.data
              }),
            })
            
            if (!response.ok) {
              const errorData = await response.json()
              throw new Error(errorData.message || 'Erreur lors de l\'import')
            }
            
            setSuccess(true)
            setIsProcessing(false)
            
            if (onImportComplete) {
              onImportComplete(results.data)
            }
          } catch (error) {
            setError(`Erreur lors de l'import: ${error.message}`)
            setIsProcessing(false)
          }
        },
        error: function(error) {
          setError(`Erreur lors de la lecture du fichier: ${error.message}`)
          setIsProcessing(false)
        }
      })
    } catch (error) {
      setError(`Erreur lors du traitement: ${error.message}`)
      setIsProcessing(false)
    }
  }
  
  const clearFile = () => {
    setFile(null)
    setPreviewData(null)
    setError(null)
    setSuccess(false)
  }
  
  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md flex gap-3 items-start">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-red-800">Erreur lors de l'import</h4>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
          <button 
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md flex gap-3 items-start">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-green-800">Import réussi!</h4>
            <p className="mt-1 text-sm text-green-700">Les données ont été importées avec succès.</p>
          </div>
          <button 
            onClick={() => setSuccess(false)}
            className="text-green-500 hover:text-green-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {!file ? (
        <div 
          {...getRootProps()} 
          className={`p-6 border-2 border-dashed rounded-lg cursor-pointer flex flex-col items-center justify-center space-y-2 ${
            isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-500 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="p-3 bg-gray-100 rounded-full">
            <Upload className="h-8 w-8 text-gray-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900">
              {isDragActive 
                ? 'Déposez le fichier ici' 
                : 'Glissez-déposez votre fichier CSV ici, ou cliquez pour sélectionner'
              }
            </p>
            <p className="mt-1 text-xs text-gray-500">CSV uniquement, max. 10MB</p>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md flex gap-3 items-center">
            <FileText className="h-6 w-6 text-blue-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">{file.name}</p>
              <p className="text-xs text-blue-700">
                {(file.size / 1024).toFixed(2)} KB • {previewData ? previewData.length : 0} enregistrements prévisualisés
              </p>
            </div>
            <button 
              onClick={clearFile} 
              className="text-blue-500 hover:text-blue-700"
              title="Supprimer le fichier"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {previewData && previewData.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Aperçu des données</h3>
              <div className="overflow-x-auto rounded-md border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(previewData[0]).map((header, index) => (
                        <th 
                          key={index} 
                          className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {previewData.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, cellIndex) => (
                          <td 
                            key={cellIndex} 
                            className="px-3 py-2 whitespace-nowrap text-xs text-gray-500"
                          >
                            {value || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-gray-500">Affichage de {previewData.length} lignes sur {previewData.length} importées</p>
            </div>
          )}
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={clearFile}
              className="btn btn-secondary"
              disabled={isProcessing}
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={processImport}
              className="btn btn-primary flex items-center gap-2"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Importation...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Importer les données
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}