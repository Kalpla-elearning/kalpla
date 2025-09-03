'use client'

import { useState, useEffect } from 'react'
import BlogDashboard from '@/components/blog/BlogDashboard'

export default function AdminBlogPage() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <BlogDashboard />
      </div>
    </div>
  )
}
