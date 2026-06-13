/* ============================================
   CAPEO — HOME PROBLEM (Acte 2)
   La tension : les actifs premium sont
   inaccessibles seul.
   ============================================ */

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './HomeProblem.css'

export default function HomeProblem() {
  const ref = useRef(null)
  const countRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hp__line', {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 70%',
        },
      })

      const counter = { val: 0 }
      gsap.to(counter, {
        val: 8500000,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 60%',
        },
        onUpdate: () => {
          if (countRef.current) {
            countRef.current.textContent =
              Math.floor(counter.val).toLocaleString('fr-FR') + ' €'
          }
        },
      })
    }, ref)

    return () => ctx.revert()
  }, [])

  return (
    <section className="hp" ref={ref}>
      <div className="container hp__inner">
        <div className="hp__text">
          <div className="hp__line hp__eyebrow">Le constat</div>
          <h2 className="hp__line hp__title">
            Certains biens sont<br/>
            <em>hors de portée.</em>
          </h2>
          <p className="hp__line hp__sub">
            Un immeuble de rapport, un domaine d'exception, un bien
            rare. Seul, ces opportunités restent inaccessibles
            à la plupart des acquéreurs.
          </p>
        </div>

        <div className="hp__count-block hp__line">
          <div className="hp__count-label">Prix moyen d'un actif premium</div>
          <div className="hp__count" ref={countRef}>0 €</div>
          <div className="hp__count-note">
            Un ticket que peu peuvent assumer individuellement.
          </div>
        </div>
      </div>
    </section>
  )
}
