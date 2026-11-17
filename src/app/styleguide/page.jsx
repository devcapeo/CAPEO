import Badge from '@/components/ui/Badge/Badge'
import Button from '@/components/ui/Button/Button'
import Card from '@/components/ui/Card/Card'
import Input from '@/components/ui/Input/Input'
import Price from '@/components/ui/Price/Price'
import Spinner from '@/components/ui/Spinner/Spinner'
import StyleguideDemo from '@/components/styleguide/StyleguideDemo/StyleguideDemo'
import styles from './styleguide.module.css'

/* Page interne de recette du kit UI. Non indexée. */
export const metadata = {
  title: 'Kit UI',
  robots: { index: false, follow: false },
}

const SWATCHES = [
  { name: 'Navy profond', value: '#070B18', token: '--navy-950' },
  { name: 'Cobalt', value: '#1B3A6B', token: '--cobalt' },
  { name: 'Or satiné', value: '#C9A84C', token: '--gold' },
]

export default function StyleguidePage() {
  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.intro}>
        <Badge tone="gold" dot>Interne</Badge>
        <h1 className={styles.title}>Kit UI <em>CAPEO</em></h1>
        <p className={styles.muted}>Recette visuelle des composants de base de la refonte.</p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Couleurs</h2>
        <div className={styles.grid3}>
          {SWATCHES.map((swatch) => (
            <Card key={swatch.token} padding="none">
              <div className={styles.swatch} style={{ background: swatch.value }} />
              <div className={styles.swatchMeta}>
                <strong>{swatch.name}</strong>
                <code>{swatch.value} · {swatch.token}</code>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Typographie</h2>
        <Card>
          <p className={styles.serif}>Acquérir <em>l&apos;exception.</em></p>
          <p>Inter — texte courant de la plateforme, lisible et neutre.</p>
          <Price amount={4850000} size="lg" />
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Boutons</h2>
        <div className={styles.row}>
          <Button>Action principale</Button>
          <Button variant="glass">Secondaire</Button>
          <Button variant="ghost">Tertiaire</Button>
          <Button size="sm">Petit</Button>
          <Button loading>Envoi</Button>
          <Button disabled>Désactivé</Button>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Badges et chargement</h2>
        <div className={styles.row}>
          <Badge tone="gold">Vendeur vérifié</Badge>
          <Badge tone="cobalt">Immeuble de rapport</Badge>
          <Badge>Neutre</Badge>
          <Badge tone="success" dot>Publiée</Badge>
          <Badge tone="danger" dot>Refusée</Badge>
          <Spinner size="sm" />
          <Spinner />
          <Spinner size="lg" />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Cartes</h2>
        <div className={styles.grid3}>
          <Card><p className={styles.muted}>Carte standard</p></Card>
          <Card interactive><p className={styles.muted}>Carte interactive (survol)</p></Card>
          <Card accent><p className={styles.muted}>Carte avec liseré or</p></Card>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Formulaires</h2>
        <Card className={styles.form}>
          <Input label="Adresse email" type="email" placeholder="vous@exemple.com" hint="Nous ne la partageons jamais." />
          <Input label="Prix demandé" placeholder="2 450 000" error="Indiquez un montant valide." />
          <Input label="Description" multiline placeholder="Décrivez l'actif…" />
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Modale et notifications</h2>
        <StyleguideDemo />
      </section>
    </div>
  )
}
