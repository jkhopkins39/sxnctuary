import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AdminContextType {
  isAuthenticated: boolean
  isAdmin: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}

interface AdminProviderProps {
  children: ReactNode
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if admin is already logged in from localStorage
    const adminToken = localStorage.getItem('adminToken')
    console.log('Checking admin token:', adminToken)
    if (adminToken) {
      console.log('Admin token found, setting admin state')
      setIsAuthenticated(true)
      setIsAdmin(true)
    } else {
      console.log('No admin token found')
    }
    setLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      // For now, we'll check against environment variables
      const expectedUsername = import.meta.env.VITE_ADMIN_USERNAME || 'admin'
      const expectedPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'password'

      console.log('Login attempt:', { username, expectedUsername, passwordMatch: password === expectedPassword })

      if (username === expectedUsername && password === expectedPassword) {
        console.log('Login successful, setting admin state')
        setIsAuthenticated(true)
        setIsAdmin(true)
        localStorage.setItem('adminToken', 'authenticated')
        return true
      } else {
        console.log('Login failed - credentials mismatch')
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    setIsAdmin(false)
    localStorage.removeItem('adminToken')
  }

  const value: AdminContextType = {
    isAuthenticated,
    isAdmin,
    login,
    logout,
    loading
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
} 