/* ============================================
   CAPEO — FOOTER RICHE
   CTA + newsletter + colonnes + réseaux.
   ============================================ */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = () => {
    if (!email || !email.includes('@')) return
    setSent(true)
    setEmail('')
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <footer className="footer">

      {/* ── BANDEAU CTA ── */}
      <div className="footer__cta">
        <div className="footer__cta-inner container">
          <div className="footer__cta-text">
            <div className="footer__cta-eyebrow">Rejoignez CAPEO</div>
            <h2 className="footer__cta-title">
              Prêt à acquérir <em>l'exception</em> ?
            </h2>
          </div>
          <div className="footer__cta-actions">
            <Link to="/inscription" className="footer__cta-btn footer__cta-btn--primary btn-gold-shimmer">
              <span>Créer un compte</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link to="/actifs" className="footer__cta-btn footer__cta-btn--ghost">
              Explorer les biens
            </Link>
          </div>
        </div>
      </div>

      <div className="footer__main container">

        {/* ── HAUT : brand + newsletter ── */}
        <div className="footer__top">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">CAP<span>E</span>O</Link>
            <div className="footer__meaning">Capital &amp; Opportunities</div>
            <p className="footer__tagline">
              Place de marché d'actifs premium.<br/>
              Co-acquisition entre acquéreurs qualifiés.
            </p>
            <div className="footer__social">
              <a href="#" className="footer__social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="2" y="2" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="1.3"/>
                  <circle cx="9" cy="9" r="3.2" stroke="currentColor" strokeWidth="1.3"/>
                  <circle cx="13" cy="5" r="0.8" fill="currentColor"/>
                </svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="TikTok" target="_blank" rel="noopener noreferrer">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M11 2v8.5a3 3 0 11-2.4-2.94V6.1A5 5 0 1013 11V6.2a4.8 4.8 0 002.5.7V4.9A2.9 2.9 0 0113 2h-2z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M5.5 7.5V13M5.5 5.2v.1M8.5 13V9.8a1.8 1.8 0 013.5 0V13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer__newsletter">
            <div className="footer__news-title">Restez informé</div>
            <p className="footer__news-desc">
              Recevez les nouveaux biens et l'actualité de la co-acquisition.
            </p>
            <div className="footer__news-form">
              <input
                type="email"
                className="footer__news-input"
                placeholder="Votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <button className="footer__news-btn btn-gold-shimmer" onClick={handleSubmit}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            {sent && <div className="footer__news-success">Merci, votre inscription est enregistrée.</div>}
          </div>
        </div>

        {/* ── COLONNES ── */}
        <div className="footer__cols">
          <div className="footer__col">
            <div className="footer__col-title">Plateforme</div>
            <Link to="/actifs" className="footer__link">Actifs disponibles</Link>
            <Link to="/comment-ca-marche" className="footer__link">Comment ça marche</Link>
            <Link to="/proposer-un-actif" className="footer__link">Publier un actif</Link>
          </div>

          <div className="footer__col">
            <div className="footer__col-title">Compte</div>
            <Link to="/connexion" className="footer__link">Connexion</Link>
            <Link to="/inscription" className="footer__link">Créer un compte</Link>
            <Link to="/dashboard" className="footer__link">Espace acquéreur</Link>
          </div>

          <div className="footer__col footer__col--legal">
            <div className="footer__col-title">Mentions légales</div>
            <p className="footer__legal">
              CAPEO est une plateforme de mise en relation au sens du règlement
              EU 2019/1150. CAPEO n'est pas un prestataire de services de
              financement participatif (PSFP). Aucun flux financier ne transite
              par CAPEO ; les transactions se formalisent hors plateforme entre
              les parties. Les indicateurs financiers présentés sont{' '}
              <strong>fournis par le vendeur, non vérifiés par CAPEO</strong>.
            </p>
            <div className="footer__legal-links">
              <Link to="/cgu" className="footer__link">CGU</Link>
              <Link to="/confidentialite" className="footer__link">Confidentialité</Link>
              <Link to="/mentions-legales" className="footer__link">Mentions légales</Link>
            </div>
          </div>
        </div>

        {/* ── BAS ── */}
        <div className="footer__bottom">
          <div className="footer__copyright">
            © {new Date().getFullYear()} CAPEO — Capital &amp; Opportunities. Tous droits réservés.
          </div>
          <div className="footer__badge">EU 2019/1150</div>
        </div>

      </div>
    </footer>
  )
}
