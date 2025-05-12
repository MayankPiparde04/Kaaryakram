"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

// Define user types
type UserRole = "Pandit" | "Delivery" | "Darkstore" | null
type User = {
  id: string
  name: string
  email: string
  phone: string
  image?: string
  role: UserRole
  isAdmin: boolean
  isVerified: boolean
} | null

// Auth context type
type AuthContextType = {
  user: User
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, phone: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
  checkAuth: () => Promise<boolean>
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Configure axios to include credentials with every request
axios.defaults.withCredentials = true;

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true)
        
        // Call the validate API endpoint to check if user is logged in
        const response = await axios.get('/api/auth/validate')
        if (response.data.success) {
          setUser(response.data.user)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Authentication error:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Check authentication status
  const checkAuth = async (): Promise<boolean> => {
    try {
      // Validate session with API
      const response = await axios.get('/api/auth/validate')
      return response.data.success
    } catch (error) {
      console.error("Authentication validation error:", error)
      return false
    }
  }

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Call the login API with credentials
      const response = await axios.post('/api/auth/login', { email, password })
      
      if (response.data.success) {
        setUser(response.data.user)
        router.push("/")
      } else {
        throw new Error(response.data.message || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Register function
  const register = async (name: string, email: string, phone: string, password: string) => {
    setLoading(true)
    try {
      // Call the register API
      const response = await axios.post('/api/auth/register', { 
        name, 
        email, 
        phone, 
        password,
        confirmPassword: password // Required by registerSchema
      })
      
      if (response.data.success) {
        setUser(response.data.user)
        router.push("/")
      } else {
        throw new Error(response.data.message || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      // Call the logout API
      await axios.post('/api/auth/logout')
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading, checkAuth }}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
