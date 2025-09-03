'use client'

import { useState } from 'react'
import { 
  CloudIcon,
  ArrowUpTrayIcon,
  DocumentArrowDownIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export default function AWSTestPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadResult, setUploadResult] = useState<any>(null)

  const testAWSConnection = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/test/aws')
      const result = await response.json()
      setTestResult(result)
    } catch (error) {
      setTestResult({ status: 'error', message: 'Network error', error: error })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFile) return

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      setUploadResult(result)
    } catch (error) {
      setUploadResult({ success: false, error: error })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2">
            <CloudIcon className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">AWS S3 Test</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            AWS S3 Connection Test
          </h1>
          <p className="text-gray-600">
            Test your AWS S3 configuration and file upload functionality
          </p>
        </div>

        {/* Connection Test */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <CloudIcon className="h-5 w-5 mr-2" />
            Connection Test
          </h2>
          
          <button
            onClick={testAWSConnection}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Testing...
              </>
            ) : (
              <>
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                Test AWS Connection
              </>
            )}
          </button>

          {testResult && (
            <div className="mt-6">
              <div className={`p-4 rounded-lg ${
                testResult.status === 'success' 
                  ? 'bg-green-50 border border-green-200' 
                  : testResult.status === 'partial'
                  ? 'bg-yellow-50 border border-yellow-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-start">
                  {testResult.status === 'success' ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  ) : (
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900">{testResult.message}</h3>
                    {testResult.error && (
                      <p className="text-sm text-gray-600 mt-1">{testResult.error}</p>
                    )}
                    
                    {testResult.environment && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Environment Check:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          {Object.entries(testResult.environment).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-600">{key}:</span>
                              <span className="font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {testResult.availableBuckets && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Available Buckets:</h4>
                        <div className="text-sm text-gray-600">
                          {testResult.availableBuckets.join(', ') || 'None'}
                        </div>
                      </div>
                    )}

                    {testResult.instructions && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Instructions:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {testResult.instructions.map((instruction: string, index: number) => (
                            <li key={index}>{instruction}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* File Upload Test */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
            File Upload Test
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select File
              </label>
              <input
                type="file"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {selectedFile && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Selected File:</h4>
                <div className="text-sm text-gray-600">
                  <p><strong>Name:</strong> {selectedFile.name}</p>
                  <p><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  <p><strong>Type:</strong> {selectedFile.type}</p>
                </div>
              </div>
            )}

            <button
              onClick={handleFileUpload}
              disabled={!selectedFile || isLoading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
                  Upload File
                </>
              )}
            </button>

            {uploadResult && (
              <div className="mt-4">
                <div className={`p-4 rounded-lg ${
                  uploadResult.success 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-start">
                    {uploadResult.success ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                    ) : (
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {uploadResult.success ? 'Upload Successful' : 'Upload Failed'}
                      </h3>
                      {uploadResult.url && (
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>URL:</strong> {uploadResult.url}
                        </p>
                      )}
                      {uploadResult.error && (
                        <p className="text-sm text-gray-600 mt-1">{uploadResult.error}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Setup Instructions</h3>
          <div className="text-sm text-gray-700 space-y-2">
            <p><strong>1. Configure AWS Credentials:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Add your AWS credentials to <code className="bg-gray-100 px-1 rounded">.env.local</code></li>
              <li>Set <code className="bg-gray-100 px-1 rounded">AWS_ACCESS_KEY_ID</code> and <code className="bg-gray-100 px-1 rounded">AWS_SECRET_ACCESS_KEY</code></li>
              <li>Configure <code className="bg-gray-100 px-1 rounded">AWS_REGION</code> (default: ap-south-1)</li>
              <li>Set <code className="bg-gray-100 px-1 rounded">AWS_S3_BUCKET</code> to your bucket name</li>
            </ul>
            
            <p className="mt-4"><strong>2. Create S3 Bucket:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Create a bucket named <code className="bg-gray-100 px-1 rounded">kalpla-drive</code> in your AWS account</li>
              <li>Configure CORS if needed for direct browser uploads</li>
              <li>Set appropriate permissions for your IAM user</li>
            </ul>

            <p className="mt-4"><strong>3. Test the Connection:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Click "Test AWS Connection" to verify setup</li>
              <li>Try uploading a file to test full functionality</li>
              <li>Check the console for detailed error messages</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
