'use client'

import Link from 'next/link'
import Button from '@/components/ui/Button/Button'
import Spinner from '@/components/ui/Spinner/Spinner'
import SectionHeading from '@/components/common/SectionHeading/SectionHeading'
import FormStatus from '@/components/auth/FormStatus/FormStatus'
import RoomAccess from '@/components/businessRoom/RoomAccess/RoomAccess'
import RoomThread from '@/components/businessRoom/RoomThread/RoomThread'
import RoomParticipants from '@/components/businessRoom/RoomParticipants/RoomParticipants'
import RoomIntentions from '@/components/businessRoom/RoomIntentions/RoomIntentions'
import RoomDocuments from '@/components/businessRoom/RoomDocuments/RoomDocuments'
import RoomGuide from '@/components/businessRoom/RoomGuide/RoomGuide'
import { ROOM_INTRO } from '@/content/businessRoom'
import { useAsyncAction, useBusinessRoom } from './businessRoom.logic'
import styles from './BusinessRoom.module.css'

export default function BusinessRoom({ slug, showListingLink }) {
  const room = useBusinessRoom(slug)
  const leaving = useAsyncAction()
  const { phase, asset, user, isSeller, isVerified, actions } = room

  if (phase === 'loading') {
    return (
      <div className={styles.loading}>
        <Spinner />
      </div>
    )
  }

  const heading = (
    <div className={styles.header}>
      <SectionHeading
        as="h1"
        eyebrow="Business Room"
        title={asset?.title ?? 'Espace privé'}
        accent={asset ? undefined : 'par actif.'}
        intro={asset ? `${asset.city}${asset.region ? ` · ${asset.region}` : ''}` : ROOM_INTRO}
      />
      {asset && (
        <div className={styles.headerActions}>
          {asset.status === 'published' && showListingLink && (
            <Link href={`/actifs/${asset.slug}`} className={styles.link}>Voir la fiche</Link>
          )}
          {phase === 'room' && !isSeller && (
            <Button
              size="sm"
              variant="ghost"
              loading={leaving.pending}
              onClick={() => {
                if (window.confirm('Quitter cette Business Room ? Vos messages restent visibles des participants.')) {
                  leaving.run(actions.leave, "Impossible de quitter la Business Room.")
                }
              }}
            >
              Quitter
            </Button>
          )}
        </div>
      )}
      <FormStatus tone="error">{leaving.error}</FormStatus>
    </div>
  )

  if (phase !== 'room') {
    return (
      <div className={styles.wrapper}>
        {heading}
        <RoomAccess phase={phase} slug={slug} error={room.error} onRequest={actions.requestAccess} />
      </div>
    )
  }

  const canWrite = isVerified

  return (
    <div className={styles.wrapper}>
      {heading}
      {isSeller && !isVerified && (
        <FormStatus tone="info">
          Vous êtes le vendeur de cet actif. Vérifiez votre identité depuis votre espace pour écrire et partager des documents.
        </FormStatus>
      )}
      {isSeller && asset.status !== 'published' && (
        <FormStatus tone="info">
          Votre annonce n&apos;est pas encore publiée : la Business Room s&apos;ouvrira aux acquéreurs après examen par notre équipe.
        </FormStatus>
      )}

      <div className={styles.layout}>
        <div className={styles.main}>
          <RoomThread
            messages={room.messages}
            userId={user.id}
            sellerId={asset.seller_id}
            nameOf={room.nameOf}
            canWrite={canWrite}
            onSend={actions.postMessage}
          />
        </div>

        <aside className={styles.aside}>
          <RoomParticipants
            participants={room.participants}
            isSeller={isSeller}
            coAcquisition={asset.co_acquisition}
            onDecide={actions.decide}
          />
          <RoomIntentions
            intentions={room.intentions}
            userId={user.id}
            isSeller={isSeller}
            canWrite={canWrite}
            nameOf={room.nameOf}
            onSave={actions.saveIntention}
            onWithdraw={actions.withdrawIntention}
          />
          <RoomDocuments
            documents={room.documents}
            expectedLabels={asset.document_labels}
            canWrite={canWrite}
            nameOf={room.nameOf}
            userId={user.id}
            onUpload={actions.addDocument}
            onOpen={actions.openDocument}
          />
          <RoomGuide />
        </aside>
      </div>
    </div>
  )
}
