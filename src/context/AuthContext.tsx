'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNotification } from '@/hooks/useNotification'

export type UserRole = 'admin' | 'ta_member' | 'panelist'

export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string, role: UserRole) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { showSuccess, showError } = useNotification()

  useEffect(() => {
    const storedUser = localStorage.getItem('interview-dashboard-user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
        showSuccess('Welcome back!')
      } catch (error) {
        console.error('Failed to parse stored user data')
        localStorage.removeItem('interview-dashboard-user')
        showError('Session expired. Please login again.')
      }
    }
    setIsLoading(false)
  }, [showSuccess, showError])

  const login = async (username: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          expiresInMins: 60,
        }),
      })

      if (!response.ok) {
        showError('Invalid credentials please try again')
        return false
      }

      const data = await response.json()
      
      const userData: User = {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: role
      }

      setUser(userData)
      localStorage.setItem('interview-dashboard-user', JSON.stringify(userData))
      showSuccess(`Welcome ${data.firstName}!`)
      return true
    } catch (error) {
      console.error('Login failed:', error)
      showError('Login failed please try again')
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('interview-dashboard-user')
    showSuccess('Logged out successfully')
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}