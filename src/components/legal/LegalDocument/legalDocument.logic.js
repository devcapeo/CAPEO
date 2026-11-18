/* Découpe un texte en segments, en isolant les mentions « [À compléter …] » à surligner. Fonction pure. */
export function splitPlaceholders(text) {
  return text
    .split(/(\[À compléter[^\]]*\])/g)
    .filter(Boolean)
    .map((segment) => ({ text: segment, placeholder: segment.startsWith('[À compléter') }))
}

/* Identifiant d'ancre stable à partir d'un titre de section. */
export function slugify(title) {
  return title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
