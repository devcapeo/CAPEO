/*
 * Projet de conditions générales d'utilisation — à faire valider par un conseil juridique
 * avant mise en production. Ligne rouge : mise en relation uniquement (règlement UE 2019/1150).
 */
export const CGU = {
  title: "Conditions générales d'utilisation",
  updated: '[À compléter : date de mise en ligne]',
  sections: [
    {
      title: 'Objet',
      paragraphs: [
        "Les présentes conditions régissent l'accès et l'utilisation de la plateforme CAPEO, place de marché d'actifs rares (immobilier, entreprises à céder, startups, objets rares). La création d'un compte vaut acceptation des présentes conditions.",
      ],
    },
    {
      title: 'Définitions',
      list: [
        'Membre : toute personne titulaire d’un compte dont l’identité a été vérifiée.',
        'Vendeur : membre qui publie une annonce relative à un actif dont il peut disposer.',
        "Acquéreur : membre qui envisage l'acquisition d'un actif, seul ou avec d'autres acquéreurs.",
        "Business Room : espace privé associé à un actif, réunissant le vendeur et les acquéreurs qu'il a admis.",
        "Intention d'apport : indication, purement déclarative et non contractuelle, du montant qu'un acquéreur envisage d'apporter en vue d'une éventuelle co-acquisition.",
      ],
    },
    {
      title: 'Rôle de CAPEO',
      paragraphs: [
        "CAPEO fournit un service de mise en relation au sens du règlement (UE) 2019/1150. CAPEO n'est pas partie aux transactions, ne participe pas à leur négociation et ne perçoit aucune commission sur celles-ci.",
        "CAPEO n'est pas prestataire de services de financement participatif : elle n'organise aucune collecte, ne reçoit, ne détient et ne transmet aucun fonds lié à l'acquisition d'un actif, et ne fournit aucun conseil financier, juridique ou fiscal. Les transactions se concluent hors plateforme, entre les parties et leurs propres conseils.",
      ],
    },
    {
      title: 'Inscription et vérification d’identité',
      paragraphs: [
        "La vérification d'identité est obligatoire avant toute prise de contact avec un autre membre. Elle est réalisée par un prestataire spécialisé [À compléter : nom du prestataire]. CAPEO peut refuser ou suspendre un compte dont l'identité ne peut être vérifiée.",
        'Chaque profil est examiné par un membre de notre équipe. Cet examen porte sur l’identité et le sérieux du profil ; il ne constitue pas une garantie de solvabilité.',
      ],
    },
    {
      title: 'Annonces',
      paragraphs: [
        "Le vendeur est seul responsable du contenu de ses annonces, de leur exactitude et des droits nécessaires à leur publication. Chaque annonce est relue par notre équipe avant publication ; cet examen ne vaut pas certification. Les indicateurs financiers sont affichés avec la mention « fourni par le vendeur, non vérifié par CAPEO ».",
        "Sont notamment interdits : toute offre de titres financiers au public, toute levée de fonds, toute promesse ou simulation de rendement, de plus-value ou d'avantage fiscal, ainsi que tout contenu illicite ou trompeur. Pour les entreprises et startups, seules les cessions sont admises.",
      ],
    },
    {
      title: 'Business Room et co-acquisition',
      paragraphs: [
        "L'accès à une Business Room est accordé par le vendeur. Les échanges et documents qui y sont déposés sont tracés et conservés pour la durée prévue par notre politique de confidentialité. Les documents partagés sont confidentiels et ne peuvent être diffusés hors de la Business Room.",
        "Les intentions d'apport sont non contractuelles par conception : elles n'engagent ni leur auteur, ni les autres membres, ni CAPEO, et ne donnent lieu à aucun versement. Elles ne sont visibles que des membres de la Business Room concernée. Les acquéreurs qui décident d'acquérir ensemble se structurent eux-mêmes, avec leurs propres conseils.",
        'Les modèles de pacte mis à disposition sont des documents indicatifs fournis en l’état ; ils ne constituent pas un conseil juridique et doivent être adaptés avec un avocat ou un notaire.',
      ],
    },
    {
      title: 'Classement et référencement des annonces',
      paragraphs: [
        "Par défaut, les annonces sont classées par date de publication, de la plus récente à la plus ancienne. Les filtres choisis par l'utilisateur (famille d'actif, localisation, fourchette de prix) restreignent les résultats sans modifier cet ordre.",
        "Les annonces mises en avant contre rémunération sont affichées en tête de liste et portent la mention « Mise en avant ». Aucun autre paramètre, ni aucune rémunération, n'influence le classement.",
      ],
    },
    {
      title: 'Services payants',
      paragraphs: [
        "L'inscription et la mise en relation sont sans commission sur les transactions. Les vendeurs peuvent souscrire des options payantes (publication d'annonces, mise en avant) dont le prix est affiché avant toute souscription. Les paiements sont traités par Stripe ; CAPEO ne conserve aucune donnée de carte bancaire.",
        "[À compléter : modalités de rétractation applicables aux vendeurs consommateurs et conditions de remboursement.]",
      ],
    },
    {
      title: 'Obligations des membres',
      list: [
        'Fournir des informations exactes et les tenir à jour.',
        'Respecter la confidentialité des échanges et des documents de la Business Room.',
        'Ne pas utiliser la plateforme pour du démarchage, de la sollicitation de fonds ou toute activité étrangère à l’acquisition d’actifs.',
        'Ne pas usurper l’identité d’un tiers ni contourner la vérification d’identité.',
      ],
    },
    {
      title: 'Modération, suspension et réclamations',
      paragraphs: [
        "CAPEO peut retirer une annonce ou suspendre un compte qui ne respecte pas les présentes conditions. Toute décision est motivée et notifiée au membre concerné, qui peut la contester auprès de [À compléter : adresse de réclamation]. Les réclamations sont traitées par notre équipe dans un délai de [À compléter] jours.",
        'Médiation de la consommation : [À compléter : médiateur désigné et ses coordonnées].',
      ],
    },
    {
      title: 'Responsabilité',
      paragraphs: [
        "CAPEO met en œuvre les moyens raisonnables pour assurer le bon fonctionnement de la plateforme et le sérieux des profils et des annonces. CAPEO n'étant pas partie aux transactions, elle ne saurait être tenue responsable de leur réalisation, de leurs conditions ni de leurs conséquences.",
      ],
    },
    {
      title: 'Modification des conditions',
      paragraphs: [
        'Toute modification des présentes conditions est notifiée aux membres au moins quinze jours avant son entrée en vigueur. Le membre qui n’accepte pas les nouvelles conditions peut clôturer son compte à tout moment.',
      ],
    },
    {
      title: 'Droit applicable',
      paragraphs: [
        'Les présentes conditions sont soumises au droit français. [À compléter : juridiction compétente pour les membres professionnels.]',
      ],
    },
  ],
}
