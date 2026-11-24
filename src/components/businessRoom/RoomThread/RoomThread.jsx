'use client'

import { useEffect, useRef, useState } from 'react'
import Button from '@/components/ui/Button/Button'
import Card from '@/components/ui/Card/Card'
import FormStatus from '@/components/auth/FormStatus/FormStatus'
import { cx } from '@/lib/cx'
import { formatTimestamp, ROOM_LIMITS, validateMessage } from '@/lib/businessRoom/rules'
import { useAsyncAction } from '@/components/businessRoom/BusinessRoom/businessRoom.logic'
import styles from './RoomThread.module.css'

/* Fil d'échanges horodaté de la Business Room (ni modification ni suppression) */
export default function RoomThread({ messages, userId, sellerId, nameOf, canWrite, onSend }) {
  const [body, setBody] = useState('')
  const [fieldError, setFieldError] = useState(null)
  const { pending, error, run } = useAsyncAction()
  const listRef = useRef(null)

  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [messages.length])

  const submit = async (event) => {
    event.preventDefault()
    const problem = validateMessage(body)
    setFieldError(problem)
    if (problem) return
    if (await run(() => onSend(body), "Le message n'a pas pu être envoyé.")) setBody('')
  }

  const onKeyDown = (event) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) submit(event)
  }

  return (
    <Card padding="none" className={styles.thread}>
      <div className={styles.head}>
        <p className={styles.eyebrow}>Échanges</p>
        <p className={styles.trace}>Horodatés et conservés</p>
      </div>

      <ol className={styles.list} ref={listRef} aria-live="polite">
        {messages.length === 0 && <li className={styles.empty}>Aucun message pour l&apos;instant. Lancez l&apos;échange.</li>}
        {messages.map((message) => {
          const mine = message.author_id === userId
          return (
            <li key={message.id} className={cx(styles.message, mine && styles.mine)}>
              <p className={styles.meta}>
                <span className={styles.author}>{mine ? 'Vous' : nameOf(message.author_id)}</span>
                {message.author_id === sellerId && <span className={styles.role}>Vendeur</span>}
                <time dateTime={message.created_at}>{formatTimestamp(message.created_at)}</time>
              </p>
              <p className={styles.body}>{message.body}</p>
            </li>
          )
        })}
      </ol>

      {canWrite ? (
        <form className={styles.form} onSubmit={submit} noValidate>
          <label htmlFor="room-message" className="visually-hidden">Votre message</label>
          <textarea
            id="room-message"
            className={styles.input}
            rows={3}
            placeholder="Votre message (Ctrl + Entrée pour envoyer)"
            value={body}
            maxLength={ROOM_LIMITS.message}
            onChange={(event) => setBody(event.target.value)}
            onKeyDown={onKeyDown}
          />
          <div className={styles.formFoot}>
            <FormStatus tone="error">{fieldError || error}</FormStatus>
            <Button type="submit" size="sm" loading={pending}>Envoyer</Button>
          </div>
        </form>
      ) : (
        <p className={styles.locked}>Vérifiez votre identité depuis votre espace pour écrire dans la Business Room.</p>
      )}
    </Card>
  )
}
