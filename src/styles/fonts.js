/* ============================================
   CAPEO — POLICES
   Auto-hébergées (paquets Fontsource, polices variables) et optimisées par next/font :
   aucun appel à Google, ni au build ni côté visiteur (RGPD).
   Inter : texte courant · Playfair Display italique : slogan · JetBrains Mono : prix.
   ============================================ */

import localFont from 'next/font/local'

export const inter = localFont({
  src: '../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
  weight: '100 900',
  style: 'normal',
  variable: '--font-inter',
  display: 'swap',
})

export const playfair = localFont({
  src: [
    {
      path: '../../node_modules/@fontsource-variable/playfair-display/files/playfair-display-latin-wght-italic.woff2',
      weight: '400 900',
      style: 'italic',
    },
    {
      path: '../../node_modules/@fontsource-variable/playfair-display/files/playfair-display-latin-wght-normal.woff2',
      weight: '400 900',
      style: 'normal',
    },
  ],
  variable: '--font-playfair',
  display: 'swap',
})

export const jetbrainsMono = localFont({
  src: '../../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2',
  weight: '100 800',
  style: 'normal',
  variable: '--font-jetbrains',
  display: 'swap',
})

export const fontVariables = [inter.variable, playfair.variable, jetbrainsMono.variable].join(' ')
