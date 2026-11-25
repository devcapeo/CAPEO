'use client'

import Drawer from '@/components/admin/Drawer/Drawer'
import Button from '@/components/ui/Button/Button'
import Badge from '@/components/ui/Badge/Badge'
import Spinner from '@/components/ui/Spinner/Spinner'
import FormStatus from '@/components/auth/FormStatus/FormStatus'
import { DEVICE_LABELS, KYC_LABELS, REVIEW_LABELS, actionLabel, formatDateTime, formatDuration, formatNumber, formatTime } from '@/lib/admin/period'
import { pageName } from '@/components/admin/sections/PagesSection/pagesSection.logic'
import { memberName } from '@/components/admin/sections/MembersSection/membersSection.logic'
import { useMemberDetail } from './memberDrawer.logic'
import styles from './MemberDrawer.module.css'

function Field({ label, children }) {
  return (
    <div className={styles.field}>
      <dt>{label}</dt>
      <dd>{children ?? '—'}</dd>
    </div>
  )
}

function Journey({ journey, summary }) {
  if (journey.loading && !journey.data) return <Spinner />
  if (!summary.days.length) return <p className={styles.empty}>Aucune visite mesurée pour ce membre.</p>

  return (
    <div className={styles.days}>
      {summary.days.map((day) => (
        <section key={day.day} className={styles.day}>
          <p className={styles.dayLabel}>{day.day}</p>
          <ol className={styles.timeline}>
            {day.events.map((event, index) => (
              <li key={`${event.created_at}-${index}`} className={styles.step}>
                <time>{formatTime(event.created_at)}</time>
                <span>
                  <strong>{actionLabel(event.event)}</strong>
                  {event.label ? ` « ${event.label} »` : ''}
                  {event.event === 'page_leave' && event.duration_ms ? ` · ${formatDuration(event.duration_ms / 1000)}, ${event.scroll_pct ?? 0} % lus` : ''}
                  <small>
                    {pageName(event.path)}
                    {event.referrer_host ? ` · arrivé depuis ${event.referrer_host}` : ''}
                    {!event.logged ? ' · avant connexion' : ''}
                  </small>
                </span>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}

/* Fiche membre : identité, statuts, actions de modération, parcours complet sur le site */
export default function MemberDrawer({ member, onClose, onChanged }) {
  const detail = useMemberDetail(member, onChanged)
  if (!member) return null
  const { summary } = detail

  return (
    <Drawer
      open
      title={memberName(member)}
      subtitle={member.email}
      onClose={onClose}
      footer={
        <>
          <Button size="sm" onClick={() => detail.review('approved')} loading={detail.pending === 'review-approved'} disabled={member.review_status === 'approved'}>
            Valider le profil
          </Button>
          <Button size="sm" variant="ghost" onClick={() => detail.review('rejected')} loading={detail.pending === 'review-rejected'} disabled={member.review_status === 'rejected'}>
            Refuser
          </Button>
          <Button size="sm" variant="ghost" onClick={() => detail.review('pending')} disabled={member.review_status === 'pending'}>
            Remettre à examiner
          </Button>
          <Button
            size="sm"
            variant="glass"
            onClick={() => {
              const role = member.role === 'admin' ? 'member' : 'admin'
              if (window.confirm(role === 'admin' ? `Donner les droits d'administration à ${memberName(member)} ?` : `Retirer les droits d'administration de ${memberName(member)} ?`)) detail.setRole(role)
            }}
            loading={detail.pending?.startsWith('role')}
          >
            {member.role === 'admin' ? 'Retirer admin' : 'Nommer admin'}
          </Button>
        </>
      }
    >
      <FormStatus tone="error">{detail.actionError}</FormStatus>

      <div className={styles.badges}>
        <Badge tone={KYC_LABELS[member.kyc_status].tone}>Identité : {KYC_LABELS[member.kyc_status].label}</Badge>
        <Badge tone={REVIEW_LABELS[member.review_status].tone}>Examen : {REVIEW_LABELS[member.review_status].label}</Badge>
        {member.role === 'admin' && <Badge tone="gold">Admin</Badge>}
        {!member.email_confirmed_at && <Badge tone="danger">E-mail non confirmé</Badge>}
      </div>

      <dl className={styles.fields}>
        <Field label="Type">{member.member_kind === 'professionnel' ? 'Professionnel' : 'Particulier'}</Field>
        <Field label="Société">{member.company_name}</Field>
        <Field label="Téléphone">{member.phone}</Field>
        <Field label="Inscription">{formatDateTime(member.created_at)}</Field>
        <Field label="Dernière connexion">{formatDateTime(member.last_sign_in_at)}</Field>
        <Field label="Dernière visite">{formatDateTime(member.last_seen)}</Field>
        <Field label="Annonces">{formatNumber(member.listings)}</Field>
        <Field label="Business Rooms">{formatNumber(member.rooms)}</Field>
      </dl>

      <section className={styles.block}>
        <p className={styles.blockTitle}>Habitudes</p>
        <dl className={styles.fields}>
          <Field label="Pages vues">{formatNumber(summary.pageviews)}</Field>
          <Field label="Clics">{formatNumber(summary.clicks)}</Field>
          <Field label="Temps total">{formatDuration(summary.timeSeconds)}</Field>
          <Field label="Appareil">{DEVICE_LABELS[summary.device] ?? summary.device}</Field>
          <Field label="Navigateur">{summary.browser}</Field>
          <Field label="Ville">{summary.city}</Field>
          <Field label="Première provenance">{summary.referrer}</Field>
          <Field label="Première visite">{formatDateTime(summary.firstSeen)}</Field>
        </dl>
      </section>

      <section className={styles.block}>
        <p className={styles.blockTitle}>Parcours sur le site</p>
        <p className={styles.hint}>Y compris ses visites depuis le même navigateur avant de se connecter. Les 800 derniers événements.</p>
        <Journey journey={detail.journey} summary={summary} />
      </section>
    </Drawer>
  )
}
