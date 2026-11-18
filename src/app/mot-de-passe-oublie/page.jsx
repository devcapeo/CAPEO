import Link from 'next/link'
import AuthShell from '@/components/auth/AuthShell/AuthShell'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm/ForgotPasswordForm'

export const metadata = {
  title: 'Mot de passe oublié',
  robots: { index: false, follow: true },
}

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Mot de passe oublié"
      title="Un nouveau"
      accent="mot de passe."
      intro="Indiquez l'adresse e-mail de votre compte : nous vous enverrons un lien pour choisir un nouveau mot de passe."
      footer={<><Link href="/connexion">Retour à la connexion</Link></>}
    >
      <ForgotPasswordForm />
    </AuthShell>
  )
}
