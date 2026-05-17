/* ============================================
   CAPEO — FOOTER V3
   Disclaimer AMF directement visible
   dans la colonne mentions légales.
   ============================================ */

import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">

        {/* ── TOP ── */}
        <div className="footer__top">

          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              CAP<span>E</span>O
            </div>
            <div className="footer__meaning">
              Capital &amp; Opportunities
            </div>
            <p className="footer__tagline">
              Place de marché d'actifs premium.<br/>
              Co-acquisition entre acquéreurs qualifiés.
            </p>
          </div>

          {/* Plateforme */}
          <div className="footer__col">
            <div className="footer__col-title">Plateforme</div>
            <Link to="/actifs" className="footer__link">Actifs disponibles</Link>
            <Link to="/off-market" className="footer__link">Off-Market</Link>
            <Link to="/comment-ca-marche" className="footer__link">Comment ça marche</Link>
            <Link to="/proposer-un-actif" className="footer__link">Publier un actif</Link>
          </div>

          {/* Compte */}
          <div className="footer__col">
            <div className="footer__col-title">Compte</div>
            <Link to="/connexion" className="footer__link">Connexion</Link>
            <Link to="/inscription" className="footer__link">Créer un compte</Link>
            <Link to="/dashboard" className="footer__link">Espace acquéreur</Link>
          </div>

          {/* Mentions légales — colonne avec disclaimer intégré */}
          <div className="footer__col footer__col--legal">
            <div className="footer__col-title">Mentions légales</div>
            <p className="footer__legal-text">
              CAPEO est une plateforme de mise en relation au sens du
              règlement EU 2019/1150. CAPEO n'est pas un prestataire de
              services de financement participatif (PSFP). Aucun flux
              financier ne transite par CAPEO ; les transactions se
              formalisent hors plateforme entre les parties. Les
              indicateurs financiers présentés sont{' '}
              <strong>fournis par le vendeur, non vérifiés par CAPEO</strong>.
            </p>
            <div className="footer__legal-links">
              <Link to="/cgu" className="footer__link">CGU</Link>
              <Link to="/confidentialite" className="footer__link">Confidentialité</Link>
              <Link to="/mentions-legales" className="footer__link">Mentions légales</Link>
            </div>
          </div>

        </div>

        {/* ── BOTTOM ── */}
        <div className="footer__bottom">
          <div className="footer__copyright">
            © {new Date().getFullYear()} CAPEO — Capital &amp; Opportunities.
            Tous droits réservés.
          </div>
          <div className="footer__bottom-right">
            <span className="footer__eu-badge">EU 2019/1150</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
