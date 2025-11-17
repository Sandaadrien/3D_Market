"use client"

import { useState, useCallback, useEffect } from "react"
import { apiClient } from "@/lib/api-client"

export interface AuthUser {
  id: string
  email: string
  isAdmin: boolean
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch {
        localStorage.removeItem("authToken")
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.post<{ token: string; user: AuthUser }>("/Authentication/login", {
        email,
        password,
      })

      if (!response.success) {
        throw new Error(response.error || "Login failed")
      }

      const { token, user: userData } = response.data!
      localStorage.setItem("authToken", token)
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)

      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed"
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.post<{ token: string; user: AuthUser }>("/Authentication/registration-admin", {
        email,
        password,
      })

      if (!response.success) {
        throw new Error(response.error || "Registration failed")
      }

      const { token, user: userData } = response.data!
      localStorage.setItem("authToken", token)
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)

      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed"
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    setUser(null)
  }, [])

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }
}
