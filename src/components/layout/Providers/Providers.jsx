'use client'

import AuthProvider from '@/components/auth/AuthProvider/AuthProvider'
import ToastProvider from '@/components/ui/Toast/ToastProvider'

/* Contextes client globaux : session Supabase et notifications. */
export default function Providers({ children }) {
  return (
    <AuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </AuthProvider>
  )
}
