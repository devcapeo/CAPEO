'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button/Button'
import Card from '@/components/ui/Card/Card'
import Input from '@/components/ui/Input/Input'
import FormStatus from '@/components/auth/FormStatus/FormStatus'
import { DEMO_ROOM_TEXT, ROOM_FRAMEWORK } from '@/content/businessRoom'
import { ROOM_LIMITS, validateIntro } from '@/lib/businessRoom/rules'
import { useAsyncAction } from '@/components/businessRoom/BusinessRoom/businessRoom.logic'
import styles from './RoomAccess.module.css'

function RequestForm({ onSubmit }) {
  const [intro, setIntro] = useState('')
  const [fieldError, setFieldError] = useState(null)
  const { pending, error, run } = useAsyncAction()

  const submit = (event) => {
    event.preventDefault()
    const problem = validateIntro(intro)
    setFieldError(problem)
    if (!problem) run(() => onSubmit(intro), "La demande n'a pas pu être envoyée.")
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <Input
        multiline
        rows={5}
        label="Votre message au vendeur"
        hint={`Présentez-vous et votre projet d'acquisition (${ROOM_LIMITS.intro} caractères maximum).`}
        value={intro}
        maxLength={ROOM_LIMITS.intro}
        onChange={(event) => setIntro(event.target.value)}
        error={fieldError}
      />
      <FormStatus tone="error">{error}</FormStatus>
      <Button type="submit" loading={pending}>Demander l&apos;accès</Button>
    </form>
  )
}

/* Tous les états précédant l'entrée dans une Business Room */
export default function RoomAccess({ phase, slug, error, onRequest }) {
  const next = encodeURIComponent(`/business-room/${slug}`)

  const content = {
    anonymous: {
      title: 'Connectez-vous pour accéder à la Business Room',
      text: "La Business Room est réservée aux membres dont l'identité est vérifiée. Créez votre compte en quelques minutes.",
      actions: (
        <>
          <Button href={`/inscription?suite=${next}`}>Créer un compte</Button>
          <Button href={`/connexion?suite=${next}`} variant="glass">Se connecter</Button>
        </>
      ),
    },
    unverified: {
      title: 'Vérifiez votre identité',
      text: "Seuls les membres dont l'identité est vérifiée peuvent contacter un vendeur et rejoindre une Business Room. La vérification se fait en quelques minutes depuis votre espace.",
      actions: <Button href="/espace">Vérifier mon identité</Button>,
    },
    demo: {
      title: 'Business Room non ouverte',
      text: DEMO_ROOM_TEXT,
      actions: (
        <>
          <Button href={`/actifs/${slug}`} variant="glass">Revenir à la fiche</Button>
          <Button href="/deposer-un-actif">Publier un actif</Button>
        </>
      ),
    },
    not_found: {
      title: 'Annonce introuvable',
      text: "Cette annonce n'existe pas ou n'est plus publiée.",
      actions: <Button href="/actifs">Voir les actifs</Button>,
    },
    requested: {
      title: 'Demande envoyée',
      text: "Le vendeur a été prévenu par e-mail. Vous recevrez un e-mail dès qu'il aura répondu ; cette page se met aussi à jour d'elle-même.",
      actions: <Button href="/espace" variant="glass">Mon espace</Button>,
    },
    declined: {
      title: "Le vendeur n'a pas donné suite",
      text: "Votre demande d'accès a été déclinée. D'autres actifs vous attendent dans le catalogue.",
      actions: <Button href="/actifs">Voir les actifs</Button>,
    },
    error: {
      title: 'Business Room indisponible',
      text: error ?? 'Une erreur est survenue. Réessayez dans un instant.',
      actions: <Button href={`/business-room/${slug}`} variant="glass">Réessayer</Button>,
    },
    request: {
      title: "Demander l'accès à la Business Room",
      text: "Le vendeur reçoit votre message et décide de vous admettre. Une fois admis, vous échangez avec lui et, s'il l'accepte, avec les autres acquéreurs vérifiés.",
      actions: null,
    },
  }[phase]

  return (
    <div className={styles.layout}>
      <Card padding="lg" accent className={styles.card}>
        <p className={styles.title}>{content.title}</p>
        <p className={styles.text}>{content.text}</p>
        {phase === 'request' ? <RequestForm onSubmit={onRequest} /> : <div className={styles.actions}>{content.actions}</div>}
      </Card>

      <Card padding="lg" className={styles.card}>
        <p className={styles.eyebrow}>Le cadre de la Business Room</p>
        <ul className={styles.rules}>
          {ROOM_FRAMEWORK.map((rule) => <li key={rule}>{rule}</li>)}
        </ul>
      </Card>
    </div>
  )
}
