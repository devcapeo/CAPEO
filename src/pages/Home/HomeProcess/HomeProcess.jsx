/* ============================================
   CAPEO — HOME PROCESS (Acte 5)
   Ligne de temps qui se trace au scroll.
   ============================================ */

import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './HomeProcess.css'

const STEPS = [
  {
    num: '01',
    title: 'Publication',
    desc: 'Le vendeur publie son bien gratuitement. Photos, description, documents. Il obtient le badge Vérifié CAPEO après vérification KYC.',
  },
  {
    num: '02',
    title: 'Visibilité',
    desc: 'Le bien est diffusé auprès d\'acquéreurs qualifiés. Les membres CAPEO+ reçoivent une alerte si le bien correspond à leur profil.',
  },
  {
    num: '03',
    title: 'Business Room',
    desc: 'Les acquéreurs intéressés rejoignent une room privée. Ils échangent, déclarent leurs intentions d\'apport et choisissent leur structure d\'acquisition.',
  },
  {
    num: '04',
    title: 'Transaction',
    desc: 'Vendeur et acquéreurs organisent librement la suite hors plateforme — devant notaire, en SCI ou en indivision. CAPEO ne participe pas à la transaction.',
  },
]

export default function HomeProcess() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hpr__head-el', {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: ref.current, start: 'top 70%' },
      })

      // Ligne verticale qui se trace
      gsap.from('.hpr__timeline-fill', {
        scaleY: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hpr__steps',
          start: 'top 60%',
          end: 'bottom 70%',
          scrub: 1,
        },
      })

      gsap.from('.hpr__step', {
        opacity: 0,
        x: -30,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: { trigger: '.hpr__steps', start: 'top 65%' },
      })
    }, ref)

    return () => ctx.revert()
  }, [])

  return (
    <section className="hpr" ref={ref}>
      <div className="container">

        <div className="hpr__head">
          <div className="hpr__head-el hpr__eyebrow">Le processus</div>
          <h2 className="hpr__head-el hpr__title">
            Comment fonctionne<br/>
            <em>CAPEO.</em>
          </h2>
          <p className="hpr__head-el hpr__sub">
            Une mécanique simple et transparente. CAPEO facilite
            la rencontre — la transaction reste entre vous.
          </p>
        </div>

        <div className="hpr__steps">
          <div className="hpr__timeline">
            <div className="hpr__timeline-fill"></div>
          </div>

          {STEPS.map((step, i) => (
            <div key={i} className="hpr__step">
              <div className="hpr__step-dot">{step.num}</div>
              <div className="hpr__step-content">
                <div className="hpr__step-title">{step.title}</div>
                <div className="hpr__step-desc">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="hpr__cta-wrap hpr__head-el">
          <Link to="/comment-ca-marche" className="hpr__cta">
            En savoir plus sur le fonctionnement →
          </Link>
        </div>

      </div>
    </section>
  )
}
