import { MENTIONS_LEGALES } from '@/content/legal/mentionsLegales'
import LegalDocument from '@/components/legal/LegalDocument/LegalDocument'

/* Non indexée tant que le document n'est pas finalisé (mentions « À compléter »). */
export const metadata = {
  title: MENTIONS_LEGALES.title,
  alternates: { canonical: '/mentions-legales' },
  robots: { index: false, follow: true },
}

export default function MentionsLegalesPage() {
  return <LegalDocument document={MENTIONS_LEGALES} currentHref="/mentions-legales" />
}
