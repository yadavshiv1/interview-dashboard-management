'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { UserRole } from '@/context/AuthContext'
import { useNotification } from '@/hooks/useNotification'
import LogoText from '@/components/LogoText'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('panelist')
  const [isLoading, setIsLoading] = useState(false)
  const { user, login } = useAuth()
  const router = useRouter()
  const { showError } = useNotification()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!username.trim() || !password.trim()) {
      showError('Please enter both username and password')
      setIsLoading(false)
      return
    }

    const sanitizedUsername = username.trim()
    const sanitizedPassword = password.trim()

    try {
      const success = await login(sanitizedUsername, sanitizedPassword, role)
      if (!success) {
      }
    } catch (err) {
      showError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemoCredentials = () => {
    setUsername('emilys')
    setPassword('emilyspass')
  }

  return (
    <div className="min-h-screen bg-gray-900">
      
      <nav className="bg-white shadow px-6 py-3 flex items-center justify-between">

        <div className="flex items-center gap-2">
          <img src="/images/logo.svg" alt="Logo" width={110} height={32} />
          <LogoText />
        </div>

        <div>
          <button className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900">
            Contact Us
          </button>
        </div>

      </nav>

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-gray-800 p-8 rounded shadow-lg">

          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Interview Dashboard
          </h2>

          <p className="mt-2 text-center text-sm text-gray-300">
            Sign in to your account
          </p>

          <button
            type="button"
            onClick={fillDemoCredentials}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-900 bg-gray-300 hover:bg-gray-400 mt-4 transition-colors"
          >
            Fill Demo Credentials
          </button>

          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                disabled={isLoading}
                className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700"
              >
                <option value="panelist">Panelist</option>
                <option value="ta_member">TA Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-green-800 hover:bg-green-900 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
            {isLoading && <p className="text-green-300 text-sm text-center">Signing in...</p>}
          </form>
          
        </div>
      </div>
    </div>
  )
}
