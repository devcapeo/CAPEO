import { Suspense } from 'react'
import AuthShell from '@/components/auth/AuthShell/AuthShell'
import ConfirmationHandler from '@/components/auth/ConfirmationHandler/ConfirmationHandler'

export const metadata = {
  title: 'Confirmation de votre adresse',
  robots: { index: false, follow: false },
}

export default function ConfirmationPage() {
  return (
    <AuthShell eyebrow="Inscription" title="Confirmation de" accent="votre adresse.">
      <Suspense fallback={null}>
        <ConfirmationHandler />
      </Suspense>
    </AuthShell>
  )
}
