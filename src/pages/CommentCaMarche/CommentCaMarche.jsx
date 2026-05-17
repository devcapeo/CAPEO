/* ============================================
   CAPEO — COMMENT ÇA MARCHE V2
   Layout 2 colonnes Vendeurs / Acquéreurs.
   Étapes numérotées en liste.
   FAQ accordion.
   Référence Emergent.
   ============================================ */

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './CommentCaMarche.css'

const VENDEUR_STEPS = [
  {
    num: '01',
    title: 'Créez votre compte vendeur',
    desc: 'Inscription gratuite. Validation de votre identité par vérification KYC.',
  },
  {
    num: '02',
    title: 'Décrochez le badge Vérifié CAPEO',
    desc: 'Une fois vérifié, votre profil est marqué Vérifié CAPEO — un gage de sérieux pour les acquéreurs.',
  },
  {
    num: '03',
    title: 'Publiez votre actif',
    desc: 'Décrivez l\'actif, ajoutez photos et indicateurs. Publication gratuite sans engagement.',
  },
  {
    num: '04',
    title: 'Recevez les manifestations d\'intérêt',
    desc: 'Les acquéreurs intéressés entrent dans la Business Room privée pour vous contacter.',
  },
  {
    num: '05',
    title: 'Concluez hors plateforme',
    desc: 'La transaction se formalise directement entre vous et les acquéreurs. CAPEO ne prélève aucune commission.',
  },
]

const ACQUEREUR_STEPS = [
  {
    num: '01',
    title: 'Explorez la place de marché',
    desc: 'Parcourez les actifs disponibles, filtrez par catégorie, prix, localisation.',
  },
  {
    num: '02',
    title: 'Manifestez votre intérêt',
    desc: 'Activez une Business Room pour entrer en contact avec le vendeur et les autres acquéreurs intéressés.',
  },
  {
    num: '03',
    title: 'Choisissez votre formule',
    desc: '15€ par room à la carte, ou 19,90€/mois avec CAPEO+ pour un accès illimité (rooms + Off-Market).',
  },
  {
    num: '04',
    title: 'Échangez en privé',
    desc: 'Discussion sécurisée, partage de documents confidentiels, déclarations d\'apport entre acquéreurs.',
  },
  {
    num: '05',
    title: 'Co-acquérez en toute discrétion',
    desc: 'La signature s\'effectue hors plateforme via vos conseils habituels (notaires, avocats, experts).',
  },
]

const FAQ = [
  {
    q: 'CAPEO prélève-t-il une commission sur les transactions ?',
    a: 'Non. CAPEO n\'est pas un prestataire de services de financement participatif (PSFP). Aucun flux financier ne transite par la plateforme. Les transactions sont formalisées hors plateforme entre les parties. CAPEO se rémunère uniquement sur l\'accès aux Business Rooms (15€/room ou 19,90€/mois pour CAPEO+).',
  },
  {
    q: 'Les indicateurs financiers affichés sont-ils vérifiés par CAPEO ?',
    a: 'Non. Les indicateurs présentés (chiffres d\'affaires, surfaces, prix indicatifs, charges, etc.) sont fournis exclusivement par les vendeurs et ne sont pas vérifiés par CAPEO. Il appartient à chaque acquéreur de procéder à ses propres vérifications avec ses conseils.',
  },
  {
    q: 'Comment fonctionne le badge Vérifié CAPEO ?',
    a: 'Le badge Vérifié CAPEO atteste que l\'identité du vendeur a été vérifiée via notre processus KYC. Il ne constitue ni une garantie ni une recommandation sur la qualité de l\'actif proposé.',
  },
  {
    q: 'Qu\'est-ce qu\'une Business Room ?',
    a: 'Une Business Room est un espace privé dédié à un actif spécifique. Elle réunit le vendeur et les acquéreurs intéressés pour échanger en confidentialité : chat sécurisé, partage de documents, déclarations d\'intentions d\'apport entre co-acquéreurs.',
  },
  {
    q: 'Qu\'est-ce que la co-acquisition ?',
    a: 'La co-acquisition désigne le fait, pour plusieurs acquéreurs, de s\'unir pour acquérir ensemble un actif premium. CAPEO facilite la mise en relation des co-acquéreurs ; la structuration juridique et fiscale relève exclusivement des conseils des parties.',
  },
  {
    q: 'CAPEO propose-t-il des simulations de rendement ?',
    a: 'Non. Conformément au cadre réglementaire applicable, CAPEO ne propose aucune simulation de rendement, de plus-value ni de fiscalité.',
  },
  {
    q: 'Quel est le cadre légal de CAPEO ?',
    a: 'CAPEO est une plateforme de mise en relation au sens du règlement européen 2019/1150 sur l\'équité des relations entre plateformes et utilisateurs professionnels. CAPEO n\'est pas un PSFP, ne propose pas d\'offre au public d\'instruments financiers et n\'intervient pas dans le règlement des transactions.',
  },
]

export default function CommentCaMarche() {
  const [openFaq, setOpenFaq] = useState(null)
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
      { threshold: 0.08 }
    )
    const reveals = sectionRef.current?.querySelectorAll('.reveal')
    reveals?.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i)

  return (
    <div className="ccm" ref={sectionRef}>

      {/* ── HERO ── */}
      <div className="ccm__hero">
        <div className="ccm__hero-bg"></div>
        <div className="ccm__hero-inner container reveal">
          <div className="section-label">Le fonctionnement</div>
          <h1 className="ccm__hero-title">
            Comment fonctionne<br/>
            <em>CAPEO.</em>
          </h1>
          <p className="ccm__hero-sub">
            Une place de marché entre acquéreurs qualifiés et vendeurs
            d'actifs premium. Mise en relation, confidentialité, zéro
            commission. Les transactions se concluent hors plateforme
            entre les parties.
          </p>
        </div>
        <div className="ccm__hero-line"></div>
      </div>

      {/* ── COLONNES ÉTAPES ── */}
      <div className="ccm__steps container">
        <div className="ccm__steps-grid">

          {/* Vendeurs */}
          <div className="ccm__col reveal">
            <div className="ccm__col-header">
              <div className="ccm__col-label">Pour les vendeurs</div>
              <h2 className="ccm__col-title">
                Publiez gratuitement.
              </h2>
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
              Publier un actif →
            </Link>
          </div>

          {/* Séparateur vertical */}
          <div className="ccm__col-sep"></div>

          {/* Acquéreurs */}
          <div className="ccm__col reveal reveal-delay-1">
            <div className="ccm__col-header">
              <div className="ccm__col-label">Pour les acquéreurs</div>
              <h2 className="ccm__col-title">
                Accédez à la sélection.
              </h2>
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
          <div className="ccm__faq-header reveal">
            <div className="section-label">Questions fréquentes</div>
            <h2 className="ccm__faq-title">FAQ.</h2>
          </div>

          <div className="ccm__faq-list">
            {FAQ.map((item, i) => (
              <div
                key={i}
                className={`ccm__faq-item reveal ${openFaq === i ? 'ccm__faq-item--open' : ''}`}
              >
                <button
                  className="ccm__faq-question"
                  onClick={() => toggleFaq(i)}
                >
                  <span>{item.q}</span>
                  <div className="ccm__faq-icon">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d={openFaq === i ? 'M2 7h10' : 'M7 2v10M2 7h10'}
                        stroke="currentColor" strokeWidth="1.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </button>
                {openFaq === i && (
                  <div className="ccm__faq-answer">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA FINAL ── */}
      <div className="ccm__bottom container reveal">
        <div className="ccm__bottom-inner">
          <h2 className="ccm__bottom-title">
            Prêt à acquérir l'exception ?
          </h2>
          <div className="ccm__bottom-actions">
            <Link to="/actifs" className="ccm__btn-primary">
              Explorer les actifs →
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
