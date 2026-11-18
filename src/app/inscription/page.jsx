import { Suspense } from 'react'
import Link from 'next/link'
import AuthShell from '@/components/auth/AuthShell/AuthShell'
import SignUpForm from '@/components/auth/SignUpForm/SignUpForm'

export const metadata = {
  title: 'Rejoindre CAPEO',
  description:
    "Créez votre compte CAPEO : un cercle de confiance vérifié où des acquéreurs sérieux se rencontrent pour acquérir, seuls ou ensemble, des actifs rares. Sans commission.",
  alternates: { canonical: '/inscription' },
}

export default function SignUpPage() {
  return (
    <AuthShell
      eyebrow="Rejoindre CAPEO"
      title="Entrez dans"
      accent="le cercle."
      intro="Inscription gratuite, sans commission sur les transactions. Votre identité sera vérifiée avant toute prise de contact : c'est ce qui garantit le sérieux de chaque échange."
      footer={<>Déjà membre ? <Link href="/connexion">Se connecter</Link></>}
    >
      <Suspense fallback={null}>
        <SignUpForm />
      </Suspense>
    </AuthShell>
  )
}
