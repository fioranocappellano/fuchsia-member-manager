
import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000000

type ToastActionElement = React.ReactElement<any, string | React.JSXElementConstructor<any>>

type ToastProps = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  variant?: "default" | "destructive"
}

type Toast = ToastProps & {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type ToastContextType = {
  toasts: Toast[]
  addToast: (props: ToastProps) => void
  removeToast: (id: string) => void
  updateToast: (id: string, props: ToastProps) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }

  return {
    ...context,
    toast: (props: ToastProps) => {
      context.addToast(props)
    },
  }
}

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (props: ToastProps) => {
    setToasts((prev) => {
      if (prev.length >= TOAST_LIMIT) {
        prev.pop()
      }

      return [
        {
          ...props,
          id: props.id || crypto.randomUUID(),
          open: true,
          onOpenChange: (open) => {
            if (!open) removeToast(props.id || "")
          },
        },
        ...prev,
      ]
    })
  }

  const removeToast = (id: string) => {
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id
          ? {
              ...toast,
              open: false,
            }
          : toast
      )
    )
  }

  const updateToast = (id: string, props: ToastProps) => {
    setToasts((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, ...props }
          : t
      )
    )
  }

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        updateToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  )
}

// Export toast function for convenience
const toast = (props: ToastProps) => {
  const { toast } = useToast()
  toast(props)
}

export { ToastProvider, useToast, toast }
