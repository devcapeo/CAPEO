'use client'

import { useRef } from 'react'
import Button from '@/components/ui/Button/Button'
import Card from '@/components/ui/Card/Card'
import FormStatus from '@/components/auth/FormStatus/FormStatus'
import { DOCUMENT_NOTICE } from '@/content/businessRoom'
import { ALLOWED_FILE_TYPES, FILE_ACCEPT, formatBytes, formatTimestamp, validateFile } from '@/lib/businessRoom/rules'
import { useAsyncAction } from '@/components/businessRoom/BusinessRoom/businessRoom.logic'
import styles from './RoomDocuments.module.css'

/* Documents partagés : stockage privé, liens de téléchargement temporaires, aucun retrait (traçabilité) */
export default function RoomDocuments({ documents, expectedLabels, canWrite, nameOf, userId, onUpload, onOpen }) {
  const inputRef = useRef(null)
  const upload = useAsyncAction()
  const open = useAsyncAction()

  const onFile = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    const problem = validateFile(file)
    if (problem) {
      upload.run(() => Promise.reject(new Error(problem)), problem)
      return
    }
    await upload.run(() => onUpload(file), "Le document n'a pas pu être déposé.")
  }

  return (
    <Card padding="lg" className={styles.card}>
      <p className={styles.eyebrow}>Documents</p>
      <p className={styles.notice}>{DOCUMENT_NOTICE}</p>

      {expectedLabels?.length > 0 && (
        <p className={styles.expected}>Annoncés par le vendeur : {expectedLabels.join(' · ')}</p>
      )}

      {documents.length === 0 ? (
        <p className={styles.empty}>Aucun document partagé.</p>
      ) : (
        <ul className={styles.list}>
          {documents.map((doc) => (
            <li key={doc.id} className={styles.item}>
              <button type="button" className={styles.file} onClick={() => open.run(() => onOpen(doc), "Le document n'a pas pu être ouvert.")}>
                {doc.file_name}
              </button>
              <p className={styles.meta}>
                {ALLOWED_FILE_TYPES[doc.mime_type] ?? 'Fichier'} · {formatBytes(doc.size_bytes)} · {doc.uploader_id === userId ? 'vous' : nameOf(doc.uploader_id)} · {formatTimestamp(doc.created_at)}
              </p>
            </li>
          ))}
        </ul>
      )}
      <FormStatus tone="error">{open.error}</FormStatus>

      {canWrite && (
        <>
          <input ref={inputRef} type="file" accept={FILE_ACCEPT} className="visually-hidden" onChange={onFile} tabIndex={-1} aria-hidden="true" />
          <Button size="sm" variant="glass" onClick={() => inputRef.current?.click()} loading={upload.pending}>
            Déposer un document
          </Button>
          <p className={styles.hint}>PDF, images, Word ou Excel · 20 Mo maximum.</p>
          <FormStatus tone="error">{upload.error}</FormStatus>
        </>
      )}
    </Card>
  )
}
