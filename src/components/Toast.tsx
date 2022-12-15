import { ToastMessage, useToast } from '~/contexts/ToastProvider'

import * as ToastPrimitive from '@radix-ui/react-toast'

export function Toast({ title, id, type }: ToastMessage) {
  const { removeToast } = useToast()

  return (
    <ToastPrimitive.Root
      onOpenChange={() => removeToast(id)}
      className="inset-x-4 w-auto md:top-4 md:right-4 md:left-auto md:bottom-auto md:w-full md:max-w-sm shadow-lg rounded-lg bg-zinc-800 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 radix-state-open:animate-toast-slide-in-bottom md:radix-state-open:animate-toast-slide-in-right"
    >
      <div className="flex">
        <div className="w-0 flex-1 flex items-center pl-5 py-4">
          <div className="w-full radix">
            <ToastPrimitive.Title className="text-sm font-medium text-gray-100">
              <p>
                <strong>{type === `success` ? `Sucesso! ` : `Falha! `}</strong>
                {title}
              </p>
            </ToastPrimitive.Title>
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-col px-3 py-2 space-y-1">
            <ToastPrimitive.Close
              className="w-full border border-transparent rounded-lg px-3 py-2 flex items-center justify-center text-sm font-medium text-gray-100 hover:bg-zinc-900 focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
              aria-label="Fechar"
            >
              Fechar
            </ToastPrimitive.Close>
          </div>
        </div>
      </div>
    </ToastPrimitive.Root>
  )
}
