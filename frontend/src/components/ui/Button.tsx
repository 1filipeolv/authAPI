import React from "react"
import { clsx } from "clsx"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "default" | "outline" | "destructive"
  className?: string
}

export function Button({ children, variant = "default", className, ...props }: ButtonProps) {
  let baseStyle = "px-4 py-2 rounded-md font-medium transition-colors"

  const variants: Record<string, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  }

  return (
    <button className={clsx(baseStyle, variants[variant], className)} {...props}>
      {children}
    </button>
  )
}
