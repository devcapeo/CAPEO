import { CONFIDENTIALITE } from '@/content/legal/confidentialite'
import LegalDocument from '@/components/legal/LegalDocument/LegalDocument'

/* Non indexée tant que le document n'est pas finalisé (mentions « À compléter »). */
export const metadata = {
  title: CONFIDENTIALITE.title,
  alternates: { canonical: '/confidentialite' },
  robots: { index: false, follow: true },
}

export default function ConfidentialitePage() {
  return <LegalDocument document={CONFIDENTIALITE} currentHref="/confidentialite" />
}
