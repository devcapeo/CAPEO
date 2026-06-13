/* ============================================
   CAPEO — HOME HERO (Acte 1)
   Slogan révélé mot par mot.
   Photo en parallax arrière-plan.
   ============================================ */

import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './HomeHero.css'

export default function HomeHero() {
  const heroRef = useRef(null)
  const photoRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Révélation du slogan ligne par ligne
      gsap.from('.hh__line span', {
        yPercent: 110,
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.12,
        delay: 0.2,
      })

      // Apparition eyebrow + sub + actions + stats
      gsap.from(['.hh__eyebrow', '.hh__sub', '.hh__actions', '.hh__stats'], {
        opacity: 0,
        y: 24,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15,
        delay: 0.8,
      })

      // Parallax photo au scroll
      gsap.to(photoRef.current, {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })

      // Fade-out du contenu au scroll
      gsap.to('.hh__content', {
        opacity: 0,
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '60% top',
          scrub: 1,
        },
      })

    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="hh" ref={heroRef}>

      {/* Photo arrière-plan parallax */}
      <div className="hh__photo-wrap">
        <div className="hh__photo" ref={photoRef}>
          <img
            src="https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1600&q=80"
            alt=""
            loading="eager"
          />
        </div>
        <div className="hh__photo-overlay"></div>
        <div className="hh__photo-grain"></div>
      </div>

      {/* Contenu */}
      <div className="hh__content container">

        <div className="hh__eyebrow">
          <span className="hh__eyebrow-dot"></span>
          Place de marché d'actifs premium
        </div>

        <h1 className="hh__title">
          <span className="hh__line"><span>Acquérir</span></span>
          <span className="hh__line"><span><em>l'exception,</em></span></span>
          <span className="hh__line"><span>à plusieurs.</span></span>
        </h1>

        <p className="hh__sub">
          CAPEO réunit des acquéreurs qualifiés autour d'un même
          bien immobilier pour permettre la co-acquisition,
          en toute discrétion.
        </p>

        <div className="hh__actions">
          <Link to="/actifs" className="hh__btn-primary">
            <span>Explorer les biens</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor" strokeWidth="1.3"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <Link to="/comment-ca-marche" className="hh__btn-ghost">
            Comment ça marche
          </Link>
        </div>

        <div className="hh__stats">
          <div className="hh__stat">
            <div className="hh__stat-value">0%</div>
            <div className="hh__stat-label">Commission</div>
          </div>
          <div className="hh__stat-sep"></div>
          <div className="hh__stat">
            <div className="hh__stat-value">KYC</div>
            <div className="hh__stat-label">Vendeurs vérifiés</div>
          </div>
          <div className="hh__stat-sep"></div>
          <div className="hh__stat">
            <div className="hh__stat-value">EU 2019/1150</div>
            <div className="hh__stat-label">Mise en relation</div>
          </div>
        </div>

      </div>

      {/* Indicateur scroll */}
      <div className="hh__scroll">
        <span>Scroll</span>
        <div className="hh__scroll-line"></div>
      </div>

    </section>
  )
}
