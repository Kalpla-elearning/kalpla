'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import SimpleTiptapEditor from '@/components/blog/SimpleTiptapEditor'

export default function NewPostPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    content: '',
    tags: '' as string,
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const canCreate = session && ['ADMIN', 'INSTRUCTOR'].includes(session.user.role)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canCreate) return
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          content: form.content,
          tags: form.tags
            ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
            : [],
          status: form.status,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create')
      router.push(`/blog/${data.post.slug}`)
    } catch (err) {
      alert((err as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!canCreate) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-gray-600">You do not have permission to create posts.</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">New Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            className="input-field mt-1"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
          <input
            className="input-field mt-1"
            value={form.tags}
            onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
            placeholder="nextjs, prisma, elearning"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            className="input-field mt-1"
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as 'DRAFT' | 'PUBLISHED' }))}
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
          <SimpleTiptapEditor
            content={form.content}
            onChange={(content) => setForm((f) => ({ ...f, content }))}
            placeholder="Start writing your blog post..."
            className="w-full"
          />
        </div>
        <div className="flex justify-end">
          <button className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  )
}
