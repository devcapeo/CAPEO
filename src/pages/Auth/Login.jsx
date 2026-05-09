/* ============================================
   CAPEO — PAGE CONNEXION
   Modale overlay avec backdrop blur.
   OAuth Google + email/mot de passe.
   Corrections AMF : "actifs" pas "investissements"
   ============================================ */

   import { useState } from 'react'
   import { Link, useNavigate } from 'react-router-dom'
   import './Login.css'
   
   export default function Login() {
     const [form, setForm] = useState({ email: '', password: '' })
     const [loading, setLoading] = useState(false)
     const [error, setError] = useState('')
     const navigate = useNavigate()
   
     const handleField = (key, value) => {
       setForm((prev) => ({ ...prev, [key]: value }))
       setError('')
     }
   
     const handleSubmit = () => {
       if (!form.email || !form.password) {
         setError('Veuillez remplir tous les champs.')
         return
       }
       setLoading(true)
       setTimeout(() => {
         setLoading(false)
         setError('Connexion Supabase à brancher.')
       }, 1000)
     }
   
     const handleGoogle = () => {
       // Supabase OAuth Google à brancher
       alert('OAuth Google — Supabase à brancher')
     }
   
     return (
       <div className="login-overlay">
   
         {/* Fond flou cliquable pour fermer */}
         <div
           className="login-overlay__backdrop"
           onClick={() => navigate(-1)}
         ></div>
   
         {/* Modale */}
         <div className="login-modal">
   
           {/* Colonne gauche — branding */}
           <div className="login-modal__left">
             <div className="login-modal__brand">
               <div className="login-modal__logo">
                 CAP<span>E</span>O
               </div>
               <div className="login-modal__tagline">
                 Les actifs d'exception,<br/>
                 <em>enfin accessibles.</em>
               </div>
             </div>
             <div className="login-modal__left-footer">
               Capital &amp; Opportunities
             </div>
           </div>
   
           {/* Colonne droite — formulaire */}
           <div className="login-modal__right">
   
             {/* Bouton fermer */}
             <button
               className="login-modal__close"
               onClick={() => navigate(-1)}
             >
               <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                 <path d="M2 2l10 10M12 2L2 12"
                   stroke="currentColor" strokeWidth="1.5"
                   strokeLinecap="round"/>
               </svg>
             </button>
   
             <div className="login-modal__header">
               <h1 className="login-modal__title">Bonjour !</h1>
               <p className="login-modal__sub">
                 Bienvenue sur CAPEO, ravi de vous voir.
               </p>
             </div>
   
             {/* OAuth Google */}
             <button
               className="login-oauth login-oauth--google"
               onClick={handleGoogle}
             >
               <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                 <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                 <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                 <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                 <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
               </svg>
               Continuer avec Google
             </button>
   
             {/* Séparateur */}
             <div className="login-separator">
               <span>ou</span>
             </div>
   
             {/* Erreur */}
             {error && (
               <div className="login-error">{error}</div>
             )}
   
             {/* Formulaire */}
             <div className="login-form">
               <div className="login-field">
                 <label className="login-label">Email</label>
                 <input
                   type="email"
                   className="login-input"
                   placeholder="votre@email.com"
                   value={form.email}
                   onChange={(e) => handleField('email', e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                 />
               </div>
   
               <div className="login-field">
                 <div className="login-label-row">
                   <label className="login-label">Mot de passe</label>
                   <Link to="/mot-de-passe-oublie" className="login-forgot">
                     Oublié ?
                   </Link>
                 </div>
                 <input
                   type="password"
                   className="login-input"
                   placeholder="••••••••"
                   value={form.password}
                   onChange={(e) => handleField('password', e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                 />
               </div>
   
               <button
                 className="login-btn"
                 onClick={handleSubmit}
                 disabled={loading}
               >
                 {loading ? <span className="spinner"></span> : 'Se connecter'}
               </button>
             </div>
   
             <div className="login-footer">
               Pas encore de compte ?
               <Link to="/inscription" className="login-link">
                 Créer un compte
               </Link>
             </div>
   
             <p className="login-disclaimer">
               En continuant, vous acceptez nos
               <Link to="/cgu"> CGU</Link> et notre
               <Link to="/confidentialite"> politique de confidentialité</Link>.
             </p>
   
           </div>
         </div>
       </div>
     )
   }