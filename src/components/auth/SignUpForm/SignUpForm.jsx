'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { PASSWORD_MIN_LENGTH } from '@/lib/auth/validation'
import { cx } from '@/lib/cx'
import Button from '@/components/ui/Button/Button'
import Checkbox from '@/components/ui/Checkbox/Checkbox'
import Input from '@/components/ui/Input/Input'
import FormStatus from '@/components/auth/FormStatus/FormStatus'
import { useSignUp } from './signUpForm.logic'
import styles from './SignUpForm.module.css'

const MEMBER_KINDS = [
  { value: 'particulier', label: 'Particulier' },
  { value: 'professionnel', label: 'Professionnel' },
]

export default function SignUpForm() {
  const next = useSearchParams().get('suite')
  const { values, status, message, setField, bind, handleSubmit } = useSignUp(next)

  if (status === 'success') {
    return <FormStatus tone="success">{message}</FormStatus>
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <fieldset className={styles.kinds}>
        <legend className={styles.legend}>Vous êtes</legend>
        {MEMBER_KINDS.map((kind) => (
          <label key={kind.value} className={cx(styles.kind, values.memberKind === kind.value && styles.kindActive)}>
            <input
              type="radio"
              name="memberKind"
              value={kind.value}
              checked={values.memberKind === kind.value}
              onChange={() => setField('memberKind', kind.value)}
            />
            {kind.label}
          </label>
        ))}
      </fieldset>

      <div className={styles.row}>
        <Input label="Prénom" autoComplete="given-name" {...bind('firstName')} />
        <Input label="Nom" autoComplete="family-name" {...bind('lastName')} />
      </div>

      {values.memberKind === 'professionnel' && (
        <Input label="Société" autoComplete="organization" {...bind('companyName')} />
      )}

      <Input label="Adresse e-mail" type="email" autoComplete="email" {...bind('email')} />
      <Input
        label="Mot de passe"
        type="password"
        autoComplete="new-password"
        hint={`Au moins ${PASSWORD_MIN_LENGTH} caractères, lettres et chiffres.`}
        {...bind('password')}
      />

      <Checkbox
        {...bind('terms')}
        label={
          <>
            J&apos;accepte les <Link href="/cgu" target="_blank">CGU</Link> et la{' '}
            <Link href="/confidentialite" target="_blank">politique de confidentialité</Link>.
          </>
        }
      />

      <FormStatus tone="error">{status === 'error' ? message : null}</FormStatus>

      <Button type="submit" size="lg" fullWidth loading={status === 'submitting'}>
        Créer mon compte
      </Button>

      <p className={styles.note}>
        Après confirmation de votre adresse, votre identité sera vérifiée avant toute prise de contact avec un autre
        membre. C&apos;est la garantie du cercle CAPEO.
      </p>
    </form>
  )
}
