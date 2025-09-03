'use client'

import { useState, useEffect } from 'react'
import UserManagement from '@/components/admin/UserManagement'

export default function AdminUsersPage() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <UserManagement />
      </div>
    </div>
  )
}
