'use client'

import Badge from '@/components/ui/Badge/Badge'
import Button from '@/components/ui/Button/Button'
import Card from '@/components/ui/Card/Card'
import FormStatus from '@/components/auth/FormStatus/FormStatus'
import { formatTimestamp } from '@/lib/businessRoom/rules'
import { useAsyncAction } from '@/components/businessRoom/BusinessRoom/businessRoom.logic'
import styles from './RoomParticipants.module.css'

function PendingRequest({ request, onDecide }) {
  const { pending, error, run } = useAsyncAction()
  const decide = (accept) => run(() => onDecide(request.user_id, accept), "La réponse n'a pas pu être enregistrée.")

  return (
    <li className={styles.request}>
      <p className={styles.name}>
        {request.display_name}
        <span className={styles.kind}>{request.member_kind === 'professionnel' ? 'Professionnel' : 'Particulier'}</span>
      </p>
      <p className={styles.since}>Identité vérifiée · demande du {formatTimestamp(request.since)}</p>
      {request.intro && <p className={styles.intro}>{request.intro}</p>}
      <div className={styles.actions}>
        <Button size="sm" onClick={() => decide(true)} loading={pending}>Admettre</Button>
        <Button size="sm" variant="ghost" onClick={() => decide(false)} disabled={pending}>Décliner</Button>
      </div>
      <FormStatus tone="error">{error}</FormStatus>
    </li>
  )
}

/* Participants de la Business Room ; le vendeur y traite aussi les demandes d'accès */
export default function RoomParticipants({ participants, isSeller, coAcquisition, onDecide }) {
  const members = participants.filter((participant) => participant.status === 'active')
  const requests = participants.filter((participant) => participant.status === 'requested')

  return (
    <Card padding="lg" className={styles.card}>
      <div className={styles.head}>
        <p className={styles.eyebrow}>Participants</p>
        {coAcquisition && <Badge tone="cobalt">Plusieurs acquéreurs</Badge>}
      </div>

      <ul className={styles.list}>
        {members.map((member) => (
          <li key={member.user_id} className={styles.member}>
            <span className={styles.name}>{member.display_name}</span>
            <span className={styles.role}>{member.is_seller ? 'Vendeur' : 'Acquéreur'}</span>
          </li>
        ))}
      </ul>

      {isSeller && (
        <div className={styles.requests}>
          <p className={styles.eyebrow}>Demandes d&apos;accès {requests.length > 0 && `(${requests.length})`}</p>
          {requests.length === 0 ? (
            <p className={styles.empty}>Aucune demande en attente.</p>
          ) : (
            <ul className={styles.list}>
              {requests.map((request) => <PendingRequest key={request.user_id} request={request} onDecide={onDecide} />)}
            </ul>
          )}
        </div>
      )}
    </Card>
  )
}
