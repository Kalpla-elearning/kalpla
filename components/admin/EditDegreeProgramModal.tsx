'use client'

import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface EditDegreeProgramModalProps {
  program: any
  onClose: () => void
  onSuccess: () => void
}

export default function EditDegreeProgramModal({ program, onClose, onSuccess }: EditDegreeProgramModalProps) {

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Edit Degree Program</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="text-center py-8">
          <p className="text-gray-600">Edit Degree Program Modal - Coming Soon</p>
          <p className="text-sm text-gray-500 mt-2">This component will be implemented in the next iteration</p>
        </div>
      </div>
    </div>
  )
}
