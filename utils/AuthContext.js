"use client"
import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from './supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("Session error:", error)
          return
        }
        
        if (data?.session) {
          setUser(data.session.user)
          
          // Also fetch user profile data
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single()
            
          if (profileData) {
            setUser(prev => ({ ...prev, profile: profileData }))
          }
        }
      } catch (err) {
        console.error("Auth check error:", err)
      } finally {
        setLoading(false)
      }
    }
    
    checkSession()
    
    // Set up auth subscription
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user)
          
          // Fetch profile data
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            
          if (profileData) {
            setUser(prev => ({ ...prev, profile: profileData }))
          }
          
          // Redirect based on user role
          if (profileData?.role === 'admin') {
            router.push('/admin/dashboard')
          } else {
            router.push('/client/dashboard')
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          router.push('/')
        }
      }
    )
    
    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [router])

  // Define auth methods
  const login = async (email, password) => {
    setAuthError(null)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        setAuthError(error.message)
        return { success: false, error: error.message }
      }
      
      return { success: true, user: data.user }
    } catch (err) {
      setAuthError(err.message)
      return { success: false, error: err.message }
    }
  }
  
  const signup = async (email, password, userData) => {
    setAuthError(null)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) {
        setAuthError(error.message)
        return { success: false, error: error.message }
      }
      
      // Create profile record
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id,
              ...userData
            }
          ])
          
        if (profileError) {
          console.error("Error creating profile:", profileError)
          return { 
            success: true, 
            user: data.user,
            warning: "Created user but profile could not be saved."
          }
        }
      }
      
      return { success: true, user: data.user }
    } catch (err) {
      setAuthError(err.message)
      return { success: false, error: err.message }
    }
  }
  
  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      authError,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      setAuthError
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}