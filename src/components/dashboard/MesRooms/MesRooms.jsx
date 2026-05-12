import { useState } from 'react'
import { Link } from 'react-router-dom'
import './MesRooms.css'

const ROOMS = [
  {
    id: '1',
    title: 'Immeuble de rapport — Centre historique',
    actifId: '1',
    category: 'Immobilier',
    location: 'Lyon 2ème',
    price: '1 250 000 €',
    status: 'active',
    members: 4,
    declared: 920000,
    target: 1250000,
    role: 'vendeur',
    lastActivity: 'Il y a 2h',
    unread: 3,
  },
  {
    id: '2',
    title: 'Restaurant gastronomique en activité',
    actifId: '2',
    category: 'Entreprise',
    location: 'Paris 8ème',
    price: '380 000 €',
    status: 'active',
    members: 3,
    declared: 280000,
    target: 380000,
    role: 'acquéreur',
    lastActivity: 'Hier',
    unread: 0,
  },
  {
    id: '3',
    title: 'Local commercial — Rue de la Paix',
    actifId: '3',
    category: 'Immobilier',
    location: 'Paris 1er',
    price: '850 000 €',
    status: 'concluded',
    members: 5,
    declared: 850000,
    target: 850000,
    role: 'acquéreur',
    lastActivity: '15 Jan 2025',
    unread: 0,
  },
]

const STATUS = {
  active:    { label: 'Active',  color: '#10B981' },
  concluded: { label: 'Conclue', color: '#F59E0B' },
  closed:    { label: 'Fermée',  color: '#9CA3AF' },
}

export default function MesRooms() {
  const [filter, setFilter] = useState('all')

  const filtered = ROOMS.filter((r) => {
    if (filter === 'active') return r.status === 'active'
    if (filter === 'concluded') return r.status === 'concluded'
    return true
  })

  return (
    <div className="mes-rooms">

      <div className="dash-section-header">
        <div>
          <h2 className="dash-section-title">Mes rooms</h2>
          <p className="dash-section-sub">
            {ROOMS.filter(r => r.status === 'active').length} room{ROOMS.filter(r => r.status === 'active').length > 1 ? 's' : ''} active{ROOMS.filter(r => r.status === 'active').length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="rooms-filters">
        {[
          { id: 'all', label: 'Toutes' },
          { id: 'active', label: 'Actives' },
          { id: 'concluded', label: 'Conclues' },
        ].map((f) => (
          <button
            key={f.id}
            className={`rooms-filter ${filter === f.id ? 'rooms-filter--active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="rooms-list">
        {filtered.map((room) => {
          const s = STATUS[room.status]
          const pct = Math.round((room.declared / room.target) * 100)
          return (
            <div key={room.id} className="room-item">

              <div className="room-item__header">
                <div className="room-item__main">
                  <div className="room-item__title">{room.title}</div>
                  <div className="room-item__meta">
                    <span>{room.category}</span>
                    <span>·</span>
                    <span>{room.location}</span>
                    <span>·</span>
                    <span>{room.price}</span>
                  </div>
                </div>
                <div className="room-item__badges">
                  <div
                    className="room-item__status"
                    style={{ color: s.color, borderColor: s.color + '33', background: s.color + '12' }}
                  >
                    {s.label}
                  </div>
                  <div className="room-item__role">{room.role}</div>
                  {room.unread > 0 && (
                    <div className="room-item__unread">{room.unread}</div>
                  )}
                </div>
              </div>

              <div className="room-item__progress">
                <div className="room-item__progress-labels">
                  <span>{(room.declared / 1000).toFixed(0)}k€ déclarés</span>
                  <span>{pct}%</span>
                </div>
                <div className="room-item__progress-bar">
                  <div
                    className="room-item__progress-fill"
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="room-item__footer">
                <div className="room-item__info">
                  <strong>{room.members}</strong> participants
                  <span>·</span>
                  <span>{room.lastActivity}</span>
                </div>
                {room.status === 'active' && (
                  <Link
                    to={`/business-room/${room.actifId}`}
                    className="room-item__cta"
                  >
                    Ouvrir la room →
                  </Link>
                )}
              </div>

            </div>
          )
        })}
      </div>

    </div>
  )
}
