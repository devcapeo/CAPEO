'use client'

import Button from '@/components/ui/Button/Button'
import Spinner from '@/components/ui/Spinner/Spinner'
import FormStatus from '@/components/auth/FormStatus/FormStatus'
import { useEmailConfirmation } from './confirmation.logic'
import styles from './ConfirmationHandler.module.css'

const CONTENT = {
  working: null,
  done: { tone: 'success', text: 'Adresse confirmée. Ouverture de votre espace…' },
  'confirmed-elsewhere': {
    tone: 'info',
    text: 'Votre adresse est confirmée. Connectez-vous pour accéder à votre espace.',
  },
  error: { tone: 'error', text: 'Ce lien a expiré ou a déjà été utilisé. Connectez-vous ou recommencez l’inscription.' },
}

export default function ConfirmationHandler() {
  const status = useEmailConfirmation()
  const content = CONTENT[status]

  return (
    <div className={styles.wrapper}>
      {status === 'working' ? (
        <p className={styles.working}>
          <Spinner size="sm" /> Vérification du lien…
        </p>
      ) : (
        <FormStatus tone={content.tone}>{content.text}</FormStatus>
      )}
      {(status === 'confirmed-elsewhere' || status === 'error') && (
        <Button href="/connexion" fullWidth>Se connecter</Button>
      )}
    </div>
  )
}
