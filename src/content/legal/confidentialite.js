/* Projet de politique de confidentialité — à faire valider (conseil juridique / DPO) avant mise en production. */
export const CONFIDENTIALITE = {
  title: 'Politique de confidentialité',
  updated: '[À compléter : date de mise en ligne]',
  sections: [
    {
      title: 'Responsable du traitement',
      paragraphs: [
        '[À compléter : raison sociale et adresse de l’éditeur], joignable à [À compléter : adresse e-mail dédiée aux données personnelles].',
      ],
    },
    {
      title: 'Données collectées',
      list: [
        'Compte : nom, prénom, adresse e-mail, téléphone, type de profil (vendeur, acquéreur).',
        "Vérification d'identité : pièce d'identité et contrôle de présence, traités par notre prestataire spécialisé. CAPEO conserve le résultat de la vérification, pas les images des pièces.",
        'Annonces : descriptions, photographies, documents et indicateurs fournis par le vendeur.',
        "Business Room : messages, documents partagés et intentions d'apport déclarées.",
        'Paiements des options payantes : traités par Stripe. CAPEO ne conserve aucune donnée de carte bancaire.',
        'Données techniques : journaux de connexion et de sécurité.',
        "Mesure d'audience : pages consultées, temps passé, défilement, clics, type d'appareil, navigateur, pays et ville approximatifs. Aucune adresse IP n'est conservée ; un identifiant aléatoire est stocké dans votre navigateur (renouvelé tous les 13 mois). Lorsque vous êtes connecté, ces informations sont rattachées à votre compte.",
      ],
    },
    {
      title: 'Finalités et bases légales',
      list: [
        "Créer et gérer votre compte, fournir le service de mise en relation : exécution du contrat.",
        "Vérifier l'identité des membres avant tout contact : intérêt légitime (sécurité et confiance du cercle).",
        'Examiner les profils et les annonces, prévenir la fraude : intérêt légitime.',
        'Facturer les options payantes et tenir la comptabilité : obligation légale.',
        "Mesurer et améliorer la fréquentation et l'ergonomie du site : intérêt légitime. Vous pouvez vous y opposer à tout moment (réglage en bas de cette page).",
        "Vous envoyer des e-mails de service (notifications, sécurité) : exécution du contrat. Toute communication commerciale requiert votre consentement.",
      ],
    },
    {
      title: 'Durées de conservation',
      list: [
        'Compte et Business Room : pendant toute la durée du compte, puis [À compléter] ans à titre probatoire.',
        "Résultat de la vérification d'identité : pendant toute la durée du compte, puis [À compléter].",
        'Pièces comptables : dix ans.',
        'Journaux techniques : douze mois maximum.',
        "Mesure d'audience : vingt-cinq mois maximum.",
      ],
    },
    {
      title: 'Destinataires et sous-traitants',
      paragraphs: [
        "Vos données ne sont jamais vendues. Elles sont accessibles à l'équipe CAPEO habilitée et à nos sous-traitants : Supabase (base de données et authentification), Vercel (hébergement), Stripe (paiements), Resend (e-mails transactionnels), [À compléter : prestataire de vérification d'identité].",
        "Les autres membres ne voient que les informations que vous publiez ou partagez dans une Business Room. Vos pièces d'identité ne sont jamais visibles des autres membres.",
      ],
    },
    {
      title: "Transferts hors de l'Union européenne",
      paragraphs: [
        "Certains sous-traitants sont établis aux États-Unis. Les transferts sont encadrés par le cadre de protection des données UE–États-Unis ou par les clauses contractuelles types de la Commission européenne.",
      ],
    },
    {
      title: 'Vos droits',
      paragraphs: [
        "Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité, ainsi que du droit de définir des directives relatives au sort de vos données après votre décès. Pour les exercer : [À compléter : adresse e-mail]. Vous pouvez introduire une réclamation auprès de la CNIL (cnil.fr).",
      ],
    },
    {
      title: 'Cookies',
      paragraphs: [
        "CAPEO n'utilise que les cookies strictement nécessaires au fonctionnement du service (session, authentification, sécurité). Aucun traceur publicitaire n'est déposé. La mesure d'audience est réalisée par CAPEO elle-même (identifiant aléatoire stocké dans votre navigateur, sans adresse IP ni transmission à un tiers) ; vous pouvez la refuser grâce au réglage en bas de cette page. Le signal « Global Privacy Control » de votre navigateur est respecté.",
      ],
    },
  ],
}
