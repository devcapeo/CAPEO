'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button/Button'
import Modal from '@/components/ui/Modal/Modal'
import { useToast } from '@/components/ui/Toast/toast.logic'
import styles from './StyleguideDemo.module.css'

/* Démonstration interactive (modale + notifications) pour la page /styleguide. */
export default function StyleguideDemo() {
  const [open, setOpen] = useState(false)
  const { notify } = useToast()

  return (
    <div className={styles.row}>
      <Button variant="glass" onClick={() => setOpen(true)}>Ouvrir une modale</Button>
      <Button variant="ghost" onClick={() => notify({ title: 'Annonce enregistrée', message: 'Elle sera publiée après modération.', tone: 'success' })}>
        Notification succès
      </Button>
      <Button variant="ghost" onClick={() => notify({ title: 'Mise en avant activée', message: 'Votre annonce apparaît en tête de liste.', tone: 'gold' })}>
        Notification or
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Contacter le vendeur"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={() => setOpen(false)}>Envoyer</Button>
          </>
        }
      >
        Votre message sera transmis au vendeur. Vos coordonnées ne lui sont communiquées qu&apos;avec votre accord.
      </Modal>
    </div>
  )
}
