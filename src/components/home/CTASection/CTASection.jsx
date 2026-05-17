import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './CTASection.css'

export default function CTASection() {
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
      { threshold: 0.15 }
    )
    const reveals = sectionRef.current?.querySelectorAll('.reveal')
    reveals?.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="cta-split" ref={sectionRef}>
      <div className="cta-split__container">

        <div className="cta-split__panel cta-split__panel--seller reveal">
          <div className="cta-split__panel-inner">
            <div className="cta-split__label">Vendeurs</div>
            <h2 className="cta-split__title">
              Publiez votre actif<br/>gratuitement.
            </h2>
            <p className="cta-split__desc">
              Décrochez le badge Vérifié CAPEO après vérification KYC.
              Touchez une audience d'acquéreurs qualifiés.
              Aucune commission sur la transaction.
            </p>
            <Link to="/proposer-un-actif" className="cta-split__btn cta-split__btn--dark">
              Publier un actif
            </Link>
          </div>
        </div>

        <div className="cta-split__panel cta-split__panel--buyer reveal reveal-delay-1">
          <div className="cta-split__panel-inner">
            <div className="cta-split__label">Acquéreurs</div>
            <h2 className="cta-split__title">
              Rejoignez les<br/>Business Rooms.
            </h2>
            <p className="cta-split__desc">
              15€ par room à la carte, ou 19,90€/mois CAPEO+
              pour accéder à l'ensemble des actifs (y compris
              Off-Market) et aux rooms en illimité.
            </p>
            <Link to="/inscription" className="cta-split__btn cta-split__btn--gold">
              Devenir acquéreur
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
