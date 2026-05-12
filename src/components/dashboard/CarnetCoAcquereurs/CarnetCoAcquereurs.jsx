import { useState } from 'react'
import './CarnetCoAcquereurs.css'

const CONTACTS = [
  {
    id: '1',
    name: 'Marc D.',
    initials: 'M',
    location: 'Paris',
    budget: '150k — 300k€',
    structures: ['Nom propre', 'SCI'],
    deals: 2,
    metIn: 'Room — Local Paris 1er',
    verified: true,
    note: 'Sérieux, réactif. SCI avec associé.',
  },
  {
    id: '2',
    name: 'Sophie L.',
    initials: 'S',
    location: 'Lyon',
    budget: '100k — 200k€',
    structures: ['SCI'],
    deals: 1,
    metIn: 'Room — Local Paris 1er',
    verified: true,
    note: '',
  },
]

export default function CarnetCoAcquereurs() {
  const [contacts] = useState(CONTACTS)
  const [selected, setSelected] = useState(null)

  return (
    <div className="carnet">

      <div className="dash-section-header">
        <div>
          <h2 className="dash-section-title">Co-acquéreurs</h2>
          <p className="dash-section-sub">
            {contacts.length} contact{contacts.length > 1 ? 's' : ''} dans votre réseau
          </p>
        </div>
      </div>

      <div className="carnet-grid">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className={`carnet-card ${selected === contact.id ? 'carnet-card--selected' : ''}`}
            onClick={() => setSelected(selected === contact.id ? null : contact.id)}
          >
            <div className="carnet-card__header">
              <div className="carnet-card__avatar">{contact.initials}</div>
              <div className="carnet-card__info">
                <div className="carnet-card__name">{contact.name}</div>
                <div className="carnet-card__location">{contact.location}</div>
              </div>
              {contact.verified && (
                <div className="carnet-card__verified">
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path d="M1.5 4.5l2 2 4-4"
                      stroke="currentColor" strokeWidth="1.2"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>

            <div className="carnet-card__stats">
              <div className="carnet-card__stat">
                <span>{contact.budget}</span>
                <span className="carnet-card__stat-label">Budget</span>
              </div>
              <div className="carnet-card__stat">
                <span>{contact.deals}</span>
                <span className="carnet-card__stat-label">Deals</span>
              </div>
            </div>

            <div className="carnet-card__structures">
              {contact.structures.map((s) => (
                <span key={s} className="carnet-card__structure">{s}</span>
              ))}
            </div>

            <div className="carnet-card__met">Via : {contact.metIn}</div>

            {selected === contact.id && (
              <div className="carnet-card__expanded">
                {contact.note && (
                  <div className="carnet-card__note">
                    <div className="carnet-card__note-label">Note</div>
                    <div className="carnet-card__note-text">{contact.note}</div>
                  </div>
                )}
                <button className="carnet-card__msg-btn">
                  Envoyer un message
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  )
}
