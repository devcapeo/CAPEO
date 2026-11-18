'use client'

import { AuthContext, useAuthStore } from './auth.logic'

export default function AuthProvider({ children }) {
  const auth = useAuthStore()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}
