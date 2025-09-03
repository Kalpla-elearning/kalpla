'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Bars3Icon, XMarkIcon, AcademicCapIcon } from '@heroicons/react/24/outline'
import ProfileDropdown from './ProfileDropdown'

export function Header() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Courses', href: '/courses' },
    { name: 'Degree Programs', href: '/degrees' },
    { name: 'Blog', href: '/blog' },
    { name: 'Mentorship', href: '/mentorship' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Help', href: '/help' },
  ]

  const userNavigation = [
    { name: 'Profile', href: '/profile' },
    { name: 'Edit Profile', href: '/profile/edit' },
  ]

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <AcademicCapIcon className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-bold text-gray-900">Kalpla</span>
            </Link>
          </div>

          <nav className="hidden lg:flex space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="animate-pulse bg-gray-200 h-8 w-8 rounded-full" />
            ) : session ? (
              <ProfileDropdown />
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/signin" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">Sign in</Link>
                <Link href="/auth/signup" className="btn-primary text-sm">Sign up</Link>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 hover:text-primary-600">
              {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href} className="text-gray-700 hover:text-primary-600 block px-3 py-2 text-base font-medium" onClick={() => setIsMenuOpen(false)}>
                  {item.name}
                </Link>
              ))}
              {session ? (
                <>
                  <Link href="/dashboard" className="text-gray-700 hover:text-primary-600 block px-3 py-2 text-base font-medium" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link href="/dashboard/profile" className="text-gray-700 hover:text-primary-600 block px-3 py-2 text-base font-medium" onClick={() => setIsMenuOpen(false)}>
                    My Profile
                  </Link>
                  {session.user?.role === 'INSTRUCTOR' && (
                    <Link href="/instructor/dashboard" className="text-gray-700 hover:text-primary-600 block px-3 py-2 text-base font-medium" onClick={() => setIsMenuOpen(false)}>
                      Instructor Dashboard
                    </Link>
                  )}
                  {session.user?.role === 'ADMIN' && (
                    <Link href="/admin/dashboard" className="text-gray-700 hover:text-primary-600 block px-3 py-2 text-base font-medium" onClick={() => setIsMenuOpen(false)}>
                      Admin Dashboard
                    </Link>
                  )}
                  <button onClick={() => signOut()} className="text-gray-700 hover:text-primary-600 block w-full text-left px-3 py-2 text-base font-medium">Sign out</button>
                </>
              ) : (
                <div className="pt-4 space-y-2">
                  <Link href="/auth/signin" className="text-gray-700 hover:text-primary-600 block px-3 py-2 text-base font-medium" onClick={() => setIsMenuOpen(false)}>Sign in</Link>
                  <Link href="/auth/signup" className="btn-primary block text-center" onClick={() => setIsMenuOpen(false)}>Sign up</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
