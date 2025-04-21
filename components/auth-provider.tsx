"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

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
  logout: () => void
  loading: boolean
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, this would be an API call to validate the session
        const storedUser = localStorage.getItem("kaaryakram_user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Authentication error:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // In a real app, this would be an API call
      // Simulating API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data - in a real app, this would come from the API
      const userData = {
        id: "user_123",
        name: "Test User",
        email,
        phone: "+91 98765 43210",
        role: null as UserRole,
        isAdmin: email === "admin@example.com",
        isVerified: true,
      }

      setUser(userData)
      localStorage.setItem("kaaryakram_user", JSON.stringify(userData))
      router.push("/")
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
      // In a real app, this would be an API call
      // Simulating API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data - in a real app, this would come from the API
      const userData = {
        id: "user_" + Date.now(),
        name,
        email,
        phone,
        role: null as UserRole,
        isAdmin: false,
        isVerified: true,
      }

      setUser(userData)
      localStorage.setItem("kaaryakram_user", JSON.stringify(userData))
      router.push("/")
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("kaaryakram_user")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
