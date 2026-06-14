/* ============================================
   CAPEO — HOME SCROLLYTELLING (fichier unique)
   Lenis + GSAP ScrollTrigger. 6 actes.
   ============================================ */

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Home.css'

gsap.registerPlugin(ScrollTrigger)

/* ============================================
   ACTE 1 — HERO
   ============================================ */
function HomeHero() {
  const heroRef = useRef(null)
  const photoRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hh__line span', {
        yPercent: 110, duration: 1.1, ease: 'power4.out',
        stagger: 0.12, delay: 0.2,
      })
      gsap.from(['.hh__tagline', '.hh__sub', '.hh__actions'], {
        opacity: 0, y: 24, duration: 1, ease: 'power3.out',
        stagger: 0.15, delay: 0.8,
      })
      gsap.from('.hh__trust-item', {
        opacity: 0, y: 16, duration: 0.8, ease: 'power3.out',
        stagger: 0.1, delay: 1.2,
      })
      gsap.to(photoRef.current, {
        yPercent: 18, ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
      })
      gsap.to('.hh__content', {
        opacity: 0, y: -40, ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: '60% top', scrub: 1 },
      })
    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="hh" ref={heroRef}>
      <div className="hh__photo-wrap">
        <div className="hh__photo" ref={photoRef}>
          <img src="https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1600&q=80" alt="" loading="eager" />
        </div>
        <div className="hh__photo-overlay"></div>
        <div className="hh__photo-grain"></div>
      </div>

      <div className="hh__content container">
        <div className="hh__tagline">Place de marché d'actifs premium</div>

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
            <span className="hh__btn-primary-text">Explorer les biens</span>
            <span className="hh__btn-primary-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </Link>
          <Link to="/comment-ca-marche" className="hh__btn-ghost">
            <span>Comment ça marche</span>
          </Link>
        </div>
      </div>

      <div className="hh__trust">
        <div className="hh__trust-inner container">
          <div className="hh__trust-item">
            <span className="hh__trust-value">0%</span>
            <span className="hh__trust-label">de commission</span>
          </div>
          <span className="hh__trust-dot"></span>
          <div className="hh__trust-item">
            <span className="hh__trust-value">Vendeurs vérifiés</span>
            <span className="hh__trust-label">par procédure KYC</span>
          </div>
          <span className="hh__trust-dot"></span>
          <div className="hh__trust-item">
            <span className="hh__trust-value">Mise en relation</span>
            <span className="hh__trust-label">règlement EU 2019/1150</span>
          </div>
        </div>
      </div>

      <div className="hh__scroll">
        <div className="hh__scroll-line"></div>
      </div>
    </section>
  )
}

/* ============================================
   ACTE 2 — LE CONSTAT (carte qui s'agrandit)
   ============================================ */
function HomeProblem() {
  const ref = useRef(null)
  const [cardOpen, setCardOpen] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hp__head-el', {
        opacity: 0, y: 40, duration: 1, ease: 'power3.out', stagger: 0.15,
        scrollTrigger: { trigger: ref.current, start: 'top 70%' },
      })
      gsap.from('.hp__card', {
        opacity: 0, y: 50, scale: 0.96, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.hp__card', start: 'top 80%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section className="hp" ref={ref}>
      <div className="container">
        <div className="hp__head">
          <div className="hp__head-el hp__eyebrow">Le constat</div>
          <h2 className="hp__head-el hp__title">
            Seul, c'est hors de portée.<br/>
            <em>À plusieurs, c'est accessible.</em>
          </h2>
          <p className="hp__head-el hp__sub">
            La co-acquisition divise le ticket d'entrée. Un bien
            inaccessible individuellement devient atteignable lorsque
            plusieurs acquéreurs s'unissent autour du même projet.
          </p>
        </div>

        <div className="hp__card-wrap">
          <div
            className={`hp__card ${cardOpen ? 'hp__card--open' : ''}`}
            onClick={() => setCardOpen(!cardOpen)}
          >
            <div className="hp__card-top">
              <div className="hp__card-label">Un bien à</div>
              <div className="hp__card-value">600 000 €</div>
              <div className="hp__card-hint">
                <span>{cardOpen ? 'Refermer' : 'Toucher pour diviser'}</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d={cardOpen ? 'M3 7h8' : 'M7 3v8M3 7h8'} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </div>
            </div>

            <div className="hp__card-reveal">
              <div className="hp__card-divide">
                <span>÷ 4 acquéreurs</span>
              </div>
              <div className="hp__card-shares">
                {['M', 'S', 'L', 'A'].map((initial, i) => (
                  <div className="hp__card-share" key={i}>
                    <div className="hp__card-share-avatar">{initial}</div>
                    <div className="hp__card-share-value">150 000 €</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="hp__disclaimer hp__head-el">
          Exemple illustratif. La répartition et la structuration dépendent de chaque projet.
        </div>
      </div>
    </section>
  )
}

/* ============================================
   ACTE 3 — LA SOLUTION (la confiance)
   ============================================ */
const ACQUEREURS = [
  { id: 1, initials: 'M', x: -240, y: -130 },
  { id: 2, initials: 'S', x: 240, y: -130 },
  { id: 3, initials: 'L', x: -260, y: 90 },
  { id: 4, initials: 'A', x: 260, y: 90 },
]

function HomeSolution() {
  const ref = useRef(null)
  const vizRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hs__text-el', {
        opacity: 0, y: 40, duration: 1, ease: 'power3.out', stagger: 0.15,
        scrollTrigger: { trigger: ref.current, start: 'top 65%' },
      })
      gsap.from('.hs__center', {
        opacity: 0, scale: 0.6, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: '.hs__viz', start: 'top 72%' },
      })
      gsap.from('.hs__line', {
        scaleX: 0, duration: 0.9, ease: 'power2.out', stagger: 0.1,
        scrollTrigger: { trigger: '.hs__viz', start: 'top 68%' },
      })
      gsap.from('.hs__avatar', {
        opacity: 0, scale: 0.4, duration: 0.9, ease: 'back.out(1.7)', stagger: 0.1,
        scrollTrigger: { trigger: '.hs__viz', start: 'top 72%' },
      })
      gsap.from('.hs__pill', {
        opacity: 0, y: 20, duration: 0.8, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: '.hs__pills', start: 'top 85%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  // Parallax souris (désactivé sur mobile/tactile)
  useEffect(() => {
    const viz = vizRef.current
    if (!viz || window.matchMedia('(hover: none)').matches) return
    const handleMove = (e) => {
      const rect = viz.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) / rect.width
      const dy = (e.clientY - cy) / rect.height
      viz.querySelectorAll('.hs__avatar').forEach((el, i) => {
        const depth = 12 + i * 4
        el.style.transform = `${el.dataset.base} translate(${dx * depth}px, ${dy * depth}px)`
      })
      const center = viz.querySelector('.hs__center')
      if (center) center.style.transform = `translate(${dx * -8}px, ${dy * -8}px)`
    }
    const handleLeave = () => {
      viz.querySelectorAll('.hs__avatar').forEach((el) => { el.style.transform = el.dataset.base })
      const center = viz.querySelector('.hs__center')
      if (center) center.style.transform = 'translate(0,0)'
    }
    viz.addEventListener('mousemove', handleMove)
    viz.addEventListener('mouseleave', handleLeave)
    return () => {
      viz.removeEventListener('mousemove', handleMove)
      viz.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  return (
    <section className="hs" ref={ref}>
      <div className="container">
        <div className="hs__header">
          <div className="hs__text-el hs__eyebrow">La solution</div>
          <h2 className="hs__text-el hs__title">
            S'unir,<br/>
            <em>en toute confiance.</em>
          </h2>
          <p className="hs__text-el hs__sub">
            S'associer à des inconnus pour un projet d'une telle ampleur
            peut inquiéter. CAPEO sécurise chaque étape — identités
            vérifiées, échanges privés, projet structuré.
          </p>
        </div>

        <div className="hs__viz" ref={vizRef}>
          <svg className="hs__lines" viewBox="-300 -200 600 400" preserveAspectRatio="xMidYMid meet">
            {ACQUEREURS.map((a) => (
              <line
                key={`l-${a.id}`}
                className="hs__line"
                x1="0" y1="0" x2={a.x} y2={a.y}
                stroke="url(#hsGrad)" strokeWidth="1"
              />
            ))}
            <defs>
              <linearGradient id="hsGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.05"/>
              </linearGradient>
            </defs>
          </svg>

          <div className="hs__center">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <rect x="6" y="13" width="18" height="13" rx="1" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M3 14L15 5l12 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="12" y="18" width="6" height="8" stroke="currentColor" strokeWidth="1.3"/>
            </svg>
            <span>Le bien</span>
          </div>

          {ACQUEREURS.map((a) => (
            <div
              key={a.id}
              className="hs__avatar"
              data-base={`translate(${a.x}px, ${a.y}px)`}
              style={{ transform: `translate(${a.x}px, ${a.y}px)` }}
            >
              {a.initials}
            </div>
          ))}
        </div>

        {/* Piliers de confiance */}
        <div className="hs__pills">
          <div className="hs__pill">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 1l6 2.5v4C15 12 12.5 15.5 9 17c-3.5-1.5-6-5-6-9.5v-4L9 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
              <path d="M6.5 9l1.8 1.8L12 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Identités vérifiées par KYC</span>
          </div>
          <div className="hs__pill">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="4" y="8" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M6 8V6a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <span>Échanges privés en Business Room</span>
          </div>
          <div className="hs__pill">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 15V7l6-4 6 4v8" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
              <path d="M7 15v-4h4v4" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
            <span>Projet structuré entre co-acquéreurs</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================================
   ACTE 4 — CATÉGORIES (immobilier)
   ============================================ */
const TYPES = [
  { label: 'Immeubles de rapport', desc: 'Acquérir un immeuble locatif entier à plusieurs, et partager les revenus.', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80' },
  { label: "Biens d'exception", desc: 'Villas, propriétés et résidences de prestige en co-acquisition.', img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=900&q=80' },
  { label: 'Immobilier commercial', desc: 'Locaux, bureaux et murs commerciaux à fort potentiel.', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80' },
]

function HomeCategories() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hc__head-el', {
        opacity: 0, y: 40, duration: 1, ease: 'power3.out', stagger: 0.15,
        scrollTrigger: { trigger: ref.current, start: 'top 70%' },
      })
      gsap.from('.hc__card', {
        opacity: 0, y: 60, duration: 1, ease: 'power3.out', stagger: 0.15,
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
                <div className="hc__card-link">
                  <span>Explorer</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================
   ACTE 5 — PROCESS (ronds qui s'allument)
   ============================================ */
const STEPS = [
  { num: '01', title: 'Publication', desc: 'Le vendeur publie son bien gratuitement — photos, description, documents. Il obtient le badge Vérifié CAPEO après vérification KYC.' },
  { num: '02', title: 'Visibilité', desc: 'Le bien est diffusé auprès des acquéreurs qualifiés inscrits sur la plateforme, à la recherche de projets de co-acquisition.' },
  { num: '03', title: 'Business Room', desc: 'Les acquéreurs intéressés rejoignent une Business Room privée. Ils échangent, déclarent leurs intentions d\'apport et organisent leur projet commun.' },
  { num: '04', title: 'Transaction', desc: 'Vendeur et acquéreurs organisent librement la suite hors plateforme — devant notaire, en SCI ou en indivision. CAPEO ne participe pas à la transaction.' },
]

function HomeProcess() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hpr__head-el', {
        opacity: 0, y: 40, duration: 1, ease: 'power3.out', stagger: 0.15,
        scrollTrigger: { trigger: ref.current, start: 'top 70%' },
      })
      gsap.from('.hpr__step', {
        opacity: 0, x: -30, duration: 0.8, ease: 'power3.out', stagger: 0.2,
        scrollTrigger: { trigger: '.hpr__steps', start: 'top 70%' },
      })
      // Ligne qui se trace
      gsap.to('.hpr__timeline-fill', {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: '.hpr__steps', start: 'top 60%', end: 'bottom 65%', scrub: 0.8 },
      })
      // Chaque rond s'allume quand la ligne le dépasse
      gsap.utils.toArray('.hpr__step').forEach((step) => {
        const dot = step.querySelector('.hpr__step-dot')
        ScrollTrigger.create({
          trigger: step,
          start: 'top 65%',
          onEnter: () => dot.classList.add('hpr__step-dot--active'),
          onLeaveBack: () => dot.classList.remove('hpr__step-dot--active'),
        })
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
              <div className="hpr__step-dot">
                <span>{step.num}</span>
              </div>
              <div className="hpr__step-content">
                <div className="hpr__step-title">{step.title}</div>
                <div className="hpr__step-desc">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="hpr__cta-wrap hpr__head-el">
          <Link to="/comment-ca-marche" className="hpr__cta">
            <span>En savoir plus sur le fonctionnement</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ============================================
   ACTE 6 — CTA
   ============================================ */
function HomeCTA() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hcta__panel', {
        opacity: 0, y: 50, duration: 1, ease: 'power3.out', stagger: 0.15,
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
            <span>Publier un bien</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
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
            <span>Devenir acquéreur</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ============================================
   HOME — Assemblage + Lenis
   ============================================ */
export default function Home() {
  const lenisRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => { lenis.raf(time * 1000) }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return (
    <div className="home">
      <HomeHero />
      <HomeProblem />
      <HomeSolution />
      <HomeCategories />
      <HomeProcess />
      <HomeCTA />
    </div>
  )
}
