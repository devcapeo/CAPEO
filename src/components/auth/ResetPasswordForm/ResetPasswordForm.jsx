'use client'

import { PASSWORD_MIN_LENGTH } from '@/lib/auth/validation'
import Button from '@/components/ui/Button/Button'
import Input from '@/components/ui/Input/Input'
import Spinner from '@/components/ui/Spinner/Spinner'
import FormStatus from '@/components/auth/FormStatus/FormStatus'
import { useResetPassword } from './resetPassword.logic'
import styles from './ResetPasswordForm.module.css'

export default function ResetPasswordForm() {
  const { linkStatus, status, message, bind, handleSubmit } = useResetPassword()

  if (linkStatus === 'checking') {
    return (
      <p className={styles.checking}>
        <Spinner size="sm" /> Vérification du lien…
      </p>
    )
  }

  if (linkStatus === 'invalid') {
    return (
      <div className={styles.form}>
        <FormStatus tone="error">Ce lien a expiré ou n&apos;est plus valide. Demandez-en un nouveau.</FormStatus>
        <Button href="/mot-de-passe-oublie" fullWidth>Recevoir un nouveau lien</Button>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Input
        label="Nouveau mot de passe"
        type="password"
        autoComplete="new-password"
        hint={`Au moins ${PASSWORD_MIN_LENGTH} caractères, lettres et chiffres.`}
        {...bind('password')}
      />
      <Input label="Confirmez le mot de passe" type="password" autoComplete="new-password" {...bind('confirm')} />
      <FormStatus tone="error">{status === 'error' ? message : null}</FormStatus>
      <Button type="submit" size="lg" fullWidth loading={status === 'submitting' || status === 'success'}>
        Enregistrer
      </Button>
    </form>
  )
}
