"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../context/auth-context"
import { Button } from "../../frontend/src/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../frontend/src/components/ui/Card"
import { User, Mail, LogOut, Trash2 } from "lucide-react"
import Message from "../../frontend/src/components/Message"

export default function DashboardPage() {
  const { user, loading, logout, deleteAccount } = useAuth()
  const router = useRouter()
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleDeleteAccount = async () => {
    if (!confirm("Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.")) {
      return
    }

    setIsDeleting(true)
    setMessage(null)

    try {
      const result = await deleteAccount()
      if (result.success) {
        setMessage({ text: result.message, type: "success" })
        setTimeout(() => {
          router.push("/")
        }, 2000)
      } else {
        setMessage({ text: result.message, type: "error" })
      }
    } catch (error) {
      setMessage({ text: "Erro interno do servidor", type: "error" })
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="mt-3 text-slate-600 text-lg">Bem-vindo ao seu painel pessoal</p>
        </div>

        {message && <Message message={message.text} type={message.type} onClose={() => setMessage(null)} />}

        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-slate-800 text-xl">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <User className="h-5 w-5 text-emerald-600" />
              </div>
              Informações do Usuário
            </CardTitle>
            <CardDescription className="text-slate-600 text-base">Seus dados pessoais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <User className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Nome</p>
                <p className="text-base text-slate-600 mt-1">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Mail className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Email</p>
                <p className="text-base text-slate-600 mt-1">{user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-slate-800 text-xl">Ações da Conta</CardTitle>
            <CardDescription className="text-slate-600 text-base">Gerencie sua conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full flex items-center gap-3 h-12 bg-white border-2 border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all duration-200 font-medium"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>

            <Button
              onClick={handleDeleteAccount}
              variant="destructive"
              className="w-full flex items-center gap-3 h-12 bg-red-500 hover:bg-red-600 text-white font-medium transition-all duration-200"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
              {isDeleting ? "Excluindo..." : "Excluir Conta"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
