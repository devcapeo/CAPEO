/* ============================================
   CAPEO — PAGE OFF-MARKET V2
   Hero verrouillé + catalogue + disclaimer.
   Référence Emergent : "Hors marché, sur invitation."
   ============================================ */

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './OffMarket.css'

export default function OffMarket() {
  const [isPremium] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    const reveals = sectionRef.current?.querySelectorAll('.reveal')
    reveals?.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="offmarket" ref={sectionRef}>

      {/* ── HERO ── */}
      <div className="offmarket__hero">
        <div className="offmarket__hero-bg"></div>
        <div className="offmarket__hero-orb"></div>

        <div className="offmarket__hero-inner container">
          <div className="offmarket__hero-content reveal">
            <div className="section-label">Cercle CAPEO+</div>
            <h1 className="offmarket__hero-title">
              Off-Market.<br/>
              <em>Hors marché, sur invitation.</em>
            </h1>
            <p className="offmarket__hero-sub">
              Une sélection confidentielle d'actifs proposés en dehors
              des canaux publics. Visibilité réservée aux membres CAPEO+.
            </p>
            {!isPremium && (
              <Link to="/inscription" className="offmarket__hero-cta">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1l1.2 3.6H12L9.2 6.8l1.2 3.6L7 8.5l-3.4 1.9 1.2-3.6L2 4.6h3.8z"
                    stroke="currentColor" strokeWidth="0.8"
                    strokeLinejoin="round"/>
                </svg>
                Devenir CAPEO+ — 19,90€/mois
              </Link>
            )}
          </div>
        </div>

        {/* Ligne décorative bas */}
        <div className="offmarket__hero-line"></div>
      </div>

      {/* ── CATALOGUE VERROUILLÉ ── */}
      {!isPremium && (
        <div className="offmarket__locked-wrap container">
          <div className="offmarket__locked reveal">

            <div className="offmarket__locked-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="6" y="14" width="20" height="16" rx="2"
                  stroke="currentColor" strokeWidth="1.2"/>
                <path d="M10 14V10a6 6 0 0112 0v4"
                  stroke="currentColor" strokeWidth="1.2"
                  strokeLinecap="round"/>
                <circle cx="16" cy="22" r="2"
                  fill="currentColor" opacity="0.5"/>
              </svg>
            </div>

            <h2 className="offmarket__locked-title">
              Catalogue verrouillé.
            </h2>

            <p className="offmarket__locked-desc">
              Activez l'abonnement CAPEO+ pour révéler les actifs
              Off-Market et accéder à l'ensemble des Business Rooms
              en illimité.
            </p>

            <div className="offmarket__locked-perks">
              {[
                {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1"/>
                      <path d="M5 8.5l2 2 4-4" stroke="currentColor" strokeWidth="1.2"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ),
                  text: 'Accès aux annonces confidentielles',
                },
                {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1l1.5 4.5H14L9.5 8l1.5 4.5L8 10l-3 2.5 1.5-4.5L2 5.5h4.5z"
                        stroke="currentColor" strokeWidth="0.9"
                        strokeLinejoin="round"/>
                    </svg>
                  ),
                  text: 'Toutes les rooms en illimité',
                },
                {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2v4M8 10v4M2 8h4M10 8h4"
                        stroke="currentColor" strokeWidth="1"
                        strokeLinecap="round"/>
                    </svg>
                  ),
                  text: 'Notifications avant publication publique',
                },
              ].map((perk, i) => (
                <div key={i} className="offmarket__locked-perk">
                  <div className="offmarket__locked-perk-icon">
                    {perk.icon}
                  </div>
                  <span>{perk.text}</span>
                </div>
              ))}
            </div>

            <Link to="/inscription" className="offmarket__locked-cta">
              Activer CAPEO+
            </Link>

            <div className="offmarket__locked-note">
              19,90€/mois · Sans engagement · Annulation à tout moment
            </div>

          </div>
        </div>
      )}

      {/* ── DISCLAIMER RÉGLEMENTAIRE ── */}
      <div className="offmarket__disclaimer container reveal">
        <div className="offmarket__disclaimer-inner">
          <div className="offmarket__disclaimer-icon">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1"/>
              <path d="M7 6v4M7 4.5v.5" stroke="currentColor" strokeWidth="1.2"
                strokeLinecap="round"/>
            </svg>
          </div>
          <p className="offmarket__disclaimer-text">
            CAPEO est une plateforme de mise en relation au sens du règlement EU 2019/1150.
            CAPEO n'est pas un prestataire de services de financement participatif (PSFP).
            Aucun flux financier ne transite par CAPEO. Les indicateurs financiers présentés sont{' '}
            <strong>fournis par le vendeur et non vérifiés par CAPEO</strong>.
            Aucune simulation de rendement ni de fiscalité n'est proposée.
            Les transactions sont formalisées hors plateforme entre les parties.
          </p>
        </div>
      </div>

    </div>
  )
}
