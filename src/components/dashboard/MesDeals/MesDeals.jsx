import { useState } from 'react'
import { Link } from 'react-router-dom'
import './MesDeals.css'

const DEALS = [
  {
    id: '1',
    title: 'Local commercial — Rue de la Paix',
    actifId: '3',
    category: 'Immobilier',
    location: 'Paris 1er',
    totalPrice: '850 000 €',
    myApport: '170 000 €',
    myPct: 20,
    structure: 'SCI',
    coAcquereurs: 4,
    date: '15 Jan 2025',
  },
]

export default function MesDeals() {
  const [deals] = useState(DEALS)

  return (
    <div className="mes-deals">

      <div className="dash-section-header">
        <div>
          <h2 className="dash-section-title">Mes deals</h2>
          <p className="dash-section-sub">
            {deals.length} deal{deals.length > 1 ? 's' : ''} conclu{deals.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {deals.length === 0 ? (
        <div className="dash-empty">
          <p>Aucun deal conclu via CAPEO pour l'instant.</p>
          <Link to="/actifs" className="dash-btn-primary">
            Explorer les actifs
          </Link>
        </div>
      ) : (
        <div className="deals-list">
          {deals.map((deal) => (
            <div key={deal.id} className="deal-item">

              <div className="deal-item__header">
                <div className="deal-item__main">
                  <div className="deal-item__title">{deal.title}</div>
                  <div className="deal-item__meta">
                    <span>{deal.category}</span>
                    <span>·</span>
                    <span>{deal.location}</span>
                    <span>·</span>
                    <span>Conclu le {deal.date}</span>
                  </div>
                </div>
                <div className="deal-item__badge">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2 2 4-4"
                      stroke="currentColor" strokeWidth="1.2"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Deal conclu
                </div>
              </div>

              <div className="deal-item__stats">
                {[
                  { label: 'Prix total',     value: deal.totalPrice },
                  { label: 'Mon apport',     value: deal.myApport, gold: true },
                  { label: 'Ma part',        value: `${deal.myPct}%` },
                  { label: 'Structure',      value: deal.structure },
                  { label: 'Co-acquéreurs', value: deal.coAcquereurs },
                ].map((stat) => (
                  <div key={stat.label} className="deal-stat">
                    <div className="deal-stat__label">{stat.label}</div>
                    <div className={`deal-stat__value ${stat.gold ? 'deal-stat__value--gold' : ''}`}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  )
}
