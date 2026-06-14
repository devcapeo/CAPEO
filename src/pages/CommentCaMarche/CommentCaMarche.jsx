/* ============================================
   CAPEO — COMMENT ÇA MARCHE V4
   Structure calquée sur la page Actifs.
   ============================================ */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import './CommentCaMarche.css'

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
  { q: 'Combien coûte CAPEO ?', a: 'Pendant notre phase de lancement, l\'accès est entièrement gratuit, pour les vendeurs comme pour les acquéreurs. Notre objectif est d\'abord de constituer une communauté de qualité et de concrétiser les premiers projets de co-acquisition.' },
  { q: 'CAPEO prélève-t-il une commission sur les transactions ?', a: 'Non. CAPEO n\'est pas un prestataire de services de financement participatif (PSFP). Aucun flux financier ne transite par la plateforme. Les transactions sont formalisées hors plateforme entre les parties.' },
  { q: 'Les informations affichées sont-elles vérifiées par CAPEO ?', a: 'Non. Les informations présentées (surfaces, prix indicatifs, charges, etc.) sont fournies exclusivement par les vendeurs et ne sont pas vérifiées par CAPEO. Il appartient à chaque acquéreur de procéder à ses propres vérifications avec ses conseils.' },
  { q: 'Comment fonctionne le badge Vérifié CAPEO ?', a: 'Le badge Vérifié CAPEO atteste que l\'identité du vendeur a été vérifiée via notre processus KYC. Il ne constitue ni une garantie ni une recommandation sur la qualité du bien proposé.' },
  { q: 'Qu\'est-ce qu\'une Business Room ?', a: 'Une Business Room est un espace privé dédié à un bien spécifique. Elle réunit le vendeur et les acquéreurs intéressés pour échanger en confidentialité : discussion sécurisée, partage de documents, déclarations d\'intentions d\'apport entre co-acquéreurs.' },
  { q: 'Qu\'est-ce que la co-acquisition ?', a: 'La co-acquisition désigne le fait, pour plusieurs acquéreurs, de s\'unir pour acquérir ensemble un bien immobilier. CAPEO facilite la mise en relation des co-acquéreurs ; la structuration juridique et fiscale relève exclusivement des conseils des parties.' },
  { q: 'CAPEO propose-t-il des simulations de rendement ?', a: 'Non. Conformément au cadre réglementaire applicable, CAPEO ne propose aucune simulation de rendement, de plus-value ni de fiscalité.' },
  { q: 'Quel est le cadre légal de CAPEO ?', a: 'CAPEO est une plateforme de mise en relation au sens du règlement européen 2019/1150. CAPEO n\'est pas un PSFP, ne propose pas d\'offre au public d\'instruments financiers et n\'intervient pas dans le règlement des transactions.' },
]

export default function CommentCaMarche() {
  const [openFaq, setOpenFaq] = useState(null)
  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i)

  return (
    <div className="ccm-page">

      {/* ── EN-TÊTE (calqué sur actifs-page__header) ── */}
      <div className="ccm-page__header">
        <div className="ccm-page__header-inner">
          <div className="ccm-page__eyebrow">Le fonctionnement</div>
          <h1 className="ccm-page__title">
            Comment fonctionne <em>CAPEO</em>
          </h1>
          <p className="ccm-page__sub">
            Une place de marché entre acquéreurs qualifiés et vendeurs
            de biens immobiliers. Mise en relation, confidentialité, zéro
            commission. Les transactions se concluent hors plateforme.
          </p>
        </div>
      </div>

      {/* ── CONTENU ── */}
      <div className="ccm-content">
        <div className="ccm-content__inner">

          {/* COLONNES ÉTAPES */}
          <div className="ccm-steps-grid">

            <div className="ccm-col">
              <div className="ccm-col__header">
                <div className="ccm-col__label">Pour les vendeurs</div>
                <h2 className="ccm-col__title">Publiez gratuitement.</h2>
              </div>
              <div className="ccm-col__steps">
                {VENDEUR_STEPS.map((step, i) => (
                  <div key={i} className="ccm-step">
                    <div className="ccm-step__num">{step.num}</div>
                    <div className="ccm-step__content">
                      <div className="ccm-step__title">{step.title}</div>
                      <div className="ccm-step__desc">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/proposer-un-actif" className="ccm-col__cta">Publier un bien →</Link>
            </div>

            <div className="ccm-col__sep"></div>

            <div className="ccm-col">
              <div className="ccm-col__header">
                <div className="ccm-col__label">Pour les acquéreurs</div>
                <h2 className="ccm-col__title">Accédez aux biens.</h2>
              </div>
              <div className="ccm-col__steps">
                {ACQUEREUR_STEPS.map((step, i) => (
                  <div key={i} className="ccm-step">
                    <div className="ccm-step__num">{step.num}</div>
                    <div className="ccm-step__content">
                      <div className="ccm-step__title">{step.title}</div>
                      <div className="ccm-step__desc">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/inscription" className="ccm-col__cta">Rejoindre CAPEO →</Link>
            </div>

          </div>

          {/* FAQ */}
          <div className="ccm-faq">
            <div className="ccm-faq__header">
              <div className="ccm-page__eyebrow">Questions fréquentes</div>
              <h2 className="ccm-faq__title">FAQ.</h2>
            </div>
            <div className="ccm-faq__list">
              {FAQ.map((item, i) => (
                <div key={i} className={`ccm-faq__item ${openFaq === i ? 'ccm-faq__item--open' : ''}`}>
                  <button className="ccm-faq__question" onClick={() => toggleFaq(i)}>
                    <span>{item.q}</span>
                    <div className="ccm-faq__icon">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d={openFaq === i ? 'M2 7h10' : 'M7 2v10M2 7h10'} stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </button>
                  {openFaq === i && <div className="ccm-faq__answer">{item.a}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* CTA FINAL */}
          <div className="ccm-bottom">
            <h2 className="ccm-bottom__title">Prêt à acquérir <em>l'exception</em> ?</h2>
            <div className="ccm-bottom__actions">
              <Link to="/actifs" className="ccm-btn-primary">Explorer les biens →</Link>
              <Link to="/inscription" className="ccm-btn-ghost">Créer un compte</Link>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
