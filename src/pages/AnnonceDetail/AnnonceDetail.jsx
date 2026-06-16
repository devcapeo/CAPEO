/* ============================================
   CAPEO — ANNONCE DETAIL V3
   V1 immobilier. Sans rendement, sans barre
   d'intentions (AMF safe). Compteur social.
   ============================================ */

import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ActifDisclaimer from '../../components/annonces/ActifDisclaimer/ActifDisclaimer.jsx'
import VerifiedBadge from '../../components/annonces/VerifiedBadge/VerifiedBadge.jsx'
import './AnnonceDetail.css'

const ACTIFS_DATA = {
  '1': {
    id: '1',
    category: 'Immeuble de rapport',
    title: 'Immeuble de rapport — Centre historique',
    location: 'Lyon 2ème',
    details: '8 appartements · 480 m² · Construit en 1890',
    price: 1250000,
    priceDisplay: '1 250 000 €',
    interests: 14,
    verified: true,
    description: `Immeuble haussmannien de caractère situé en plein cœur du 2ème arrondissement de Lyon, à deux pas de la Place des Terreaux. Le bien comprend 8 appartements dont 1 local commercial en rez-de-chaussée. Entièrement rénové en 2019, l'immeuble bénéficie d'une excellente situation locative. Toutes les parties communes ont été refaites à neuf. Idéal pour une acquisition collective en SCI.`,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1400&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1400&q=80',
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&q=80',
    ],
    specs: [
      { label: 'Surface totale', value: '480 m²' },
      { label: 'Nombre de lots', value: '8' },
      { label: 'Année construction', value: '1890' },
      { label: 'Dernière rénovation', value: '2019' },
      { label: 'DPE', value: 'C' },
      { label: 'Type', value: 'Immeuble entier' },
    ],
    // Données factuelles déclarées (sans rendement ni %)
    declared: [
      { label: 'Loyers annuels', value: '65 000 €' },
      { label: 'Charges annuelles', value: '17 800 €' },
    ],
    seller: { name: 'Jean-Marc D.', verified: true, memberSince: '2024', deals: 3 },
    roomMembers: 4,
    roomAvatars: [
      { initials: 'M', zone: 'PACA' },
      { initials: 'S', zone: 'Lyon' },
      { initials: 'L', zone: 'Paris' },
      { initials: 'A', zone: 'Genève' },
    ],
  },
}

export default function AnnonceDetail() {
  const { id } = useParams()
  const [imgIndex, setImgIndex] = useState(0)
  const [hasRoomAccess, setHasRoomAccess] = useState(false)

  const actif = ACTIFS_DATA[id] || ACTIFS_DATA['1']

  const prevImg = () => setImgIndex((i) => (i === 0 ? actif.images.length - 1 : i - 1))
  const nextImg = () => setImgIndex((i) => (i + 1) % actif.images.length)

  return (
    <div className="detail-page">

      {/* ── CARROUSEL ── */}
      <div className="detail-carousel">
        <img src={actif.images[imgIndex]} alt={actif.title} className="detail-carousel__img" />
        <div className="detail-carousel__overlay"></div>

        <Link to="/actifs" className="detail-carousel__back">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L3 7l6 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Retour aux biens
        </Link>

        {actif.images.length > 1 && (
          <>
            <button className="detail-carousel__nav detail-carousel__nav--prev" onClick={prevImg}>‹</button>
            <button className="detail-carousel__nav detail-carousel__nav--next" onClick={nextImg}>›</button>
          </>
        )}

        <div className="detail-carousel__dots">
          {actif.images.map((_, i) => (
            <button key={i} className={`detail-carousel__dot ${i === imgIndex ? 'detail-carousel__dot--active' : ''}`} onClick={() => setImgIndex(i)} />
          ))}
        </div>

        <div className="detail-carousel__badges">
          <div className="detail-carousel__cat">{actif.category}</div>
          {actif.verified && <VerifiedBadge />}
        </div>
      </div>

      {/* ── LAYOUT ── */}
      <div className="detail-layout">
        <div className="detail-layout__inner">

          {/* ── GAUCHE ── */}
          <div className="detail-left">

            <div className="detail-hero">
              <h1 className="detail-hero__title">{actif.title}</h1>
              <div className="detail-hero__meta">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1"/>
                  <path d="M6 11C4 9 2 7 2 5a4 4 0 018 0c0 2-2 4-4 6z" stroke="currentColor" strokeWidth="1"/>
                </svg>
                {actif.location} · {actif.details}
              </div>
              <div className="detail-hero__price">{actif.priceDisplay}</div>
            </div>

            <div className="detail-block">
              <div className="detail-block__title">Description</div>
              <p className="detail-block__text">{actif.description}</p>
            </div>

            <div className="detail-block">
              <div className="detail-block__title">Caractéristiques</div>
              <div className="detail-specs">
                {actif.specs.map((spec) => (
                  <div key={spec.label} className="detail-spec">
                    <div className="detail-spec__label">{spec.label}</div>
                    <div className="detail-spec__value">{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-block">
              <div className="detail-block__title">
                Données financières
                <span className="detail-block__title-note">— déclarées par le vendeur, non vérifiées par CAPEO</span>
              </div>
              <div className="detail-indicators">
                {actif.declared.map((ind) => (
                  <div key={ind.label} className="detail-indicator">
                    <div className="detail-indicator__label">{ind.label}</div>
                    <div className="detail-indicator__value">{ind.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <ActifDisclaimer />

          </div>

          {/* ── DROITE ── */}
          <div className="detail-right">

            {/* Vendeur */}
            <div className="detail-seller">
              <div className="detail-seller__header">
                <div className="detail-seller__avatar">{actif.seller.name.charAt(0)}</div>
                <div className="detail-seller__info">
                  <div className="detail-seller__name">{actif.seller.name}</div>
                  <div className="detail-seller__since">Membre depuis {actif.seller.memberSince}</div>
                </div>
                {actif.seller.verified && <VerifiedBadge small />}
              </div>
              <div className="detail-seller__verified-note">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M6.5 1l4 1.7v2.8c0 2.6-1.7 4.3-4 5.2-2.3-.9-4-2.6-4-5.2V2.7L6.5 1z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
                  <path d="M4.7 6.3l1.2 1.2 2.4-2.7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Bien et vendeur vérifiés par l'équipe CAPEO
              </div>
              <div className="detail-seller__stats">
                <div className="detail-seller__stat"><strong>{actif.seller.deals}</strong><span>deals</span></div>
                <div className="detail-seller__stat"><strong>{actif.interests}</strong><span>intéressés</span></div>
              </div>
            </div>

            {/* Business Room */}
            <div className="detail-room-block">
              <div className="detail-room-status">
                <div className="detail-room-status__dot"></div>
                <span>Business Room ouverte</span>
              </div>

              {/* Compteur social — pas de montants */}
              <div className="detail-room-circle">
                <div className="detail-room-circle__avatars">
                  {actif.roomAvatars.map((a, i) => (
                    <div key={i} className="detail-room-circle__avatar" title={`Vérifié · ${a.zone}`}>{a.initials}</div>
                  ))}
                </div>
                <div className="detail-room-circle__text">
                  <strong>{actif.roomMembers} acquéreurs vérifiés</strong>
                  ont rejoint la Business Room de ce bien
                </div>
              </div>

{!hasRoomAccess ? (
                <button className="detail-room-join" onClick={() => setHasRoomAccess(true)}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Rejoindre la Business Room
                </button>
              ) : (
                <div className="detail-room-unlocked">
                  <div className="detail-room-unlocked__icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.2"/>
                    </svg>
                  </div>
                  <div className="detail-room-unlocked__title">Accès confirmé</div>
                  <p className="detail-room-unlocked__desc">Vous avez accès à la Business Room de ce bien.</p>
                  <Link to={`/business-room/${actif.id}`} className="detail-room-unlocked__btn">Accéder à la Business Room →</Link>
                </div>
              )}
              <p className="detail-room-free">
                Gratuit pendant notre phase de lancement. Inscription et vérification requises.
              </p>
            </div>

            {/* Réassurance suite */}
            <Link to="/comment-ca-marche" className="detail-next">
              <div className="detail-next__title">Comment se passe la suite ?</div>
              <div className="detail-next__desc">Vérification, Business Room, structuration du projet — découvrez chaque étape.</div>
              <div className="detail-next__link">
                <span>En savoir plus</span>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 6.5h7M6.5 3l3.5 3.5L6.5 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </Link>

          </div>

        </div>
      </div>

    </div>
  )
}
