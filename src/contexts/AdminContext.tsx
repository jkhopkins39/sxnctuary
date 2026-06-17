import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createClient, type SupabaseClient, type Session } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined

let supabase: SupabaseClient | null = null
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  })
}

interface AdminContextType {
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (context === undefined) throw new Error('useAdmin must be used within an AdminProvider')
  return context
}

interface AdminProviderProps {
  children: ReactNode
}

function isAuthorisedSession(session: Session | null): boolean {
  if (!session) return false
  const tenant = session.user.app_metadata?.tenant as string | undefined
  const role = session.user.app_metadata?.role as string | undefined
  return tenant === 'sxnctuary' || role === 'agency_owner'
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    // Handle portal SSO callback: tokens in URL query params.
    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')

    if (accessToken && refreshToken) {
      window.history.replaceState({}, '', window.location.pathname)
      supabase.auth
        .setSession({ access_token: accessToken, refresh_token: refreshToken })
        .then(({ data: { session } }) => {
          const ok = isAuthorisedSession(session)
          setIsAuthenticated(ok)
          setIsAdmin(ok)
          setLoading(false)
        })
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        const ok = isAuthorisedSession(session)
        setIsAuthenticated(ok)
        setIsAdmin(ok)
        setLoading(false)
      })
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const ok = isAuthorisedSession(session)
      setIsAuthenticated(ok)
      setIsAdmin(ok)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!supabase) return false
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error || !isAuthorisedSession(data.session)) {
      if (!error) await supabase.auth.signOut()
      return false
    }
    return true
  }

  const logout = async () => {
    if (supabase) await supabase.auth.signOut()
    setIsAuthenticated(false)
    setIsAdmin(false)
  }

  return (
    <AdminContext.Provider value={{ isAuthenticated, isAdmin, login, logout, loading }}>
      {children}
    </AdminContext.Provider>
  )
}
