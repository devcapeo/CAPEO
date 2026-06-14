/* ============================================
   CAPEO — COMMENT ÇA MARCHE V3
   Immobilier. V1 gratuit. Animations GSAP.
   ============================================ */

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './CommentCaMarche.css'

gsap.registerPlugin(ScrollTrigger)

const VENDEUR_STEPS = [
  { num: '01', title: 'Créez votre compte vendeur', desc: 'Inscription gratuite. Validation de votre identité par vérification KYC.' },
  { num: '02', title: 'Décrochez le badge Vérifié CAPEO', desc: 'Une fois vérifié, votre profil porte le badge Vérifié CAPEO — un gage de sérieux pour les acquéreurs.' },
  { num: '03', title: 'Publiez votre bien', desc: 'Décrivez le bien, ajoutez photos et informations. Publication gratuite, sans engagement.' },
  { num: '04', title: 'Recevez les marques d\'intérêt', desc: 'Les acquéreurs intéressés rejoignent la Business Room privée dédiée à votre bien.' },
  { num: '05', title: 'Concluez hors plateforme', desc: 'La transaction se formalise directement entre vous et les acquéreurs. CAPEO ne prélève aucune commission.' },
]

const ACQUEREUR_STEPS = [
  { num: '01', title: 'Explorez la place de marché', desc: 'Parcourez les biens immobiliers disponibles, filtrez par ville, prix et type de bien.' },
  { num: '02', title: 'Rejoignez une Business Room', desc: 'Manifestez votre intérêt pour entrer dans la Business Room privée et rencontrer le vendeur et les autres co-acquéreurs.' },
  { num: '03', title: 'Échangez en privé', desc: 'Discussion sécurisée, partage de documents, déclarations d\'intentions d\'apport entre co-acquéreurs.' },
  { num: '04', title: 'Structurez votre projet', desc: 'Définissez ensemble la répartition et la forme juridique de l\'acquisition (SCI, indivision).' },
  { num: '05', title: 'Co-acquérez en toute discrétion', desc: 'La signature s\'effectue hors plateforme via vos conseils habituels — notaires, avocats, experts.' },
]

const FAQ = [
  {
    q: 'Combien coûte CAPEO ?',
    a: 'Pendant notre phase de lancement, l\'accès est entièrement gratuit, pour les vendeurs comme pour les acquéreurs. Notre objectif est d\'abord de constituer une communauté de qualité et de concrétiser les premiers projets de co-acquisition.',
  },
  {
    q: 'CAPEO prélève-t-il une commission sur les transactions ?',
    a: 'Non. CAPEO n\'est pas un prestataire de services de financement participatif (PSFP). Aucun flux financier ne transite par la plateforme. Les transactions sont formalisées hors plateforme entre les parties.',
  },
  {
    q: 'Les informations affichées sont-elles vérifiées par CAPEO ?',
    a: 'Non. Les informations présentées (surfaces, prix indicatifs, charges, etc.) sont fournies exclusivement par les vendeurs et ne sont pas vérifiées par CAPEO. Il appartient à chaque acquéreur de procéder à ses propres vérifications avec ses conseils.',
  },
  {
    q: 'Comment fonctionne le badge Vérifié CAPEO ?',
    a: 'Le badge Vérifié CAPEO atteste que l\'identité du vendeur a été vérifiée via notre processus KYC. Il ne constitue ni une garantie ni une recommandation sur la qualité du bien proposé.',
  },
  {
    q: 'Qu\'est-ce qu\'une Business Room ?',
    a: 'Une Business Room est un espace privé dédié à un bien spécifique. Elle réunit le vendeur et les acquéreurs intéressés pour échanger en confidentialité : discussion sécurisée, partage de documents, déclarations d\'intentions d\'apport entre co-acquéreurs.',
  },
  {
    q: 'Qu\'est-ce que la co-acquisition ?',
    a: 'La co-acquisition désigne le fait, pour plusieurs acquéreurs, de s\'unir pour acquérir ensemble un bien immobilier. CAPEO facilite la mise en relation des co-acquéreurs ; la structuration juridique et fiscale relève exclusivement des conseils des parties.',
  },
  {
    q: 'CAPEO propose-t-il des simulations de rendement ?',
    a: 'Non. Conformément au cadre réglementaire applicable, CAPEO ne propose aucune simulation de rendement, de plus-value ni de fiscalité.',
  },
  {
    q: 'Quel est le cadre légal de CAPEO ?',
    a: 'CAPEO est une plateforme de mise en relation au sens du règlement européen 2019/1150. CAPEO n\'est pas un PSFP, ne propose pas d\'offre au public d\'instruments financiers et n\'intervient pas dans le règlement des transactions.',
  },
]

export default function CommentCaMarche() {
  const [openFaq, setOpenFaq] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.ccm__hero-el', {
        opacity: 0, y: 30, duration: 1, ease: 'power3.out', stagger: 0.12,
      })
      gsap.utils.toArray('.ccm__reveal').forEach((el) => {
        gsap.from(el, {
          opacity: 0, y: 40, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        })
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i)

  return (
    <div className="ccm" ref={ref}>

      {/* ── HERO ── */}
      <div className="ccm__hero">
        <div className="ccm__hero-bg"></div>
        <div className="ccm__hero-inner container">
          <div className="ccm__hero-el ccm__eyebrow">Le fonctionnement</div>
          <h1 className="ccm__hero-el ccm__hero-title">
            Comment fonctionne<br/>
            <em>CAPEO.</em>
          </h1>
          <p className="ccm__hero-el ccm__hero-sub">
            Une place de marché entre acquéreurs qualifiés et vendeurs
            de biens immobiliers. Mise en relation, confidentialité, zéro
            commission. Les transactions se concluent hors plateforme
            entre les parties.
          </p>
        </div>
        <div className="ccm__hero-line"></div>
      </div>

      {/* ── COLONNES ÉTAPES ── */}
      <div className="ccm__steps container">
        <div className="ccm__steps-grid">

          <div className="ccm__col ccm__reveal">
            <div className="ccm__col-header">
              <div className="ccm__col-label">Pour les vendeurs</div>
              <h2 className="ccm__col-title">Publiez gratuitement.</h2>
            </div>
            <div className="ccm__col-steps">
              {VENDEUR_STEPS.map((step, i) => (
                <div key={i} className="ccm__step">
                  <div className="ccm__step-num">{step.num}</div>
                  <div className="ccm__step-content">
                    <div className="ccm__step-title">{step.title}</div>
                    <div className="ccm__step-desc">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/proposer-un-actif" className="ccm__col-cta">
              Publier un bien →
            </Link>
          </div>

          <div className="ccm__col-sep"></div>

          <div className="ccm__col ccm__reveal">
            <div className="ccm__col-header">
              <div className="ccm__col-label">Pour les acquéreurs</div>
              <h2 className="ccm__col-title">Accédez aux biens.</h2>
            </div>
            <div className="ccm__col-steps">
              {ACQUEREUR_STEPS.map((step, i) => (
                <div key={i} className="ccm__step">
                  <div className="ccm__step-num">{step.num}</div>
                  <div className="ccm__step-content">
                    <div className="ccm__step-title">{step.title}</div>
                    <div className="ccm__step-desc">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/inscription" className="ccm__col-cta">
              Rejoindre CAPEO →
            </Link>
          </div>

        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="ccm__faq">
        <div className="container">
          <div className="ccm__faq-header ccm__reveal">
            <div className="ccm__eyebrow">Questions fréquentes</div>
            <h2 className="ccm__faq-title">FAQ.</h2>
          </div>

          <div className="ccm__faq-list ccm__reveal">
            {FAQ.map((item, i) => (
              <div key={i} className={`ccm__faq-item ${openFaq === i ? 'ccm__faq-item--open' : ''}`}>
                <button className="ccm__faq-question" onClick={() => toggleFaq(i)}>
                  <span>{item.q}</span>
                  <div className="ccm__faq-icon">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d={openFaq === i ? 'M2 7h10' : 'M7 2v10M2 7h10'} stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </button>
                {openFaq === i && <div className="ccm__faq-answer">{item.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA FINAL ── */}
      <div className="ccm__bottom container ccm__reveal">
        <div className="ccm__bottom-inner">
          <h2 className="ccm__bottom-title">Prêt à acquérir <em>l'exception</em> ?</h2>
          <div className="ccm__bottom-actions">
            <Link to="/actifs" className="ccm__btn-primary btn-gold-shimmer">
              <span>Explorer les biens →</span>
            </Link>
            <Link to="/inscription" className="ccm__btn-ghost">
              Créer un compte
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}
