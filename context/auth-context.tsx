"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  deleteAccount: () => Promise<{ success: boolean; message: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          console.log("[v0] Checking existing token...")
          const response = await fetch(`${API_URL}/api/auth/verify`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })

          if (response.ok) {
            const data = await response.json()
            console.log("[v0] Token valid, user data:", data.user)
            setUser(data.user)
          } else {
            console.log("[v0] Token invalid, removing from storage")
            localStorage.removeItem("token")
          }
        } catch (error) {
          console.log("[v0] Error verifying token:", error)
          localStorage.removeItem("token")
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [API_URL])

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      console.log("[v0] Attempting login for:", email)
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      console.log("[v0] Login response:", data)

      if (response.ok && data.success) {
        setUser(data.user)
        localStorage.setItem("token", data.token)
        return { success: true, message: data.message }
      } else {
        return { success: false, message: data.message || "Erro no login" }
      }
    } catch (error) {
      console.log("[v0] Login error:", error)
      return { success: false, message: "Erro de conexão com o servidor" }
    }
  }

  const register = async (
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      console.log("[v0] Attempting register for:", email)
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()
      console.log("[v0] Register response:", data)

      if (response.ok && data.success) {
        setUser(data.user)
        localStorage.setItem("token", data.token)
        return { success: true, message: data.message }
      } else {
        return { success: false, message: data.message || "Erro no registro" }
      }
    } catch (error) {
      console.log("[v0] Register error:", error)
      return { success: false, message: "Erro de conexão com o servidor" }
    }
  }

  const deleteAccount = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        return { success: false, message: "Usuário não autenticado" }
      }

      console.log("[v0] Attempting to delete account...")
      const response = await fetch(`${API_URL}/api/auth/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      console.log("[v0] Delete account response:", data)

      if (response.ok && data.success) {
        setUser(null)
        localStorage.removeItem("token")
        return { success: true, message: data.message }
      } else {
        return { success: false, message: data.message || "Erro ao excluir conta" }
      }
    } catch (error) {
      console.log("[v0] Delete account error:", error)
      return { success: false, message: "Erro de conexão com o servidor" }
    }
  }

  const logout = () => {
    console.log("[v0] Logging out user")
    setUser(null)
    localStorage.removeItem("token")
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
