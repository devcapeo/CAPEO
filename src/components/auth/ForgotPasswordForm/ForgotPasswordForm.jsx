'use client'

import Button from '@/components/ui/Button/Button'
import Input from '@/components/ui/Input/Input'
import FormStatus from '@/components/auth/FormStatus/FormStatus'
import { useForgotPassword } from './forgotPassword.logic'
import styles from './ForgotPasswordForm.module.css'

export default function ForgotPasswordForm() {
  const { status, message, bind, handleSubmit } = useForgotPassword()

  if (status === 'success') return <FormStatus tone="success">{message}</FormStatus>

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Input label="Adresse e-mail" type="email" autoComplete="email" {...bind('email')} />
      <FormStatus tone="error">{status === 'error' ? message : null}</FormStatus>
      <Button type="submit" size="lg" fullWidth loading={status === 'submitting'}>
        Recevoir un lien
      </Button>
    </form>
  )
}
