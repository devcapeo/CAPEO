'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Button from '@/components/ui/Button/Button'
import Input from '@/components/ui/Input/Input'
import FormStatus from '@/components/auth/FormStatus/FormStatus'
import { useSignIn } from './signInForm.logic'
import styles from './SignInForm.module.css'

export default function SignInForm() {
  const next = useSearchParams().get('suite')
  const { status, message, bind, handleSubmit } = useSignIn(next)

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Input label="Adresse e-mail" type="email" autoComplete="email" {...bind('email')} />
      <Input label="Mot de passe" type="password" autoComplete="current-password" {...bind('password')} />
      <Link href="/mot-de-passe-oublie" className={styles.forgot}>Mot de passe oublié ?</Link>

      <FormStatus tone="error">{status === 'error' ? message : null}</FormStatus>

      <Button type="submit" size="lg" fullWidth loading={status === 'submitting' || status === 'success'}>
        Se connecter
      </Button>
    </form>
  )
}
