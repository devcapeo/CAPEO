/* ============================================
   CAPEO — HERO SECTION V3
   Slogan : "Acquérir l'exception, à plusieurs."
   Split gauche/droite avec vraie photo actif.
   Stats : 0% commission, KYC, EU 2019/1150.
   ============================================ */

import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './HeroSection.css'

export default function HeroSection() {
  const heroRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return
      const card = heroRef.current.querySelector('.hero__card')
      if (card) {
        card.style.transform = `translateY(${-window.scrollY * 0.06}px) rotate(1.5deg)`
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="hero" ref={heroRef}>

      {/* Fonds */}
      <div className="hero__bg"></div>
      <div className="hero__grid"></div>
      <div className="hero__orb hero__orb--1"></div>
      <div className="hero__orb hero__orb--2"></div>

      <div className="hero__inner container">

        {/* ── GAUCHE ── */}
        <div className="hero__left">

          <div className="hero__eyebrow">
            <span className="hero__eyebrow-dot"></span>
            Place de marché d'actifs premium
          </div>

          <h1 className="hero__title">
            Acquérir<br/>
            <em>l'exception,</em><br/>
            à plusieurs.
          </h1>

          <p className="hero__sub">
            CAPEO met en relation des acquéreurs qualifiés
            autour d'actifs rares — immobilier, entreprises,
            objets de collection — pour permettre la
            co-acquisition en toute discrétion.
          </p>

          <div className="hero__actions">
            <Link to="/actifs" className="hero__btn-primary">
              Explorer les actifs →
            </Link>
            <Link to="/comment-ca-marche" className="hero__btn-ghost">
              Comment ça marche
            </Link>
          </div>

          {/* Stats */}
          <div className="hero__stats">
            <div className="hero__stat">
              <div className="hero__stat-value">0%</div>
              <div className="hero__stat-label">Commission transaction</div>
            </div>
            <div className="hero__stat-sep"></div>
            <div className="hero__stat">
              <div className="hero__stat-value">KYC</div>
              <div className="hero__stat-label">Vendeurs vérifiés</div>
            </div>
            <div className="hero__stat-sep"></div>
            <div className="hero__stat">
              <div className="hero__stat-value">EU 2019/1150</div>
              <div className="hero__stat-label">Mise en relation</div>
            </div>
          </div>

        </div>

        {/* ── DROITE — CARTE ACTIF ── */}
        <div className="hero__right">

          <div className="hero__card">

            {/* Photo */}
            <div className="hero__card-img">
              <img
                src="https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80"
                alt="Villa contemporaine"
                loading="lazy"
              />
              <div className="hero__card-img-overlay"></div>
              <div className="hero__card-img-badge">
                Actif vedette
              </div>
            </div>

            {/* Corps */}
            <div className="hero__card-body">
              <div className="hero__card-cat">Immobilier · Côte d'Azur</div>
              <div className="hero__card-title">
                Villa contemporaine — Saint-Tropez
              </div>

              <div className="hero__card-data">
                <div className="hero__card-data-item">
                  <div className="hero__card-data-label">Prix indicatif</div>
                  <div className="hero__card-data-value">8 500 000 €</div>
                </div>
                <div className="hero__card-data-item">
                  <div className="hero__card-data-label">Acquéreurs intéressés</div>
                  <div className="hero__card-data-value">23</div>
                </div>
              </div>

              <div className="hero__card-disclaimer">
                Fourni par le vendeur, non vérifié par CAPEO
              </div>

              <Link to="/actifs/1" className="hero__card-cta">
                Accéder à l'actif →
              </Link>
            </div>

          </div>

          {/* Indicateur room */}
          <div className="hero__room-pill">
            <div className="hero__room-pill-dot"></div>
            <span>3 Business Rooms actives</span>
          </div>

        </div>

      </div>

      {/* Scroll indicator */}
      <div className="hero__scroll">
        <div className="hero__scroll-line"></div>
      </div>

    </section>
  )
}
