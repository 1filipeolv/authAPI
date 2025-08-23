import React from "react"

interface CardProps {
  children: React.ReactNode
  className?: string
}

interface CardSubProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return <div className={`bg-white shadow rounded-lg ${className || ""}`}>{children}</div>
}

export function CardHeader({ children, className }: CardSubProps) {
  return <div className={`px-6 py-4 border-b ${className || ""}`}>{children}</div>
}

export function CardTitle({ children, className }: CardSubProps) {
  return <h3 className={`text-lg font-semibold ${className || ""}`}>{children}</h3>
}

export function CardDescription({ children, className }: CardSubProps) {
  return <p className={`text-sm text-gray-500 ${className || ""}`}>{children}</p>
}

export function CardContent({ children, className }: CardSubProps) {
  return <div className={`p-6 ${className || ""}`}>{children}</div>
}
