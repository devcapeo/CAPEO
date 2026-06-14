/* ============================================
   CAPEO — FOOTER RICHE CSS
   ============================================ */

.footer {
  background: var(--bg-surface);
  border-top: 1px solid var(--border);
  margin-top: var(--space-24);
}

/* Shimmer réutilisable (au cas où non défini ailleurs) */
.footer .btn-gold-shimmer { position: relative; overflow: hidden; }
.footer .btn-gold-shimmer::before {
  content: ''; position: absolute; top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
  transition: left 0.6s ease; pointer-events: none; z-index: 2;
}
.footer .btn-gold-shimmer:hover::before { left: 100%; }

/* ── BANDEAU CTA ── */
.footer__cta {
  border-bottom: 1px solid var(--border);
  background:
    radial-gradient(ellipse 60% 100% at 50% 0%, rgba(184,149,63,0.06), transparent 70%);
}
.footer__cta-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-10);
  padding: var(--space-16) 0;
  flex-wrap: wrap;
}
.footer__cta-eyebrow {
  font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--gold); margin-bottom: var(--space-4);
}
.footer__cta-title {
  font-family: var(--font-serif); font-size: clamp(28px, 4vw, 48px);
  font-weight: 400; line-height: 1.1; color: var(--text); letter-spacing: -0.01em;
}
.footer__cta-title em { font-style: italic; color: var(--gold); }
.footer__cta-actions { display: flex; align-items: center; gap: var(--space-4); flex-wrap: wrap; }
.footer__cta-btn {
  display: inline-flex; align-items: center; gap: var(--space-2);
  padding: 14px 28px; border-radius: var(--radius-xs);
  font-family: var(--font-sans); font-size: var(--text-sm); font-weight: 600;
  letter-spacing: 0.02em; text-decoration: none; transition: all var(--transition); white-space: nowrap;
}
.footer__cta-btn span, .footer__cta-btn svg { position: relative; z-index: 1; }
.footer__cta-btn svg { transition: transform var(--transition); }
.footer__cta-btn--primary { background: var(--gold); color: var(--bg-deep); }
.footer__cta-btn--primary:hover { background: var(--gold-light); transform: translateY(-2px); box-shadow: var(--shadow-gold); }
.footer__cta-btn--primary:hover svg { transform: translateX(4px); }
.footer__cta-btn--ghost { background: transparent; color: var(--text-muted); border: 1px solid var(--border); }
.footer__cta-btn--ghost:hover { border-color: var(--gold-border); color: var(--text); }

/* ── MAIN ── */
.footer__main { padding-top: var(--space-16); padding-bottom: var(--space-8); }

/* Haut : brand + newsletter */
.footer__top {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-16);
  padding-bottom: var(--space-12);
  border-bottom: 1px solid var(--border);
}

.footer__logo {
  font-family: var(--font-serif); font-size: 26px; font-weight: 600;
  letter-spacing: 0.18em; color: var(--text); text-decoration: none;
  display: inline-block; margin-bottom: var(--space-3);
}
.footer__logo span { color: var(--gold); }
.footer__meaning {
  font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.16em;
  text-transform: uppercase; color: var(--gold); opacity: 0.7; margin-bottom: var(--space-5);
}
.footer__tagline {
  font-size: var(--text-sm); font-weight: 400; color: var(--text-muted);
  line-height: 1.7; margin-bottom: var(--space-6);
}
.footer__social { display: flex; gap: var(--space-3); }
.footer__social-link {
  width: 40px; height: 40px; border-radius: 50%;
  border: 1px solid var(--border); display: flex; align-items: center; justify-content: center;
  color: var(--text-muted); transition: all var(--transition);
}
.footer__social-link:hover { border-color: var(--gold); color: var(--gold); transform: translateY(-2px); }

/* Newsletter */
.footer__newsletter { display: flex; flex-direction: column; }
.footer__news-title { font-family: var(--font-serif); font-size: var(--text-xl); font-weight: 400; color: var(--text); margin-bottom: var(--space-3); }
.footer__news-desc { font-size: var(--text-sm); font-weight: 400; color: var(--text-muted); line-height: 1.6; margin-bottom: var(--space-5); max-width: 360px; }
.footer__news-form { display: flex; gap: var(--space-2); max-width: 420px; }
.footer__news-input {
  flex: 1; height: 48px; padding: 0 var(--space-4);
  background: var(--bg-deep); border: 1px solid var(--border); border-radius: var(--radius-xs);
  font-family: var(--font-sans); font-size: var(--text-sm); color: var(--text);
  transition: border-color var(--transition); outline: none;
}
.footer__news-input::placeholder { color: var(--text-dim); }
.footer__news-input:focus { border-color: var(--gold-border); }
.footer__news-btn {
  width: 48px; height: 48px; border-radius: var(--radius-xs);
  background: var(--gold); color: var(--bg-deep); border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: all var(--transition);
}
.footer__news-btn svg { position: relative; z-index: 1; transition: transform var(--transition); }
.footer__news-btn:hover { background: var(--gold-light); }
.footer__news-btn:hover svg { transform: translateX(3px); }
.footer__news-success { margin-top: var(--space-3); font-size: var(--text-sm); color: var(--gold); }

/* Colonnes */
.footer__cols {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  gap: var(--space-10);
  padding: var(--space-12) 0;
  border-bottom: 1px solid var(--border);
}
.footer__col { display: flex; flex-direction: column; gap: var(--space-3); }
.footer__col-title {
  font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.16em;
  text-transform: uppercase; color: var(--gold); margin-bottom: var(--space-2);
}
.footer__link {
  font-size: var(--text-sm); font-weight: 400; color: var(--text-muted);
  text-decoration: none; transition: color var(--transition); line-height: 1.4;
}
.footer__link:hover { color: var(--text); }
.footer__col--legal { gap: var(--space-4); }
.footer__legal { font-size: var(--text-xs); font-weight: 400; color: var(--text-dim); line-height: 1.8; }
.footer__legal strong { color: var(--text-muted); font-weight: 500; }
.footer__legal-links { display: flex; gap: var(--space-5); flex-wrap: wrap; }

/* Bas */
.footer__bottom {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: var(--space-4); padding-top: var(--space-8);
}
.footer__copyright { font-size: var(--text-xs); font-weight: 400; color: var(--text-dim); letter-spacing: 0.02em; }
.footer__badge {
  font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--text-dim);
  padding: 4px 12px; border: 1px solid var(--border); border-radius: var(--radius-xs);
}

/* ── RESPONSIVE ── */
@media (max-width: 1024px) {
  .footer__cta-inner { flex-direction: column; align-items: flex-start; }
  .footer__cols { grid-template-columns: 1fr 1fr; }
  .footer__col--legal { grid-column: 1 / -1; }
}

@media (max-width: 768px) {
  .footer { margin-top: var(--space-16); }
  .footer__cta-inner { padding: var(--space-12) 0; }
  .footer__cta-actions { width: 100%; }
  .footer__cta-btn { flex: 1; justify-content: center; }
  .footer__top { grid-template-columns: 1fr; gap: var(--space-10); }
  .footer__cols { grid-template-columns: 1fr; gap: var(--space-8); }
  .footer__bottom { flex-direction: column; align-items: flex-start; }
}
