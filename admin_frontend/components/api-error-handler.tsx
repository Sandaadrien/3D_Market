"use client"

import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

// Global error handler for API failures
export function ApiErrorHandler() {
  const { error } = useToast()

  useEffect(() => {
    const handleUnhandledError = (event: PromiseRejectionEvent) => {
      console.error("[API Error]", event.reason)
      error("An unexpected error occurred. Please try again.")
    }

    window.addEventListener("unhandledrejection", handleUnhandledError)
    return () => window.removeEventListener("unhandledrejection", handleUnhandledError)
  }, [error])

  return null
}
