/* ============================================
   CAPEO — HOME CATEGORIES (Acte 4)
   Immobilier uniquement pour la V1.
   Types de biens révélés au scroll.
   ============================================ */

import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './HomeCategories.css'

const TYPES = [
  {
    label: 'Immeubles de rapport',
    desc: 'Acquérir un immeuble locatif entier à plusieurs, et partager les revenus.',
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80',
  },
  {
    label: 'Biens d\'exception',
    desc: 'Villas, propriétés et résidences de prestige en co-acquisition.',
    img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=900&q=80',
  },
  {
    label: 'Immobilier commercial',
    desc: 'Locaux, bureaux et murs commerciaux à fort potentiel.',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80',
  },
]

export default function HomeCategories() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hc__head-el', {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: ref.current, start: 'top 70%' },
      })

      gsap.from('.hc__card', {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: '.hc__grid', start: 'top 80%' },
      })
    }, ref)

    return () => ctx.revert()
  }, [])

  return (
    <section className="hc" ref={ref}>
      <div className="container">

        <div className="hc__head">
          <div className="hc__head-el hc__eyebrow">Le catalogue</div>
          <h2 className="hc__head-el hc__title">
            L'immobilier,<br/>
            <em>en co-acquisition.</em>
          </h2>
          <p className="hc__head-el hc__sub">
            CAPEO démarre avec l'immobilier — le terrain naturel de
            la co-acquisition. D'autres catégories d'actifs suivront.
          </p>
        </div>

        <div className="hc__grid">
          {TYPES.map((type, i) => (
            <Link to="/actifs" key={i} className="hc__card">
              <div className="hc__card-img">
                <img src={type.img} alt={type.label} loading="lazy" />
                <div className="hc__card-overlay"></div>
              </div>
              <div className="hc__card-body">
                <div className="hc__card-label">{type.label}</div>
                <div className="hc__card-desc">{type.desc}</div>
                <div className="hc__card-link">Explorer →</div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
