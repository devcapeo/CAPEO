import { CGU } from '@/content/legal/cgu'
import LegalDocument from '@/components/legal/LegalDocument/LegalDocument'

/* Non indexée tant que le document n'est pas finalisé (mentions « À compléter »). */
export const metadata = {
  title: CGU.title,
  alternates: { canonical: '/cgu' },
  robots: { index: false, follow: true },
}

export default function CguPage() {
  return <LegalDocument document={CGU} currentHref="/cgu" />
}
