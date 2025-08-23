"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Message from "../components/Message"
import styles from "./Register.module.css"

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setMessage({ text: "Por favor, preencha todos os campos", type: "error" })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: "As senhas não coincidem", type: "error" })
      return
    }

    if (formData.password.length < 6) {
      setMessage({ text: "A senha deve ter pelo menos 6 caracteres", type: "error" })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })

      if (result.success) {
        setMessage({ text: result.message, type: "success" })
        setTimeout(() => navigate("/dashboard"), 1000)
      } else {
        setMessage({ text: result.message, type: "error" })
      }
    } catch {
      setMessage({ text: "Erro interno do servidor", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Registro</h2>
        <p className={styles.subtitle}>Crie sua conta</p>

        {message && <Message message={message.text} type={message.type} onClose={() => setMessage(null)} />}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Nome</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Seu nome completo" />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="seu@email.com" />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Senha</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Mínimo 6 caracteres" />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirme sua senha" />
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? "Registrando..." : "Registrar"}
          </button>
        </form>

        <div className={styles.linkContainer}>
          <p>
            Já tem uma conta?{" "}
            <Link to="/login" className={styles.link}>
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
