import { Suspense } from 'react'
import Link from 'next/link'
import AuthShell from '@/components/auth/AuthShell/AuthShell'
import SignInForm from '@/components/auth/SignInForm/SignInForm'

export const metadata = {
  title: 'Connexion',
  alternates: { canonical: '/connexion' },
}

export default function SignInPage() {
  return (
    <AuthShell
      eyebrow="Connexion"
      title="Bon retour"
      accent="parmi nous."
      intro="Retrouvez vos annonces, vos favoris et vos Business Rooms."
      footer={<>Pas encore membre ? <Link href="/inscription">Créer un compte</Link></>}
    >
      <Suspense fallback={null}>
        <SignInForm />
      </Suspense>
    </AuthShell>
  )
}
