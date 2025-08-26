"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import Message from "../components/Message"
import styles from "./Register.module.css"
import api from "../api"

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      setMessage({ text: "Por favor, preencha todos os campos", type: "error" })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await api.post("/auth/login", formData)
      if (response.data.success) {
        localStorage.setItem("accessToken", response.data.accessToken)
        setMessage({ text: response.data.message, type: "success" })
        setTimeout(() => navigate("/dashboard"), 1000)
      } else {
        setMessage({ text: response.data.message, type: "error" })
      }
    } catch (err) {
      console.error(err)
      setMessage({ text: "Erro interno do servidor", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Login</h2>
        <p className={styles.subtitle}>Entre na sua conta</p>

        {message && <Message message={message.text} type={message.type} onClose={() => setMessage(null)} />}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="seu@email.com" />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Senha</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Sua senha" />
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className={styles.linkContainer}>
          <p>
            Não tem uma conta?{" "}
            <Link to="/register" className={styles.link}>
              Registre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
