/* ============================================
   Modèles d'e-mails de la Business Room.
   Règle de confidentialité : aucun contenu d'échange ni document n'est recopié dans un e-mail,
   seulement un lien vers l'espace sécurisé.
   ============================================ */

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])

function layout({ title, lines, cta, url }) {
  const paragraphs = lines
    .map((line) => `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#C8CEDC">${escapeHtml(line)}</p>`)
    .join('')

  const html = `<!doctype html><html lang="fr"><body style="margin:0;background:#070B18;font-family:Inter,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#070B18;padding:32px 16px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#0D1428;border:1px solid #1B3A6B;border-radius:14px;padding:32px">
<tr><td>
<p style="margin:0 0 24px;font-size:20px;letter-spacing:6px;color:#F2F4F8">CAP<span style="color:#C9A84C;font-style:italic">E</span>O</p>
<h1 style="margin:0 0 18px;font-size:20px;font-weight:600;color:#F2F4F8">${escapeHtml(title)}</h1>
${paragraphs}
<p style="margin:26px 0"><a href="${escapeHtml(url)}" style="display:inline-block;background:#C9A84C;color:#070B18;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:999px">${escapeHtml(cta)}</a></p>
<p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#7C859B">CAPEO est une plateforme de mise en relation. Aucun fonds ne transite par CAPEO ; les transactions se concluent hors plateforme, avec vos conseils.</p>
</td></tr></table></td></tr></table></body></html>`

  const text = [title, '', ...lines, '', `${cta} : ${url}`, '', 'CAPEO — plateforme de mise en relation. Aucun fonds ne transite par CAPEO.'].join('\n')
  return { html, text }
}

export function accessRequestedEmail({ assetTitle, requesterName, url }) {
  return {
    subject: `Nouvelle demande d'accès — ${assetTitle}`,
    ...layout({
      title: "Un acquéreur vérifié souhaite échanger avec vous",
      lines: [
        `${requesterName} demande à rejoindre la Business Room de votre annonce « ${assetTitle} ».`,
        "Son identité a été vérifiée. Vous pouvez lire son message de présentation, puis l'admettre ou décliner.",
      ],
      cta: 'Répondre à la demande',
      url,
    }),
  }
}

export function accessDecidedEmail({ assetTitle, accepted, url }) {
  return {
    subject: accepted ? `Accès accordé — ${assetTitle}` : `Demande déclinée — ${assetTitle}`,
    ...layout({
      title: accepted ? 'Vous avez rejoint la Business Room' : "Le vendeur n'a pas donné suite",
      lines: accepted
        ? [`Le vendeur vous a admis dans la Business Room de « ${assetTitle} ».`, 'Vous pouvez désormais échanger, consulter les documents partagés et indiquer votre intention.']
        : [`Le vendeur a décliné votre demande pour « ${assetTitle} ».`, "D'autres actifs vous attendent dans le catalogue CAPEO."],
      cta: accepted ? 'Ouvrir la Business Room' : 'Voir les actifs',
      url,
    }),
  }
}

export function roomActivityEmail({ assetTitle, kind, url }) {
  const isDocument = kind === 'document'
  return {
    subject: `${isDocument ? 'Nouveau document' : 'Nouveau message'} — ${assetTitle}`,
    ...layout({
      title: isDocument ? 'Un document a été partagé' : 'Vous avez un nouveau message',
      lines: [
        `Il y a du nouveau dans la Business Room de « ${assetTitle} ».`,
        'Par confidentialité, le contenu reste dans votre espace sécurisé.',
      ],
      cta: 'Ouvrir la Business Room',
      url,
    }),
  }
}
