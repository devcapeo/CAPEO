/* ============================================
   CAPEO — PAGE INSCRIPTION
   Formulaire complet de création de compte.
   Corrections AMF appliquées.
   Champs : prénom, nom, entreprise, email,
   mot de passe, téléphone, pays, rôle.
   ============================================ */

   import { useState } from 'react'
   import { Link, useNavigate } from 'react-router-dom'
   import './Register.css'
   
   const PAYS = [
     'France', 'Belgique', 'Suisse', 'Luxembourg',
     'Monaco', 'Canada', 'Autre',
   ]
   
   export default function Register() {
     const navigate = useNavigate()
     const [form, setForm] = useState({
       prenom: '',
       nom: '',
       entreprise: '',
       email: '',
       password: '',
       passwordConfirm: '',
       telephone: '',
       pays: 'France',
       role: 'buyer',
       cgu: false,
     })
     const [loading, setLoading] = useState(false)
     const [error, setError] = useState('')
   
     const handleField = (key, value) => {
       setForm((prev) => ({ ...prev, [key]: value }))
       setError('')
     }
   
     const handleSubmit = () => {
       if (!form.prenom || !form.nom || !form.email || !form.password) {
         setError('Veuillez remplir tous les champs obligatoires.')
         return
       }
       if (form.password !== form.passwordConfirm) {
         setError('Les mots de passe ne correspondent pas.')
         return
       }
       if (form.password.length < 8) {
         setError('Le mot de passe doit contenir au moins 8 caractères.')
         return
       }
       if (!form.cgu) {
         setError('Veuillez accepter les conditions d\'utilisation.')
         return
       }
       setLoading(true)
       setTimeout(() => {
         setLoading(false)
         setError('Inscription Supabase à brancher.')
       }, 1000)
     }
   
     const handleGoogle = () => {
       alert('OAuth Google — Supabase à brancher')
     }
   
     return (
       <div className="register-page">
   
         <div className="register-page__inner">
   
           {/* Logo */}
           <Link to="/" className="register-logo">
             CAP<span>E</span>O
           </Link>
   
           <div className="register-card">
   
             {/* En-tête */}
             <div className="register-card__header">
               <h1 className="register-card__title">
                 Créez votre compte
               </h1>
               <p className="register-card__sub">
                 Accédez aux actifs disponibles et publiez les vôtres.
               </p>
             </div>
   
             {/* OAuth Google */}
             <button
               className="register-oauth"
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
             <div className="register-separator">
               <span>ou créez un compte avec votre email</span>
             </div>
   
             {/* Erreur */}
             {error && (
               <div className="register-error">{error}</div>
             )}
   
             {/* Rôle */}
             <div className="register-roles">
               <div
                 className={`register-role ${form.role === 'buyer' ? 'register-role--active' : ''}`}
                 onClick={() => handleField('role', 'buyer')}
               >
                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                   <circle cx="8" cy="6" r="3"
                     stroke="currentColor" strokeWidth="1"/>
                   <path d="M2 14c0-3 2.5-5 6-5s6 2 6 5"
                     stroke="currentColor" strokeWidth="1"
                     strokeLinecap="round"/>
                 </svg>
                 Acquéreur
               </div>
               <div
                 className={`register-role ${form.role === 'seller' ? 'register-role--active' : ''}`}
                 onClick={() => handleField('role', 'seller')}
               >
                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                   <rect x="2" y="4" width="12" height="9" rx="1"
                     stroke="currentColor" strokeWidth="1"/>
                   <path d="M5 4V3a3 3 0 016 0v1"
                     stroke="currentColor" strokeWidth="1"
                     strokeLinecap="round"/>
                 </svg>
                 Vendeur
               </div>
               <div
                 className={`register-role ${form.role === 'both' ? 'register-role--active' : ''}`}
                 onClick={() => handleField('role', 'both')}
               >
                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                   <path d="M2 8h12M8 2l6 6-6 6"
                     stroke="currentColor" strokeWidth="1"
                     strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
                 Les deux
               </div>
             </div>
   
             {/* Formulaire */}
             <div className="register-form">
   
               {/* Prénom + Nom */}
               <div className="register-form__row">
                 <div className="register-field">
                   <label className="register-label">
                     Prénom <span className="register-required">*</span>
                   </label>
                   <input
                     type="text"
                     className="register-input"
                     placeholder="Jean"
                     value={form.prenom}
                     onChange={(e) => handleField('prenom', e.target.value)}
                   />
                 </div>
                 <div className="register-field">
                   <label className="register-label">
                     Nom <span className="register-required">*</span>
                   </label>
                   <input
                     type="text"
                     className="register-input"
                     placeholder="Dupont"
                     value={form.nom}
                     onChange={(e) => handleField('nom', e.target.value)}
                   />
                 </div>
               </div>
   
               {/* Entreprise */}
               <div className="register-field">
                 <label className="register-label">
                   Entreprise
                   <span className="register-optional"> — facultatif</span>
                 </label>
                 <input
                   type="text"
                   className="register-input"
                   placeholder="Nom de votre société"
                   value={form.entreprise}
                   onChange={(e) => handleField('entreprise', e.target.value)}
                 />
               </div>
   
               {/* Email */}
               <div className="register-field">
                 <label className="register-label">
                   Email <span className="register-required">*</span>
                 </label>
                 <input
                   type="email"
                   className="register-input"
                   placeholder="exemple@email.com"
                   value={form.email}
                   onChange={(e) => handleField('email', e.target.value)}
                 />
               </div>
   
               {/* Mot de passe */}
               <div className="register-form__row">
                 <div className="register-field">
                   <label className="register-label">
                     Mot de passe <span className="register-required">*</span>
                     <span className="register-hint"> · 8 min</span>
                   </label>
                   <input
                     type="password"
                     className="register-input"
                     placeholder="••••••••"
                     value={form.password}
                     onChange={(e) => handleField('password', e.target.value)}
                   />
                 </div>
                 <div className="register-field">
                   <label className="register-label">
                     Confirmer <span className="register-required">*</span>
                   </label>
                   <input
                     type="password"
                     className="register-input"
                     placeholder="••••••••"
                     value={form.passwordConfirm}
                     onChange={(e) => handleField('passwordConfirm', e.target.value)}
                   />
                 </div>
               </div>
   
               {/* Téléphone + Pays */}
               <div className="register-form__row">
                 <div className="register-field">
                   <label className="register-label">Téléphone</label>
                   <input
                     type="tel"
                     className="register-input"
                     placeholder="+33 6 12 34 56 78"
                     value={form.telephone}
                     onChange={(e) => handleField('telephone', e.target.value)}
                   />
                 </div>
                 <div className="register-field">
                   <label className="register-label">Pays</label>
                   <select
                     className="register-select"
                     value={form.pays}
                     onChange={(e) => handleField('pays', e.target.value)}
                   >
                     {PAYS.map((p) => (
                       <option key={p} value={p}>{p}</option>
                     ))}
                   </select>
                 </div>
               </div>
   
               {/* CGU */}
               <label className="register-checkbox">
                 <input
                   type="checkbox"
                   checked={form.cgu}
                   onChange={(e) => handleField('cgu', e.target.checked)}
                 />
                 <span className="register-checkbox__box"></span>
                 <span className="register-checkbox__label">
                   J'accepte les
                   <Link to="/cgu" className="register-link"> CGU </Link>
                   et la
                   <Link to="/confidentialite" className="register-link"> politique de confidentialité</Link>
                 </span>
               </label>
   
               {/* Bouton */}
               <button
                 className="register-btn"
                 onClick={handleSubmit}
                 disabled={loading}
               >
                 {loading
                   ? <span className="spinner"></span>
                   : 'Créer mon compte'
                 }
               </button>
   
             </div>
   
             {/* Footer */}
             <div className="register-card__footer">
               Déjà un compte ?
               <Link to="/connexion" className="register-link">
                 Se connecter
               </Link>
             </div>
   
           </div>
   
         </div>
       </div>
     )
   }