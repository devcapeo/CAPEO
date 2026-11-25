'use client'

import AuthProvider from '@/components/auth/AuthProvider/AuthProvider'
import ToastProvider from '@/components/ui/Toast/ToastProvider'
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker/AnalyticsTracker'

/* Contextes client globaux : session Supabase, notifications et mesure d'audience. */
export default function Providers({ children }) {
  return (
    <AuthProvider>
      <AnalyticsTracker />
      <ToastProvider>{children}</ToastProvider>
    </AuthProvider>
  )
}
