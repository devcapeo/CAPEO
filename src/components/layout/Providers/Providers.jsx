'use client'

import ToastProvider from '@/components/ui/Toast/ToastProvider'

/* Contextes client globaux. L'authentification Supabase s'ajoutera ici en phase 3. */
export default function Providers({ children }) {
  return <ToastProvider>{children}</ToastProvider>
}
