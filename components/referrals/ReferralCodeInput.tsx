'use client'

import { useState } from 'react'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

interface ReferralCodeInputProps {
  onCodeValidated: (code: string, discount: number) => void
  onCodeInvalid: (error: string) => void
  disabled?: boolean
}

export function ReferralCodeInput({ onCodeValidated, onCodeInvalid, disabled }: ReferralCodeInputProps) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [validated, setValidated] = useState(false)
  const [error, setError] = useState('')

  const validateCode = async (inputCode: string) => {
    if (!inputCode.trim()) {
      setError('')
      setValidated(false)
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/referrals/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: inputCode }),
      })

      const data = await response.json()

      if (data.success) {
        setValidated(true)
        setError('')
        onCodeValidated(inputCode, data.referralCode.discount)
      } else {
        setValidated(false)
        setError(data.error)
        onCodeInvalid(data.error)
      }
    } catch (error) {
      setValidated(false)
      setError('Failed to validate referral code')
      onCodeInvalid('Failed to validate referral code')
    } finally {
      setLoading(false)
    }
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()
    setCode(value)
    
    // Auto-validate after 3 characters
    if (value.length >= 3) {
      const timeoutId = setTimeout(() => {
        validateCode(value)
      }, 500)
      
      return () => clearTimeout(timeoutId)
    } else {
      setValidated(false)
      setError('')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.trim()) {
      validateCode(code)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="referralCode" className="block text-sm font-medium text-gray-700 mb-2">
          Referral Code (Optional)
        </label>
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <input
              type="text"
              id="referralCode"
              value={code}
              onChange={handleCodeChange}
              disabled={disabled}
              placeholder="Enter referral code"
              className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                validated 
                  ? 'border-green-300 bg-green-50' 
                  : error 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300'
              } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
              ) : validated ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              ) : error ? (
                <XCircleIcon className="h-5 w-5 text-red-500" />
              ) : null}
            </div>
          </div>
        </form>
      </div>

      {validated && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Valid referral code!
              </p>
              <p className="text-sm text-green-600">
                You'll get a discount when you complete your purchase.
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
            <div>
              <p className="text-sm font-medium text-red-800">
                Invalid referral code
              </p>
              <p className="text-sm text-red-600">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-500">
        <p>Have a referral code? Enter it above to get a discount on your purchase.</p>
        <p>Don't have one? Ask a friend who's already on Kalpla!</p>
      </div>
    </div>
  )
}
