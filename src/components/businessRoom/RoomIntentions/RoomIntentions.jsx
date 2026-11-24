'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button/Button'
import Card from '@/components/ui/Card/Card'
import Input from '@/components/ui/Input/Input'
import Select from '@/components/ui/Select/Select'
import FormStatus from '@/components/auth/FormStatus/FormStatus'
import { formatPrice } from '@/lib/format'
import { INTENTION_NOTICE } from '@/content/businessRoom'
import { formatTimestamp, INTENTION_MODES, intentionModeLabel, ROOM_LIMITS, validateIntention } from '@/lib/businessRoom/rules'
import { useAsyncAction } from '@/components/businessRoom/BusinessRoom/businessRoom.logic'
import styles from './RoomIntentions.module.css'

function IntentionForm({ current, onSave, onWithdraw, onDone }) {
  const [values, setValues] = useState({
    mode: current?.mode ?? '',
    amount: current?.indicative_amount ? String(current.indicative_amount) : '',
    note: current?.note ?? '',
  })
  const [errors, setErrors] = useState({})
  const { pending, error, run } = useAsyncAction()
  const set = (field) => (event) => setValues((previous) => ({ ...previous, [field]: event.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    const result = validateIntention(values)
    setErrors(result.errors)
    if (Object.keys(result.errors).length) return
    const saved = await run(() => onSave({ mode: values.mode, amount: result.amount, note: values.note }, Boolean(current)), "L'intention n'a pas pu être enregistrée.")
    if (saved) onDone()
  }

  const withdraw = async () => {
    if (await run(onWithdraw, "L'intention n'a pas pu être retirée.")) onDone()
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <Select label="Votre intention" placeholder="Choisir…" options={INTENTION_MODES} value={values.mode} onChange={set('mode')} error={errors.mode} />
      <Input
        label="Montant indicatif (facultatif)"
        hint="Ordre de grandeur de votre participation, en euros. Non engageant."
        inputMode="numeric"
        value={values.amount}
        onChange={set('amount')}
        error={errors.amount}
      />
      <Input multiline rows={3} label="Précisions (facultatif)" maxLength={ROOM_LIMITS.note} value={values.note} onChange={set('note')} error={errors.note} />
      <FormStatus tone="error">{error}</FormStatus>
      <div className={styles.actions}>
        <Button type="submit" size="sm" loading={pending}>Enregistrer</Button>
        {current && <Button size="sm" variant="ghost" onClick={withdraw} disabled={pending}>Retirer</Button>}
        <Button size="sm" variant="ghost" onClick={onDone} disabled={pending}>Annuler</Button>
      </div>
    </form>
  )
}

/*
 * Intentions individuelles et non engageantes.
 * Ligne rouge AMF : aucune somme, aucun total, aucune jauge n'est affiché.
 */
export default function RoomIntentions({ intentions, userId, isSeller, canWrite, nameOf, onSave, onWithdraw }) {
  const [editing, setEditing] = useState(false)
  const mine = intentions.find((intention) => intention.user_id === userId)

  return (
    <Card padding="lg" className={styles.card}>
      <p className={styles.eyebrow}>Intentions des acquéreurs</p>
      <p className={styles.notice}>{INTENTION_NOTICE}</p>

      {intentions.length === 0 && !editing && <p className={styles.empty}>Aucune intention déclarée.</p>}

      <ul className={styles.list}>
        {intentions.map((intention) => (
          <li key={intention.user_id} className={styles.item}>
            <p className={styles.who}>
              {intention.user_id === userId ? 'Vous' : nameOf(intention.user_id)}
              <span className={styles.mode}>{intentionModeLabel(intention.mode)}</span>
            </p>
            {intention.indicative_amount && (
              <p className={styles.amount}>
                Montant indicatif : <span className={styles.figure}>{formatPrice(intention.indicative_amount)}</span>
              </p>
            )}
            {intention.note && <p className={styles.note}>{intention.note}</p>}
            <p className={styles.date}>Non engageant · {formatTimestamp(intention.updated_at)}</p>
          </li>
        ))}
      </ul>

      {!isSeller && canWrite && (
        editing ? (
          <IntentionForm current={mine} onSave={onSave} onWithdraw={onWithdraw} onDone={() => setEditing(false)} />
        ) : (
          <Button size="sm" variant="glass" onClick={() => setEditing(true)}>
            {mine ? 'Modifier mon intention' : 'Indiquer mon intention'}
          </Button>
        )
      )}
    </Card>
  )
}
