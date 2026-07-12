/* ============================================
   CAPEO — HOME CINÉMATIQUE
   Scène Three.js + Lenis + 6 actes.
   Header/Footer viennent de App.jsx.
   ============================================ */

import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Lenis from 'lenis'
import { ShieldCheck, Lock, FileSignature, ArrowUpRight } from 'lucide-react'
import { createCapeoScene } from '../../three/CapeoScene'
import './Home.css'

/* ── Hook de révélation au scroll ── */
function useReveal({ threshold = 0.2, stagger = 120 } = {}) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            const kids = entry.target.querySelectorAll('.reveal-line, .fade-up')
            kids.forEach((k, i) => {
              setTimeout(() => k.classList.add('is-visible'), i * stagger)
            })
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin: '0px 0px -80px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold, stagger])
  return ref
}

/* ============================================
   ACTE 0 — HERO
   ============================================ */
function Hero() {
  const ref = useReveal({ threshold: 0.1, stagger: 160 })

  return (
    <section id="hero" className="hero" ref={ref}>
      <div style={{ maxWidth: 980, position: 'relative', zIndex: 3 }}>
        <div className="fade-up" style={{ marginBottom: 40 }}>
          <span className="eyebrow">Marketplace de co-acquisition premium</span>
        </div>

        <h1
          className="font-serif"
          style={{
            fontSize: 'clamp(48px, 8.2vw, 128px)',
            lineHeight: 0.98,
            margin: '0 0 30px',
            fontWeight: 400,
            letterSpacing: '-0.02em',
          }}
        >
          <span className="reveal-line"><span>Acquérir</span></span>
          <span className="reveal-line"><span><em className="gold-italic">l'exception</em>,</span></span>
          <span className="reveal-line"><span>à plusieurs.</span></span>
        </h1>

        <p
          className="fade-up"
          style={{
            maxWidth: 560,
            color: 'var(--capeo-muted)',
            fontSize: 'clamp(15px, 1.5vw, 18px)',
            lineHeight: 1.7,
            margin: '0 0 42px',
          }}
        >
          Une propriété hors de portée seule devient accessible lorsque
          plusieurs acquéreurs vérifiés s'unissent. Nous connectons,
          nous vérifions, nous structurons.
        </p>

        <div className="fade-up" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 52 }}>
          <Link to="/actifs" className="btn-gold">Explorer les biens</Link>
          <Link to="/proposer-un-actif" className="btn-ghost">Publier un bien</Link>
        </div>

        <div
          className="fade-up hero-trust-line"
          style={{
            color: 'var(--capeo-muted)',
            fontSize: 12,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
          }}
        >
          <span>· 0% de commission</span>
          <span>· Profils vérifiés</span>
          <span>· Mise en relation privée</span>
        </div>
      </div>

      <div className="scroll-indicator">
        <span>Découvrir</span>
        <div className="scroll-indicator__line" />
      </div>
    </section>
  )
}

/* ============================================
   ACTE I — LE CONSTAT
   ============================================ */
function ProblemSection() {
  const ref = useReveal({ threshold: 0.2, stagger: 140 })

  return (
    <section id="problem" className="section" ref={ref}>
      <div className="container-narrow">
        <div className="fade-up" style={{ marginBottom: 30 }}>
          <span className="eyebrow">Acte I — Le constat</span>
        </div>

        <h2
          className="font-serif"
          style={{
            fontSize: 'clamp(38px, 5.6vw, 78px)',
            lineHeight: 1.02,
            margin: '0 0 30px',
            fontWeight: 400,
            letterSpacing: '-0.015em',
          }}
        >
          <span className="reveal-line">
            <span><em className="gold-italic">Seul,</em> c'est hors de portée.</span>
          </span>
          <span className="reveal-line">
            <span>À plusieurs, c'est accessible.</span>
          </span>
        </h2>

        <p
          className="fade-up"
          style={{
            color: 'var(--capeo-muted)',
            fontSize: 17,
            lineHeight: 1.75,
            maxWidth: 620,
            margin: '0 0 80px',
          }}
        >
          Le marché premium se joue au-delà de 500 000 €. Beaucoup
          d'acquéreurs sérieux en sont exclus, non par manque de projet,
          mais par un plafond individuel. La co-acquisition change l'équation.
        </p>

        <div className="share-viz fade-up">
          <div className="share-single">
            <div className="share-single__num">600 000 €</div>
            <div className="share-single__label">Un bien exceptionnel</div>
            <div style={{ marginTop: 24, fontSize: 12, color: 'var(--capeo-muted)', lineHeight: 1.6 }}>
              Immeuble haussmannien · 3ᵉ arrondissement
              <br />
              Un ticket d'entrée réservé à quelques-uns.
            </div>
          </div>

          <div>
            <div
              style={{
                textAlign: 'center',
                marginBottom: 20,
                fontSize: 11,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'var(--capeo-gold)',
              }}
            >
              Réparti entre 4 acquéreurs
            </div>

            <div className="share-split">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="share-part">
                  <div className="share-part__avatar" />
                  <div className="share-part__num">150 000 €</div>
                  <div className="share-part__label">Acquéreur {n}</div>
                </div>
              ))}
            </div>

            <div
              style={{
                textAlign: 'center',
                marginTop: 22,
                fontSize: 11,
                color: 'var(--capeo-muted)',
                fontStyle: 'italic',
                letterSpacing: '0.05em',
              }}
            >
              * Exemple illustratif. Aucune promesse de rendement.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================================
   ACTE II — LA MÉTHODE (moment signature 3D)
   ============================================ */
function SolutionSection() {
  const ref = useReveal({ threshold: 0.2, stagger: 140 })

  const pillars = [
    {
      icon: <ShieldCheck size={20} strokeWidth={1.4} />,
      title: 'Identités vérifiées',
      desc: 'Chaque profil est examiné manuellement par notre équipe. Aucun robot, aucun automatisme.',
    },
    {
      icon: <Lock size={20} strokeWidth={1.4} />,
      title: 'Échanges privés',
      desc: "Une Business Room dédiée réunit les co-acquéreurs et le vendeur, à l'abri du marché ouvert.",
    },
    {
      icon: <FileSignature size={20} strokeWidth={1.4} />,
      title: 'Projet structuré',
      desc: "Nous cadrons l'organisation de l'acquisition en commun, aux côtés de vos notaires et conseils.",
    },
  ]

  return (
    <section id="solution" className="section" ref={ref} style={{ minHeight: '110vh' }}>
      <div className="container-narrow" style={{ textAlign: 'center' }}>
        <div className="fade-up" style={{ marginBottom: 30 }}>
          <span className="eyebrow" style={{ justifyContent: 'center' }}>Acte II — La méthode</span>
        </div>

        <h2
          className="font-serif"
          style={{
            fontSize: 'clamp(42px, 6.6vw, 96px)',
            lineHeight: 0.98,
            margin: '0 0 30px',
            fontWeight: 400,
            letterSpacing: '-0.02em',
          }}
        >
          <span className="reveal-line"><span><em className="gold-italic">S'unir,</em></span></span>
          <span className="reveal-line"><span>en toute confiance.</span></span>
        </h2>

        <p
          className="fade-up"
          style={{
            color: 'var(--capeo-muted)',
            fontSize: 17,
            lineHeight: 1.75,
            maxWidth: 620,
            margin: '0 auto 40px',
          }}
        >
          Quatre acquéreurs sérieux convergent vers un même bien d'exception.
          Notre plateforme les identifie, les vérifie, et structure leur mise en relation.
        </p>

        {/* Espace pour laisser respirer le moment signature Three.js */}
        <div style={{ height: '38vh' }} aria-hidden="true" />

        <div className="pillars fade-up">
          {pillars.map((p, i) => (
            <div className="pillar" key={i}>
              <div className="pillar__icon">{p.icon}</div>
              <h4 className="pillar__title">{p.title}</h4>
              <div className="pillar__desc">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================
   ACTE III — LA CONFIANCE
   ============================================ */
function TrustSection() {
  const ref = useReveal({ threshold: 0.2, stagger: 140 })

  const cards = [
    {
      n: '01',
      title: "Contrôle d'identité humain",
      desc: "Pièce d'identité, adresse, cohérence du projet. Chaque dossier est ouvert et refermé par un membre de notre équipe. Jamais un algorithme.",
    },
    {
      n: '02',
      title: 'Vendeurs & biens authentifiés',
      desc: 'Titre de propriété, mandat, éléments déclarés. Nous validons la réalité du bien avant toute mise en visibilité privée.',
    },
    {
      n: '03',
      title: 'Acquéreurs filtrés',
      desc: 'Sérieux, cohérence, disponibilité. Les Business Rooms ne réunissent que des interlocuteurs qualifiés — pas de curieux, pas de bruit.',
    },
  ]

  return (
    <section
      id="trust"
      className="section"
      ref={ref}
      style={{
        background: 'linear-gradient(to bottom, transparent 0%, rgba(9,9,11,0.55) 20%, rgba(9,9,11,0.85) 100%)',
      }}
    >
      <div className="container">
        <div className="fade-up" style={{ marginBottom: 30 }}>
          <span className="eyebrow">Acte III — La confiance</span>
        </div>

        <h2
          className="font-serif"
          style={{
            fontSize: 'clamp(38px, 5.4vw, 74px)',
            lineHeight: 1.02,
            margin: '0 0 30px',
            fontWeight: 400,
            letterSpacing: '-0.015em',
            maxWidth: 920,
          }}
        >
          <span className="reveal-line"><span>Un <em className="gold-italic">cercle vérifié,</em></span></span>
          <span className="reveal-line"><span>contrôlé par des humains.</span></span>
        </h2>

        <p
          className="fade-up"
          style={{
            color: 'var(--capeo-muted)',
            fontSize: 17,
            lineHeight: 1.75,
            maxWidth: 620,
            margin: '0 0 80px',
          }}
        >
          La technologie accélère les rencontres. Le jugement humain les valide.
          Chaque profil qui entre dans une Business Room a été revu, un par un,
          par notre équipe.
        </p>

        <div className="pillars">
          {cards.map((c, i) => (
            <div className="capeo-card fade-up" key={i}>
              <span className="num-badge">{c.n}</span>
              <h3
                className="font-serif"
                style={{
                  fontSize: 28,
                  margin: '6px 0 14px',
                  fontWeight: 500,
                  color: 'var(--capeo-text)',
                  lineHeight: 1.15,
                }}
              >
                {c.title}
              </h3>
              <p style={{ color: 'var(--capeo-muted)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================
   ACTE IV — LES BIENS
   ============================================ */
const CATS = [
  {
    num: '01',
    title: 'Immeubles de rapport',
    desc: "Ensembles historiques et haussmanniens, patrimoine bâti d'exception.",
    img: 'https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?auto=format&fit=crop&w=1400&q=80',
  },
  {
    num: '02',
    title: "Biens d'exception",
    desc: 'Villas contemporaines, hôtels particuliers, propriétés rares.',
    img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1400&q=80',
  },
  {
    num: '03',
    title: 'Immobilier commercial',
    desc: 'Actifs commerciaux premium, murs et locaux prestigieux.',
    img: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=1400&q=80',
  },
]

function CategoriesSection() {
  const ref = useReveal({ threshold: 0.15, stagger: 160 })

  return (
    <section
      id="categories"
      className="section"
      ref={ref}
      style={{
        background: 'linear-gradient(to bottom, rgba(9,9,11,0.85) 0%, rgba(9,9,11,0.95) 100%)',
      }}
    >
      <div className="container">
        <div className="fade-up" style={{ marginBottom: 30 }}>
          <span className="eyebrow">Acte IV — Les biens</span>
        </div>

        <h2
          className="font-serif"
          style={{
            fontSize: 'clamp(38px, 5.4vw, 74px)',
            lineHeight: 1.02,
            margin: '0 0 60px',
            fontWeight: 400,
            letterSpacing: '-0.015em',
            maxWidth: 780,
          }}
        >
          <span className="reveal-line"><span>Trois <em className="gold-italic">terrains</em></span></span>
          <span className="reveal-line"><span>où l'exception se joue.</span></span>
        </h2>

        <div className="cats">
          {CATS.map((c, i) => (
            <Link to="/actifs" className="cat-card fade-up" key={i}>
              <img src={c.img} alt={c.title} loading="lazy" />
              <div className="cat-card__content">
                <div className="cat-card__num">{c.num}</div>
                <div className="cat-card__title">{c.title}</div>
                <div className="cat-card__desc">{c.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================
   ACTE V — REJOINDRE
   ============================================ */
function CTASection() {
  const ref = useReveal({ threshold: 0.2, stagger: 150 })

  return (
    <section id="cta" className="section" ref={ref} style={{ paddingBottom: 60 }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 70 }}>
          <div className="fade-up" style={{ marginBottom: 26 }}>
            <span className="eyebrow" style={{ justifyContent: 'center' }}>Acte V — Rejoindre</span>
          </div>
          <h2
            className="font-serif"
            style={{
              fontSize: 'clamp(40px, 6vw, 82px)',
              lineHeight: 1.02,
              margin: 0,
              fontWeight: 400,
              letterSpacing: '-0.015em',
            }}
          >
            <span className="reveal-line">
              <span>Le seuil <em className="gold-italic">de l'exception.</em></span>
            </span>
          </h2>
        </div>

        <div className="cta-split fade-up">
          <div className="cta-panel">
            <div className="eyebrow" style={{ marginBottom: 20 }}>Vendeurs</div>
            <h3>
              Publiez <em className="gold-italic">gratuitement</em>
              <br />
              votre bien.
            </h3>
            <p>
              Confidentialité totale, acquéreurs qualifiés, aucune commission
              côté vendeur. Un canal discret vers un cercle restreint.
            </p>
            <Link to="/proposer-un-actif" className="btn-gold">
              Publier un bien
              <ArrowUpRight size={16} strokeWidth={1.6} />
            </Link>
          </div>

          <div className="cta-panel">
            <div className="eyebrow" style={{ marginBottom: 20 }}>Acquéreurs</div>
            <h3>
              Rejoignez les <em className="gold-italic">Business Rooms.</em>
            </h3>
            <p>
              Accédez à des biens que le marché ouvert ne verra jamais.
              Rencontrez d'autres acquéreurs sérieux filtrés à la main.
            </p>
            <Link to="/inscription" className="btn-gold">
              Créer un compte
              <ArrowUpRight size={16} strokeWidth={1.6} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================================
   HOME — Assemblage
   ============================================ */
export default function Home() {
  const canvasRef = useRef(null)
  const sceneRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return

    sceneRef.current = createCapeoScene(canvasRef.current)

    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    })

    let rafId
    const raf = (time) => {
      lenis.raf(time)
      const scrollTop = window.scrollY || window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? scrollTop / docHeight : 0
      sceneRef.current?.setScrollProgress(progress)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      sceneRef.current?.dispose()
    }
  }, [])

  return (
    <div className="home">
      <canvas id="capeo-canvas" ref={canvasRef} />

      <Hero />
      <ProblemSection />
      <SolutionSection />
      <TrustSection />
      <CategoriesSection />
      <CTASection />
    </div>
  )
}
