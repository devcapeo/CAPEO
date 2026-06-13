/* ============================================
   CAPEO — HOME SCROLLYTELLING (fichier unique)
   Lenis + GSAP ScrollTrigger. 6 actes.
   ============================================ */

import { useEffect, useRef } from 'react'
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
      gsap.from(['.hh__eyebrow', '.hh__sub', '.hh__actions', '.hh__stats'], {
        opacity: 0, y: 24, duration: 1, ease: 'power3.out',
        stagger: 0.15, delay: 0.8,
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
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
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

      <div className="hh__scroll">
        <span>Scroll</span>
        <div className="hh__scroll-line"></div>
      </div>
    </section>
  )
}

/* ============================================
   ACTE 2 — PROBLÈME
   ============================================ */
function HomeProblem() {
  const ref = useRef(null)
  const countRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hp__line', {
        opacity: 0, y: 40, duration: 1, ease: 'power3.out', stagger: 0.15,
        scrollTrigger: { trigger: ref.current, start: 'top 70%' },
      })
      const counter = { val: 0 }
      gsap.to(counter, {
        val: 8500000, duration: 2, ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 60%' },
        onUpdate: () => {
          if (countRef.current) countRef.current.textContent = Math.floor(counter.val).toLocaleString('fr-FR') + ' €'
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
          <div className="hp__count-note">Un ticket que peu peuvent assumer individuellement.</div>
        </div>
      </div>
    </section>
  )
}

/* ============================================
   ACTE 3 — SOLUTION
   ============================================ */
const ACQUEREURS = [
  { id: 1, initials: 'M', x: -180, y: -120 },
  { id: 2, initials: 'S', x: 180, y: -120 },
  { id: 3, initials: 'L', x: -200, y: 60 },
  { id: 4, initials: 'A', x: 200, y: 60 },
]

function HomeSolution() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hs__text-el', {
        opacity: 0, y: 40, duration: 1, ease: 'power3.out', stagger: 0.15,
        scrollTrigger: { trigger: ref.current, start: 'top 65%' },
      })
      gsap.from('.hs__avatar', {
        opacity: 0, scale: 0.5, duration: 1, ease: 'back.out(1.6)', stagger: 0.12,
        scrollTrigger: { trigger: '.hs__viz', start: 'top 70%' },
      })
      gsap.from('.hs__link-line', {
        scaleX: 0, duration: 0.8, ease: 'power2.out', stagger: 0.1,
        scrollTrigger: { trigger: '.hs__viz', start: 'top 60%' },
      })
      gsap.from('.hs__center', {
        opacity: 0, scale: 0.6, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: '.hs__viz', start: 'top 70%' },
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
        <div className="hs__viz">
          <div className="hs__viz-inner">
            {ACQUEREURS.map((a) => (
              <div key={`line-${a.id}`} className="hs__link-line"
                style={{ width: Math.sqrt(a.x * a.x + a.y * a.y), transform: `rotate(${Math.atan2(a.y, a.x)}rad)` }}>
              </div>
            ))}
            <div className="hs__center">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="5" y="12" width="18" height="13" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M2 13L14 4l12 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="11" y="17" width="6" height="8" stroke="currentColor" strokeWidth="1.3"/>
              </svg>
              <span>Le bien</span>
            </div>
            {ACQUEREURS.map((a) => (
              <div key={a.id} className="hs__avatar" style={{ transform: `translate(${a.x}px, ${a.y}px)` }}>
                {a.initials}
              </div>
            ))}
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
                <div className="hc__card-link">Explorer →</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================
   ACTE 5 — PROCESS
   ============================================ */
const STEPS = [
  { num: '01', title: 'Publication', desc: 'Le vendeur publie son bien gratuitement. Photos, description, documents. Il obtient le badge Vérifié CAPEO après vérification KYC.' },
  { num: '02', title: 'Visibilité', desc: 'Le bien est diffusé auprès d\'acquéreurs qualifiés. Les membres CAPEO+ reçoivent une alerte si le bien correspond à leur profil.' },
  { num: '03', title: 'Business Room', desc: 'Les acquéreurs intéressés rejoignent une room privée. Ils échangent, déclarent leurs intentions d\'apport et choisissent leur structure d\'acquisition.' },
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
      gsap.from('.hpr__timeline-fill', {
        scaleY: 0, ease: 'none',
        scrollTrigger: { trigger: '.hpr__steps', start: 'top 60%', end: 'bottom 70%', scrub: 1 },
      })
      gsap.from('.hpr__step', {
        opacity: 0, x: -30, duration: 0.8, ease: 'power3.out', stagger: 0.2,
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
