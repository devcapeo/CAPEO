import { useState } from 'react'
import './MonCompte.css'

export default function MonCompte({ user }) {
  const [alerts, setAlerts] = useState({
    newActif:     true,
    roomActivity: true,
    offMarket:    true,
    newsletter:   false,
  })
  const [saved, setSaved] = useState(false)

  const toggle = (key) => {
    setAlerts((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="mon-compte">

      <div className="dash-section-header">
        <div>
          <h2 className="dash-section-title">Mon compte</h2>
          <p className="dash-section-sub">Paramètres et préférences</p>
        </div>
        <button
          className={`dash-btn-primary ${saved ? 'dash-btn-primary--saved' : ''}`}
          onClick={handleSave}
        >
          {saved ? '✓ Enregistré' : 'Enregistrer'}
        </button>
      </div>

      {/* Abonnement */}
      <div className="compte-block">
        <div className="compte-block__title">Abonnement</div>
        <div className="compte-plan">
          <div className="compte-plan__info">
            <div className="compte-plan__name">
              {user.isPremium ? 'CAPEO+' : 'Compte gratuit'}
            </div>
            <div className="compte-plan__desc">
              {user.isPremium
                ? 'Rooms illimitées · Off Market · Alertes · Profil patrimoine'
                : 'Accès aux annonces publiques uniquement'}
            </div>
          </div>
          {user.isPremium ? (
            <div className="compte-plan__badge">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 1l1 3h3L6.5 6l1 3L5 7.5 2.5 9l1-3L1 4h3z"
                  stroke="currentColor" strokeWidth="0.8"
                  strokeLinejoin="round"/>
              </svg>
              CAPEO+ actif
            </div>
          ) : (
            <button className="compte-upgrade-btn">
              Passer à CAPEO+ — 19,90€/mois
            </button>
          )}
        </div>
        {user.isPremium && (
          <div className="compte-plan__actions">
            <button className="compte-link-btn">Gérer l'abonnement</button>
            <button className="compte-link-btn compte-link-btn--danger">Annuler</button>
          </div>
        )}
      </div>

      {/* Alertes */}
      <div className="compte-block">
        <div className="compte-block__title">Notifications</div>
        <div className="compte-alerts">
          {[
            { key: 'newActif',     label: 'Nouvel actif correspondant à mon profil' },
            { key: 'roomActivity', label: 'Activité dans mes rooms' },
            { key: 'offMarket',    label: 'Nouveaux actifs Off Market' },
            { key: 'newsletter',   label: 'Newsletter CAPEO' },
          ].map((a) => (
            <div key={a.key} className="compte-alert-row">
              <span className="compte-alert-label">{a.label}</span>
              <button
                className={`compte-toggle ${alerts[a.key] ? 'compte-toggle--on' : ''}`}
                onClick={() => toggle(a.key)}
              >
                <div className="compte-toggle__dot"></div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Profil acquéreur */}
      <div className="compte-block">
        <div className="compte-block__title">Profil acquéreur</div>
        <div className="compte-fields">
          {[
            { label: 'Budget', placeholder: '100 000€ — 500 000€' },
            { label: 'Localisation', placeholder: 'Paris, Lyon, Côte d\'Azur' },
            { label: 'Catégories', placeholder: 'Immobilier, Entreprise' },
          ].map((f) => (
            <div key={f.label} className="compte-field">
              <label className="compte-field__label">{f.label}</label>
              <input
                type="text"
                className="compte-input"
                placeholder={f.placeholder}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="compte-block compte-block--danger">
        <div className="compte-block__title compte-block__title--danger">
          Zone critique
        </div>
        <button className="compte-danger-btn">
          Supprimer mon compte
        </button>
      </div>

    </div>
  )
}
