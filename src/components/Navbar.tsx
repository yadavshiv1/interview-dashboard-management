'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { redirect, usePathname } from 'next/navigation'
import LogoText from './LogoText'
import { FiMenu, FiX, FiUser, FiLogOut, FiHome, FiUsers, FiSettings } from 'react-icons/fi'

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    redirect('/login')
  }

  if (!user || pathname === '/login') return null

  const canAccessAdmin = user.role === 'admin'
  const canViewCandidates = ['admin', 'ta_member', 'panelist'].includes(user.role)

  const links = [
    { name: 'Dashboard', href: '/dashboard', visible: true, icon: FiHome },
    { name: 'Candidates', href: '/candidates', visible: canViewCandidates, icon: FiUsers },
    { name: 'Admin Panel', href: '/admin', visible: canAccessAdmin, icon: FiSettings },
  ]

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 fixed w-full z-50">
      <div className="max-w-8xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <img src="/images/logo.svg" alt="Logo" width={110} height={32} />
            <LogoText />
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {links.map(
              (link) =>
                link.visible && (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      pathname === link.href
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                )
            )}
            
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-300">
              <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                <FiUser className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-700">
                  {user.firstName} <span className="text-gray-400">•</span>{' '}
                  <span className="font-medium text-gray-900">{user.role}</span>
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FiLogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <FiX className="w-5 h-5 text-gray-700" />
              ) : (
                <FiMenu className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 w-full absolute top-16 left-0 flex flex-col p-4 space-y-3">
          {links.map(
            (link) =>
              link.visible && (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    pathname === link.href
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  <span className="font-medium">{link.name}</span>
                </Link>
              )
          )}
          
          <div className="flex items-center space-x-3 px-4 py-3 bg-gray-100 rounded-lg mt-2">
            <FiUser className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-700">
              {user.firstName} {user.lastName} • <span className="font-medium text-gray-900">{user.role}</span>
            </span>
          </div>
          
          <button
            onClick={() => {
              handleLogout()
              setIsMobileMenuOpen(false)
            }}
            className="flex items-center space-x-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 rounded-lg transition-all duration-200 shadow-lg mt-2"
          >
            <FiLogOut className="w-4 h-4" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      )}
    </nav>
  )
}