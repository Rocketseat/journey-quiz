import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react'

import { Toast } from '~/components/Toast'
import * as ToastPrimitive from '@radix-ui/react-toast'

type ToastProviderProps = {
  children: ReactNode
}

export type ToastMessage = {
  id: string
  type?: 'success' | 'error'
  title: string
}

type ToastContextData = {
  addToast(message: Omit<ToastMessage, 'id'>): void
  removeToast(id: string): void
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData)

export function ToastProvider({ children }: ToastProviderProps) {
  const [messages, setMessages] = useState<ToastMessage[]>([])

  const addToast = useCallback(({ type, title }: Omit<ToastMessage, 'id'>) => {
    const id = String(Math.random())

    const toast = {
      id,
      type,
      title,
    }

    setMessages((state) => [...state, toast])
  }, [])

  const removeToast = useCallback((id: string) => {
    setMessages((state) => state.filter((message) => message.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      <ToastPrimitive.Provider>
        <ToastPrimitive.Viewport className="fixed top-0 right-0 flex flex-col p-6 gap-3 w-[400px] max-w-[100vw] margin-0 list-none z-50" />
        {messages.map((message) => (
          <Toast
            key={message.id}
            id={message.id}
            title={message.title}
            type={message.type}
          />
        ))}

        {children}
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextData {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error(`useToast must be used within an ToastProvider`)
  }

  return context
}
