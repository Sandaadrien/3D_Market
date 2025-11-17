"use client"

import type React from "react"

import { ToastContainer } from "./toast-container"
import { ApiErrorHandler } from "./api-error-handler"

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastContainer />
      <ApiErrorHandler />
    </>
  )
}
