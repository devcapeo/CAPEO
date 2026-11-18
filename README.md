# CAPEO — Capital & Opportunities

Place de marché d'actifs rares : immobilier, entreprises à céder, startups, objets d'exception. Le catalogue V1 démarre en immobilier.

**Cadre (ligne rouge)** : CAPEO est une plateforme de mise en relation (règlement UE 2019/1150), pas un PSFP. Aucun fonds lié à l'acquisition d'un actif ne transite par CAPEO ; les transactions se concluent hors plateforme. La co-acquisition passe par la Business Room : mise en relation entre co-acquéreurs vérifiés, intentions d'apport non contractuelles, jamais de collecte organisée par CAPEO. Stripe sert uniquement aux annonces payantes et à la mise en avant vendeur.

**Vocabulaire** : acquisition / acquéreur / actif — jamais investissement / investisseur. Interdits partout : barre de progression financière, simulation de rendement, plus-value ou fiscalité, indice public basé sur les intentions. Tout indicateur financier porte la mention « fourni par le vendeur, non vérifié par CAPEO ».

Stack : Next.js (App Router) · Supabase · Stripe · Resend · Vercel.

## Démarrer

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de production
```

## Conventions

- **Un CSS Module par composant** : `Header.jsx` + `Header.module.css`, dans le même dossier.
- **JSX et logique séparés** : le rendu vit dans `X.jsx`, la logique (hooks, fonctions pures) dans `x.logic.js`.
- **Maximum 4 route handlers** dans `src/app/api/`, un par domaine : `annonces`, `compte`, `contact`, `admin`.
- **Charte** centralisée dans `src/styles/variables.css` : navy `#070B18`, cobalt `#1B3A6B`, or satiné `#C9A84C` ; Inter (texte), Playfair Display italique (slogan), JetBrains Mono (prix).
- Textes et navigation partagés dans `src/config/site.js`.
- Imports absolus via `@/` (→ `src/`).

## Arborescence

```
src/
  app/            routes (pages, layout, api)
  components/
    layout/       Header, Footer, MobileMenu, Logo, Providers
    ui/           Button, Card, Input, Modal, Badge, Spinner, Toast, Price
    home/         sections de la Home
  config/         site.js
  lib/            utilitaires purs (format, cx) puis clients Supabase / Stripe / Resend
  styles/         variables.css, globals.css, fonts.js
```

La page `/styleguide` (non indexée) présente le kit UI.

L'ancienne version Vite (dont les maquettes de la Business Room) est archivée sur la branche `archive/vite-coacquisition`.
