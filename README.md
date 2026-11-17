# CAPEO — Capital & Opportunities

Marketplace d'annonces d'actifs d'exception. **V1 : petites annonces et mise en relation uniquement** — aucun achat collectif, aucune collecte de fonds, et le prix des actifs ne transite jamais par la plateforme. Stripe sert uniquement aux annonces payantes et à la mise en avant vendeur.

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

L'ancienne version Vite (avec le volet co-acquisition prévu pour la V2) est archivée sur la branche `archive/vite-coacquisition`.
