"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import Message from "../components/Message"
import styles from "./Register.module.css" 

const Dashboard = () => {
  const { user, logout, deleteAccount } = useAuth()
  const navigate = useNavigate()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [localMessage, setLocalMessage] = useState(null) 
  useEffect(() => {
    setLocalMessage(null) 
  }, [user])

  if (!user) {
    navigate("/login")
    return null
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const handleDeleteAccount = async () => {
    const result = await deleteAccount()
    if (result.success) {
      setLocalMessage({ text: "Conta excluída com sucesso", type: "success" })
      setTimeout(() => navigate("/login"), 1000)
    } else {
      setLocalMessage({ text: result.message || "Erro ao excluir conta", type: "error" })
    }
    setShowDeleteConfirm(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Dashboard</h2>
        <p className={styles.subtitle}>Bem-vindo, {user.name}!</p>

        {localMessage && <Message message={localMessage.text} type={localMessage.type} onClose={() => setLocalMessage(null)} />}

        <div className={styles.userCard}>
          <div className={styles.inputGroup}>
            <label>Nome</label>
            <input type="text" value={user.name} readOnly className={styles.highlightedInput} />
          </div>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input type="text" value={user.email} readOnly className={styles.highlightedInput} />
          </div>
        </div>

        {!showDeleteConfirm && (
          <>
            <button onClick={handleLogout} className={styles.submitButton}>
              Sair
            </button>
            <button onClick={() => setShowDeleteConfirm(true)} className={styles.submitButton}>
              Excluir Conta
            </button>
          </>
        )}

        {showDeleteConfirm && (
          <div className={styles.formContainer}>
            <h3 className={styles.title}>Confirmar Exclusão</h3>
            <p>Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.</p>
            <button onClick={handleDeleteAccount} className={styles.submitButton}>
              Sim, Excluir
            </button>
            <button onClick={() => setShowDeleteConfirm(false)} className={styles.submitButton}>
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
