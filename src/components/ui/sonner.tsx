"use client"

import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        style: {
          background: '#1a1a1a',
          border: '1px solid rgba(255,69,0,0.2)',
          color: '#ffffff',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
