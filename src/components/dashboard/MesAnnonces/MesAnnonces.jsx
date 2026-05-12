import { useState } from 'react'
import { Link } from 'react-router-dom'
import './MesAnnonces.css'

const ANNONCES = [
  {
    id: '1',
    title: 'Immeuble de rapport — Centre historique',
    category: 'Immobilier',
    price: '1 250 000 €',
    status: 'active',
    views: 142,
    contacts: 14,
    rooms: 1,
    verified: true,
    date: '12 Jan 2025',
  },
  {
    id: '2',
    title: 'Local commercial — Rue de la République',
    category: 'Immobilier',
    price: '320 000 €',
    status: 'pending',
    views: 0,
    contacts: 0,
    rooms: 0,
    verified: false,
    date: '28 Jan 2025',
  },
]

const STATUS = {
  active:   { label: 'Active',     color: '#10B981' },
  pending:  { label: 'En attente', color: '#F59E0B' },
  sold:     { label: 'Vendu',      color: '#3B82F6' },
  archived: { label: 'Archivée',   color: '#9CA3AF' },
}

export default function MesAnnonces() {
  const [annonces] = useState(ANNONCES)

  return (
    <div className="mes-annonces">

      <div className="dash-section-header">
        <div>
          <h2 className="dash-section-title">Mes annonces</h2>
          <p className="dash-section-sub">
            {annonces.length} annonce{annonces.length > 1 ? 's' : ''} publiée{annonces.length > 1 ? 's' : ''}
          </p>
        </div>
        <Link to="/proposer-un-actif" className="dash-btn-primary">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v10M2 7h10"
              stroke="currentColor" strokeWidth="1.4"
              strokeLinecap="round"/>
          </svg>
          Nouvelle annonce
        </Link>
      </div>

      {annonces.length === 0 ? (
        <div className="dash-empty">
          <p>Aucune annonce publiée.</p>
          <Link to="/proposer-un-actif" className="dash-btn-primary">
            Publier un actif
          </Link>
        </div>
      ) : (
        <div className="annonces-list">
          {annonces.map((a) => {
            const s = STATUS[a.status]
            return (
              <div key={a.id} className="annonce-item">
                <div className="annonce-item__main">
                  <div className="annonce-item__title">{a.title}</div>
                  <div className="annonce-item__meta">
                    <span>{a.category}</span>
                    <span>·</span>
                    <span>{a.price}</span>
                    <span>·</span>
                    <span>{a.date}</span>
                  </div>
                </div>

                <div className="annonce-item__stats">
                  <div className="annonce-stat">
                    <strong>{a.views}</strong>
                    <span>vues</span>
                  </div>
                  <div className="annonce-stat">
                    <strong>{a.contacts}</strong>
                    <span>contacts</span>
                  </div>
                  <div className="annonce-stat">
                    <strong>{a.rooms}</strong>
                    <span>rooms</span>
                  </div>
                </div>

                <div className="annonce-item__right">
                  <div
                    className="annonce-item__status"
                    style={{ color: s.color, borderColor: s.color + '33', background: s.color + '12' }}
                  >
                    {s.label}
                  </div>
                  {a.verified ? (
                    <div className="annonce-item__verified">
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                        <path d="M1.5 4.5l2 2 4-4"
                          stroke="currentColor" strokeWidth="1.2"
                          strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Vérifié
                    </div>
                  ) : (
                    <div className="annonce-item__pending-verify">
                      En vérification
                    </div>
                  )}
                  <Link to={`/actifs/${a.id}`} className="annonce-item__link">
                    Voir →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
