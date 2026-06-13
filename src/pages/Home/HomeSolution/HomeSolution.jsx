/* ============================================
   CAPEO — HOME SOLUTION (Acte 3)
   Le pivot : à plusieurs, tout change.
   Cartes/avatars qui convergent vers l'actif.
   ============================================ */

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './HomeSolution.css'

const ACQUEREURS = [
  { id: 1, initials: 'M', x: -180, y: -120, delay: 0 },
  { id: 2, initials: 'S', x: 180, y: -120, delay: 0.1 },
  { id: 3, initials: 'L', x: -200, y: 60, delay: 0.2 },
  { id: 4, initials: 'A', x: 200, y: 60, delay: 0.3 },
]

export default function HomeSolution() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hs__text-el', {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 65%',
        },
      })

      // Avatars convergent vers le centre
      gsap.from('.hs__avatar', {
        opacity: 0,
        scale: 0.5,
        duration: 1,
        ease: 'back.out(1.6)',
        stagger: 0.12,
        scrollTrigger: {
          trigger: '.hs__viz',
          start: 'top 70%',
        },
      })

      // Lignes qui se tracent
      gsap.from('.hs__link-line', {
        scaleX: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.hs__viz',
          start: 'top 60%',
        },
      })

      // Actif central pulse
      gsap.from('.hs__center', {
        opacity: 0,
        scale: 0.6,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.hs__viz',
          start: 'top 70%',
        },
      })
    }, ref)

    return () => ctx.revert()
  }, [])

  return (
    <section className="hs" ref={ref}>
      <div className="container">

        <div className="hs__header">
          <div className="hs__text-el hs__eyebrow">La solution</div>
          <h2 className="hs__text-el hs__title">
            À plusieurs,<br/>
            <em>tout change.</em>
          </h2>
          <p className="hs__text-el hs__sub">
            CAPEO réunit plusieurs acquéreurs qualifiés autour d'un
            même bien. Ensemble, vous accédez à des actifs jusqu'ici
            réservés à une poignée d'initiés.
          </p>
        </div>

        {/* Visualisation convergence */}
        <div className="hs__viz">
          <div className="hs__viz-inner">

            {/* Lignes de liaison */}
            {ACQUEREURS.map((a) => (
              <div
                key={`line-${a.id}`}
                className="hs__link-line"
                style={{
                  width: Math.sqrt(a.x * a.x + a.y * a.y),
                  transform: `rotate(${Math.atan2(a.y, a.x)}rad)`,
                }}
              ></div>
            ))}

            {/* Actif central */}
            <div className="hs__center">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="5" y="12" width="18" height="13" rx="1"
                  stroke="currentColor" strokeWidth="1.3"/>
                <path d="M2 13L14 4l12 9"
                  stroke="currentColor" strokeWidth="1.3"
                  strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="11" y="17" width="6" height="8"
                  stroke="currentColor" strokeWidth="1.3"/>
              </svg>
              <span>Le bien</span>
            </div>

            {/* Avatars acquéreurs */}
            {ACQUEREURS.map((a) => (
              <div
                key={a.id}
                className="hs__avatar"
                style={{
                  transform: `translate(${a.x}px, ${a.y}px)`,
                }}
              >
                {a.initials}
              </div>
            ))}

          </div>
        </div>

      </div>
    </section>
  )
}
