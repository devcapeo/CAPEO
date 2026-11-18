import { Suspense } from 'react'
import AuthShell from '@/components/auth/AuthShell/AuthShell'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm/ResetPasswordForm'

export const metadata = {
  title: 'Nouveau mot de passe',
  robots: { index: false, follow: false },
}

export default function NewPasswordPage() {
  return (
    <AuthShell eyebrow="Mot de passe" title="Choisissez un" accent="nouveau mot de passe.">
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  )
}
