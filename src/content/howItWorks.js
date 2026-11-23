/* ============================================
   CAPEO — CONTENUS « COMMENT ÇA MARCHE »
   Ligne rouge AMF : mise en relation uniquement. Aucune collecte, aucun fonds,
   aucune simulation de rendement, aucune commission. Vocabulaire : acquisition / acquéreur / actif.
   ============================================ */

/* Ce qui distingue CAPEO d'un site d'annonces */
export const PILLARS = [
  {
    icon: 'review',
    title: 'Vérification humaine',
    text: "Chaque profil et chaque annonce sont examinés un par un par notre équipe, pas par un algorithme. Une annonce incomplète ou peu sérieuse n'est pas publiée.",
  },
  {
    icon: 'identity',
    title: 'Identité vérifiée avant tout contact',
    text: "Impossible de contacter un vendeur ou un acquéreur sans avoir fait vérifier son identité. Les curieux restent à l'extérieur, sans paywall.",
  },
  {
    icon: 'room',
    title: 'Une relation sécurisée après la rencontre',
    text: 'Chaque actif dispose de sa Business Room : échanges tracés, documents partagés, modèles de pacte indicatifs à adapter avec vos conseils.',
  },
]

export const JOURNEYS = [
  {
    id: 'acquereur',
    label: 'Vous êtes acquéreur',
    steps: [
      {
        title: 'Créez votre compte',
        text: "Quelques informations, puis la vérification de votre identité. Elle conditionne toute prise de contact.",
      },
      {
        title: 'Explorez les actifs',
        text: 'Des annonces examinées par notre équipe. Les données financières affichées sont fournies par les vendeurs et signalées comme telles.',
      },
      {
        title: 'Entrez dans la Business Room',
        text: "Demandez l'accès à l'espace privé d'un actif : échanges avec le vendeur, documents, questions.",
      },
      {
        title: 'Seul ou à plusieurs',
        text: "Vous pouvez déclarer une intention d'apport, non contractuelle, pour vous signaler aux autres acquéreurs vérifiés. Rien n'est collecté, rien n'est engagé.",
      },
      {
        title: 'Concluez hors plateforme',
        text: 'La transaction se fait entre les parties, avec votre notaire ou votre avocat. CAPEO ne perçoit aucune commission.',
      },
    ],
  },
  {
    id: 'vendeur',
    label: 'Vous êtes vendeur',
    steps: [
      {
        title: 'Créez votre compte',
        text: "Votre identité est vérifiée, comme celle de chaque membre. C'est la garantie de n'échanger qu'avec des interlocuteurs identifiés.",
      },
      {
        title: 'Décrivez votre actif',
        text: 'Photos, description, documents. Les indicateurs financiers que vous renseignez sont affichés avec la mention « fourni par le vendeur, non vérifié par CAPEO ».',
      },
      {
        title: 'Examen par notre équipe',
        text: 'Chaque annonce est relue avant publication. Nous pouvons vous demander des précisions ou des pièces complémentaires.',
      },
      {
        title: 'Publication',
        text: 'Votre annonce est visible de tous ; seuls les membres vérifiés peuvent vous contacter. Une mise en avant payante est possible, toujours signalée comme telle.',
      },
      {
        title: 'Échangez en Business Room',
        text: 'Vous répondez aux acquéreurs vérifiés dans un espace tracé, puis concluez hors plateforme avec vos conseils.',
      },
    ],
  },
]

export const CO_ACQUISITION = {
  eyebrow: 'Co-acquisition',
  title: 'Acquérir seul, ou ensemble',
  text: "Certains actifs se prêtent à une acquisition à plusieurs. La Business Room permet à des acquéreurs vérifiés intéressés par le même actif de se rencontrer, d'échanger et d'indiquer l'apport qu'ils envisagent. C'est une mise en relation : les co-acquéreurs se structurent ensuite eux-mêmes, avec leurs propres conseils (notaire, avocat).",
  does: [
    "Met en relation des acquéreurs vérifiés autour d'un même actif",
    'Fournit un espace privé et tracé : messages, documents, intentions déclarées',
    'Met à disposition des modèles de pacte indicatifs, à adapter avec vos conseils',
  ],
  doesNot: [
    "N'organise aucune collecte et ne reçoit aucun fonds",
    'Ne fixe ni ne garantit aucun montant, aucune part, aucun calendrier',
    "Ne fournit aucun conseil ni aucune simulation de rendement ou de fiscalité",
    'Ne perçoit aucune commission sur la transaction',
  ],
  note: "Les intentions d'apport sont non contractuelles par conception : elles n'engagent ni celui qui les déclare, ni les autres membres, ni CAPEO.",
}

export const FAQ = [
  {
    question: "Qu'est-ce que CAPEO ?",
    answer:
      "Une place de marché d'actifs — immobilier, entreprises à céder, startups, objets d'exception. Ce n'est pas un mur d'annonces : c'est un cercle de confiance vérifié où des acquéreurs sérieux se rencontrent pour acquérir, seuls ou ensemble. Mise en relation pure, zéro commission.",
  },
  {
    question: 'CAPEO est-il une plateforme de financement participatif ?',
    answer:
      "Non. CAPEO est une plateforme de mise en relation au sens du règlement (UE) 2019/1150. CAPEO n'organise aucune collecte, ne reçoit aucun fonds lié à l'acquisition d'un actif et ne fournit aucun conseil. Les transactions se concluent hors plateforme, entre les parties.",
  },
  {
    question: 'Pourquoi vérifier mon identité avant de contacter quelqu’un ?',
    answer:
      "Pour que chaque échange ait lieu entre personnes identifiées. Ce contrôle filtre les demandes non sérieuses sans faire payer l'accès. La vérification est réalisée par un prestataire spécialisé ; vos pièces ne sont jamais montrées aux autres membres.",
  },
  {
    question: 'Qui vérifie les annonces, et que garantit cette vérification ?',
    answer:
      "Notre équipe examine chaque annonce avant publication : identité du vendeur, cohérence et sérieux de l'annonce. Cet examen ne vaut pas certification : les informations publiées, en particulier financières, restent sous la responsabilité du vendeur et portent la mention « fourni par le vendeur, non vérifié par CAPEO ».",
  },
  {
    question: 'Comment fonctionne la co-acquisition ?',
    answer:
      "Dans la Business Room d'un actif, des acquéreurs vérifiés peuvent se rencontrer et déclarer l'apport qu'ils envisagent, à titre indicatif et sans engagement. S'ils décident d'acquérir ensemble, ils s'organisent eux-mêmes avec leur notaire ou leur avocat. CAPEO ne collecte rien et n'intervient pas dans la structuration.",
  },
  {
    question: 'Combien coûte CAPEO ?',
    answer:
      "L'inscription et la mise en relation sont sans commission sur les transactions. Les vendeurs peuvent recourir à des options payantes — publication et mise en avant de leurs annonces — toujours signalées comme telles. Le prix d'un actif ne transite jamais par CAPEO.",
  },
  {
    question: "Quels types d'actifs trouve-t-on sur CAPEO ?",
    answer:
      "CAPEO accueille l'immobilier, les entreprises à céder, les startups et les objets rares. Le catalogue ouvre avec l'immobilier ; les autres familles suivront. Pour les entreprises et les startups, il s'agit de cessions, jamais de levées de fonds.",
  },
  {
    question: 'Où et comment se conclut la transaction ?',
    answer:
      'Hors plateforme, directement entre le vendeur et le ou les acquéreurs, accompagnés de leurs propres conseils (notaire, avocat, expert-comptable). CAPEO ne participe pas à la négociation.',
  },
]
