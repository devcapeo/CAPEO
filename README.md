# CAPEO — Capital & Opportunities

Place de marché d'actifs, toutes catégories confondues : immobilier, entreprises à céder, startups, objets d'exception. Le catalogue V1 démarre en immobilier.

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

## Supabase

Projet `capeo` (référence `nuqbhaufouezojhhcdwh`, région Paris `eu-west-3`), organisation du compte devcapeo.

- Schéma versionné dans `supabase/migrations/` : tables `profiles`, `assets`, `favorites`, règles d'accès (RLS) et garde-fous.
- Un vendeur ne peut ni publier, ni mettre en avant, ni valider lui-même ; une annonce publiée modifiée repasse en examen. Ces actions relèvent du back-office (clé service, côté serveur uniquement, jamais dans le code client).
- `src/config/supabase.js` contient l'URL et la clé publiable (publique par conception). Les variables `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` ont priorité si elles sont définies.
- `CATALOG_SOURCE=supabase` fait lire les annonces publiées en base ; par défaut, le catalogue d'exemple est utilisé.
- L'authentification (inscription, connexion, confirmation, mot de passe oublié) tourne dans le navigateur : aucune fonction serverless.

## Fonctions serverless (4 au maximum)

| Fonction | Rôle | État |
|---|---|---|
| `api/compte` | Vérification d'identité Stripe Identity (`?action=verification`) et webhook Stripe (`?action=stripe-webhook`) | en place |
| `api/annonces` | Annonces payantes / mise en avant (Stripe Checkout) | à venir |
| `api/contact` | Notifications e-mail de la Business Room via Resend (`?action=room-event`) | en place |
| `api/admin` | Back-office : modération, publication | à venir |

### Variables d'environnement (Vercel > Settings > Environment Variables)

| Variable | Usage | Exposée au navigateur |
|---|---|---|
| `STRIPE_SECRET_KEY` | Création des sessions Stripe Identity | non |
| `STRIPE_WEBHOOK_SECRET` | Vérification de la signature du webhook | non |
| `SUPABASE_SECRET_KEY` | Mise à jour du statut KYC par le serveur (clé secrète `sb_secret_…`) | non |
| `RESEND_API_KEY` | E-mails transactionnels (Business Room) | oui |
| `CATALOG_SOURCE` | `demo` (défaut) ou `supabase` | non |

Webhook Stripe à déclarer : `https://<domaine>/api/compte?action=stripe-webhook`, événements `identity.verification_session.*`.

## Crédits

- Carte du globe (`public/textures/world-land.png`) : générée à partir des données [Natural Earth](https://www.naturalearthdata.com/) (domaine public), via le paquet `world-atlas`.
- Principe du globe en points (masque de carte lu dans une texture) : inspiré du travail de Ksenia Kondrashova (CodePen, licence MIT), réécrit pour CAPEO.
