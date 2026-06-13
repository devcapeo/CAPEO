/* ============================================
   CAPEO — HOME CTA (Acte 6)
   Split vendeur / acquéreur.
   ============================================ */

import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './HomeCTA.css'

export default function HomeCTA() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hcta__panel', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section className="hcta" ref={ref}>
      <div className="container hcta__grid">

        <div className="hcta__panel hcta__panel--seller">
          <div className="hcta__label">Vendeurs</div>
          <h3 className="hcta__title">
            Publiez votre bien<br/>
            <em>gratuitement.</em>
          </h3>
          <p className="hcta__desc">
            Décrochez le badge Vérifié CAPEO après vérification KYC.
            Touchez une audience d'acquéreurs qualifiés. Aucune
            commission sur la transaction.
          </p>
          <Link to="/proposer-un-actif" className="hcta__btn hcta__btn--primary">
            Publier un bien →
          </Link>
        </div>

        <div className="hcta__panel hcta__panel--buyer">
          <div className="hcta__label">Acquéreurs</div>
          <h3 className="hcta__title">
            Rejoignez les<br/>
            <em>Business Rooms.</em>
          </h3>
          <p className="hcta__desc">
            Découvrez des biens d'exception et co-acquérez avec
            d'autres acquéreurs qualifiés, en toute discrétion.
            L'accès est gratuit pendant notre phase de lancement.
          </p>
          <Link to="/inscription" className="hcta__btn hcta__btn--ghost">
            Devenir acquéreur →
          </Link>
        </div>

      </div>
    </section>
  )
}
