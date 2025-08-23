"use client"
import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)

  const API_URL = "http://localhost:5000/api/auth"

  const loadUser = async () => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const res = await axios.get(`${API_URL}/verify-token`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.data.success) setUser(res.data.user)
    } catch {
      localStorage.removeItem("accessToken")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadUser() }, [])

  const login = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/login`, data)
      if (res.data.success) {
        localStorage.setItem("accessToken", res.data.accessToken)
        setUser(res.data.user)
      }
      return res.data
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Erro no login" }
    }
  }

  const register = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/register`, data)
      return res.data
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Erro no registro" }
    }
  }

  const logout = async () => {
    try { await axios.post(`${API_URL}/logout`) } catch {}
    localStorage.removeItem("accessToken")
    setUser(null)
  }

  const deleteAccount = async () => {
    const token = localStorage.getItem("accessToken")
    if (!token) return { success: false, message: "Token não encontrado" }

    try {
      const res = await axios.delete(`${API_URL}/delete-account`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      localStorage.removeItem("accessToken")
      setUser(null)
      return res.data
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Erro ao deletar conta" }
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, message, setMessage, login, register, logout, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
