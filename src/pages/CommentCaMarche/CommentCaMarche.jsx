/* ============================================
   CAPEO — COMMENT ÇA MARCHE V5
   Étapes + section confiance + FAQ.
   ============================================ */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import './CommentCaMarche.css'

const VENDEUR_STEPS = [
  { num: '01', title: 'Créez votre compte vendeur', desc: 'Inscription gratuite. Votre identité est vérifiée par notre équipe avant toute publication.' },
  { num: '02', title: 'Décrochez le badge Vérifié CAPEO', desc: 'Une fois votre profil examiné et validé manuellement, vous portez le badge Vérifié CAPEO — un gage de sérieux pour les acquéreurs.' },
  { num: '03', title: 'Publiez votre bien', desc: 'Décrivez le bien, ajoutez photos et informations. Chaque annonce est examinée avant mise en ligne. Publication gratuite, sans engagement.' },
  { num: '04', title: 'Recevez les marques d\'intérêt', desc: 'Seuls des acquéreurs vérifiés peuvent rejoindre la Business Room privée dédiée à votre bien.' },
  { num: '05', title: 'Concluez hors plateforme', desc: 'La transaction se formalise directement entre vous et les acquéreurs. CAPEO ne prélève aucune commission.' },
]

const ACQUEREUR_STEPS = [
  { num: '01', title: 'Explorez la place de marché', desc: 'Parcourez librement les biens immobiliers, filtrez par ville, prix et type de bien.' },
  { num: '02', title: 'Faites vérifier votre profil', desc: 'Pour contacter un vendeur ou rejoindre une Business Room, votre identité est vérifiée par notre équipe. C\'est ce qui garantit un cercle d\'acquéreurs sérieux.' },
  { num: '03', title: 'Rejoignez une Business Room', desc: 'Entrez dans l\'espace privé du bien pour rencontrer le vendeur et les autres co-acquéreurs vérifiés.' },
  { num: '04', title: 'Structurez votre projet', desc: 'Échangez en confidentialité, partagez vos documents et vos intentions, et appuyez-vous sur nos modèles (SCI, pacte) à valider avec vos conseils.' },
  { num: '05', title: 'Co-acquérez en toute discrétion', desc: 'La signature s\'effectue hors plateforme via vos conseils habituels — notaires, avocats, experts.' },
]

const TRUST = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 2l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V5l7-3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
        <path d="M8 11l2 2 4-4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Vérification humaine',
    desc: 'Chaque profil est examiné un par un par notre équipe — pas par un algorithme. Pièce d\'identité et documents sont contrôlés avant validation.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="9" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M2.5 18c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M16 8l2 2 3.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Un cercle filtré',
    desc: 'L\'inscription et la vérification sont obligatoires pour contacter un vendeur ou rejoindre une Business Room. Pas de curieux, pas de démarchage — uniquement des acquéreurs sérieux.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="4" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M3 8h16M7 12h5M7 15h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Sécuriser la relation',
    desc: 'La peur n°1 d\'un achat à plusieurs : et si ça se passe mal entre nous ? CAPEO structure la relation — Business Room tracée, modèles de pacte d\'associés, checklist notaire — pour partir sur des bases saines.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 3l2.2 4.5 5 .7-3.6 3.5.9 5L11 14.8 6.5 16.7l.9-5L3.8 8.2l5-.7L11 3z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Une sélection, pas un catalogue',
    desc: 'Chaque bien est examiné avant publication. CAPEO n\'est pas un site d\'annonces ouvert à tous : c\'est un cercle où la qualité prime sur la quantité.',
  },
]

const FAQ = [
  { q: 'Combien coûte CAPEO ?', a: 'Pendant notre phase de lancement, l\'accès est entièrement gratuit, pour les vendeurs comme pour les acquéreurs. Notre objectif est d\'abord de constituer une communauté de qualité et de concrétiser les premiers projets de co-acquisition.' },
  { q: 'Comment vérifiez-vous les profils ?', a: 'Chaque inscription est examinée manuellement par notre équipe. Nous demandons une pièce d\'identité et, pour les vendeurs, un document attestant du bien. Cet examen humain est ce qui garantit le sérieux du cercle d\'acquéreurs et de vendeurs.' },
  { q: 'CAPEO prélève-t-il une commission sur les transactions ?', a: 'Non. CAPEO n\'est pas un prestataire de services de financement participatif (PSFP). Aucun flux financier ne transite par la plateforme. Les transactions sont formalisées hors plateforme entre les parties.' },
  { q: 'Les informations affichées sont-elles vérifiées par CAPEO ?', a: 'Nous vérifions l\'identité des vendeurs et l\'existence du bien. En revanche, les informations détaillées (surfaces, prix indicatifs, charges, etc.) sont fournies par les vendeurs : il appartient à chaque acquéreur de procéder à ses propres vérifications avec ses conseils.' },
  { q: 'Comment fonctionne le badge Vérifié CAPEO ?', a: 'Le badge atteste que l\'identité du membre a été contrôlée manuellement par notre équipe. Il ne constitue ni une garantie ni une recommandation sur la qualité du bien proposé.' },
  { q: 'Qu\'est-ce qu\'une Business Room ?', a: 'Une Business Room est un espace privé dédié à un bien spécifique. Elle réunit le vendeur et les acquéreurs vérifiés pour échanger en confidentialité : discussion sécurisée, partage de documents, déclarations d\'intentions d\'apport entre co-acquéreurs.' },
  { q: 'Qu\'est-ce que la co-acquisition ?', a: 'La co-acquisition désigne le fait, pour plusieurs acquéreurs, de s\'unir pour acquérir ensemble un bien immobilier. CAPEO facilite la mise en relation des co-acquéreurs ; la structuration juridique et fiscale relève exclusivement des conseils des parties.' },
  { q: 'CAPEO propose-t-il des simulations de rendement ?', a: 'Non. Conformément au cadre réglementaire applicable, CAPEO ne propose aucune simulation de rendement, de plus-value ni de fiscalité.' },
  { q: 'Quel est le cadre légal de CAPEO ?', a: 'CAPEO est une plateforme de mise en relation au sens du règlement européen 2019/1150. CAPEO n\'est pas un PSFP, ne propose pas d\'offre au public d\'instruments financiers et n\'intervient pas dans le règlement des transactions.' },
]

export default function CommentCaMarche() {
  const [openFaq, setOpenFaq] = useState(null)
  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i)

  return (
    <div className="ccm-page">

      {/* ── EN-TÊTE ── */}
      <div className="ccm-page__header">
        <div className="ccm-page__header-inner">
          <div className="ccm-page__eyebrow">Le fonctionnement</div>
          <h1 className="ccm-page__title">
            Investir à plusieurs,<br/><em>en toute confiance</em>
          </h1>
          <p className="ccm-page__sub">
            CAPEO réunit des acquéreurs vérifiés pour acquérir ensemble
            des biens hors de portée seul. Profils contrôlés un par un par
            notre équipe, mise en relation privée, zéro commission. Les
            transactions se concluent hors plateforme entre les parties.
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

          {/* ── SECTION CONFIANCE ── */}
          <div className="ccm-trust">
            <div className="ccm-trust__header">
              <div className="ccm-page__eyebrow">Ce qui nous distingue</div>
              <h2 className="ccm-trust__title">La confiance, par défaut.</h2>
              <p className="ccm-trust__sub">
                CAPEO n'est pas un site d'annonces. C'est un cercle vérifié où
                chacun sait à qui il a affaire — avant même la première conversation.
              </p>
            </div>
            <div className="ccm-trust__grid">
              {TRUST.map((item, i) => (
                <div key={i} className="ccm-trust__card">
                  <div className="ccm-trust__icon">{item.icon}</div>
                  <div className="ccm-trust__card-title">{item.title}</div>
                  <div className="ccm-trust__card-desc">{item.desc}</div>
                </div>
              ))}
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
