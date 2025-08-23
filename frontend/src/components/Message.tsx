"use client"

interface MessageProps {
  message: string
  type: "success" | "error"
  onClose?: () => void
}

export default function Message({ message, type, onClose }: MessageProps) {
  const colors = {
    success: "bg-green-100 text-green-800",
    error: "bg-red-100 text-red-800",
  }

  return (
    <div className={`p-4 rounded-md ${colors[type]} flex justify-between items-center mb-4`}>
      <span>{message}</span>
      {onClose && (
        <button className="ml-4 font-bold" onClick={onClose}>
          X
        </button>
      )}
    </div>
  )
}
