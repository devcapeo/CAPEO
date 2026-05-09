/* ============================================
   CAPEO — POINT D'ENTRÉE REACT
   C'est ici que React démarre.
   On importe les styles globaux une seule fois.
   Ne pas modifier sauf cas exceptionnel.
   ============================================ */

   import { StrictMode } from 'react'
   import { createRoot } from 'react-dom/client'
   
   // Styles globaux — importés une seule fois ici
   import './styles/variables.css'
   import './styles/globals.css'
   import './styles/animations.css'
   
   // Composant racine
   import App from './App.jsx'
   
   createRoot(document.getElementById('root')).render(
     <StrictMode>
       <App />
     </StrictMode>
   )