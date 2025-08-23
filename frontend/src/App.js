"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Message from "./components/Message"
import styles from "./App.module.css"

 const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  const loading = user === undefined 

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>
  }

  return user ? children : <Navigate to="/login" />
}

const PublicRoute = ({ children }) => {
  const { user } = useAuth()
  const loading = user === undefined

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>
  }

  return user ? <Navigate to="/dashboard" /> : children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className={styles.app}>
          <Message />
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
