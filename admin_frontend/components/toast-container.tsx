"use client"

import { type Toast as ToastType, useToast } from "@/hooks/use-toast"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

function Toast({ toast, onClose }: { toast: ToastType; onClose: () => void }) {
  const styles = {
    success: {
      bg: "bg-accent/10",
      border: "border-accent/30",
      text: "text-accent",
      icon: CheckCircle,
    },
    error: {
      bg: "bg-destructive/10",
      border: "border-destructive/30",
      text: "text-destructive",
      icon: AlertCircle,
    },
    info: {
      bg: "bg-primary/10",
      border: "border-primary/30",
      text: "text-primary",
      icon: Info,
    },
  }

  const style = styles[toast.type]
  const Icon = style.icon

  return (
    <div className={`flex items-start gap-3 ${style.bg} border ${style.border} rounded-lg p-4 backdrop-blur-sm`}>
      <Icon className={`${style.text} flex-shrink-0 mt-0.5`} size={20} />
      <p className={`${style.text} text-sm flex-1`}>{toast.message}</p>
      <button onClick={onClose} className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors">
        <X size={18} />
      </button>
    </div>
  )
}
