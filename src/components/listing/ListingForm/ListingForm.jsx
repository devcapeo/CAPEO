'use client'

import { ASSET_FAMILIES } from '@/config/site'
import { FIGURE_UNITS, FRENCH_REGIONS, LIMITS } from '@/lib/assets/listingForm'
import { getFamily } from '@/lib/assets/labels'
import Button from '@/components/ui/Button/Button'
import Card from '@/components/ui/Card/Card'
import Checkbox from '@/components/ui/Checkbox/Checkbox'
import Input from '@/components/ui/Input/Input'
import Select from '@/components/ui/Select/Select'
import FormStatus from '@/components/auth/FormStatus/FormStatus'
import SellerDataNotice from '@/components/assets/SellerDataNotice/SellerDataNotice'
import { useListingForm } from './listingForm.logic'
import styles from './ListingForm.module.css'

const FAMILY_OPTIONS = ASSET_FAMILIES.map((family) => ({
  value: family.slug,
  label: family.available ? family.label : `${family.label} (bientôt)`,
  disabled: !family.available,
}))

const REGION_OPTIONS = FRENCH_REGIONS.map((region) => ({ value: region, label: region }))

/* Formulaire de dépôt d'annonce. Toutes les valeurs saisies sont des données du vendeur. */
export default function ListingForm() {
  const { values, errors, pending, serverError, bind, setFigure, addFigure, removeFigure, save } = useListingForm()
  const typeOptions = (getFamily(values.family)?.types ?? []).map((type) => ({ value: type.slug, label: type.label }))

  return (
    <form className={styles.form} onSubmit={(event) => event.preventDefault()} noValidate>
      {errors.vocabulary && <FormStatus tone="error">{errors.vocabulary}</FormStatus>}
      {serverError && <FormStatus tone="error">{serverError}</FormStatus>}

      <Card padding="lg" className={styles.section}>
        <h2 className={styles.sectionTitle}>L&apos;actif</h2>
        <div className={styles.row}>
          <Select label="Famille" options={FAMILY_OPTIONS} {...bind('family')} />
          <Select label="Type" placeholder="Choisir…" options={typeOptions} {...bind('type')} />
        </div>
        <Input label="Titre de l'annonce" maxLength={LIMITS.title} placeholder="Ex. : Immeuble haussmannien de 14 lots" {...bind('title')} />
        <Input
          label="Résumé"
          multiline
          maxLength={LIMITS.summary}
          hint={`Une ou deux phrases, ${LIMITS.summary} caractères au maximum.`}
          {...bind('summary')}
        />
      </Card>

      <Card padding="lg" className={styles.section}>
        <h2 className={styles.sectionTitle}>Localisation et prix</h2>
        <div className={styles.row}>
          <Input label="Ville ou secteur" placeholder="Ex. : Lyon 6e" {...bind('city')} />
          <Select label="Région" placeholder="Choisir…" options={REGION_OPTIONS} {...bind('region')} />
        </div>
        <div className={styles.priceRow}>
          <Input
            label="Prix demandé (€)"
            inputMode="numeric"
            placeholder="Ex. : 2 450 000"
            disabled={values.priceOnRequest}
            {...bind('price')}
          />
          <Checkbox label="Prix sur demande" {...bind('priceOnRequest')} />
        </div>
        <SellerDataNotice />
      </Card>

      <Card padding="lg" className={styles.section}>
        <h2 className={styles.sectionTitle}>Description</h2>
        <Input
          label="Description"
          multiline
          rows={7}
          hint="Séparez les paragraphes par une ligne vide."
          {...bind('description')}
        />
        <div className={styles.row}>
          <Input label="Points forts" multiline rows={4} hint="Un point par ligne." {...bind('highlights')} />
          <Input
            label="Documents disponibles"
            multiline
            rows={4}
            hint="Un document par ligne. Ils seront partagés en Business Room."
            {...bind('documents')}
          />
        </div>
      </Card>

      <Card padding="lg" className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Chiffres clés</h2>
          <SellerDataNotice />
        </div>
        <p className={styles.help}>
          Surfaces, nombre de lots, loyers ou chiffre d&apos;affaires déclarés… Chaque chiffre sera affiché avec la
          mention « fourni par le vendeur, non vérifié par CAPEO ». N&apos;indiquez ni rendement, ni plus-value, ni
          avantage fiscal.
        </p>

        <div className={styles.figures}>
          {values.figures.map((figure, index) => (
            <div key={index} className={styles.figure}>
              <Input
                label="Libellé"
                placeholder="Ex. : Surface habitable"
                value={figure.label}
                onChange={(event) => setFigure(index, 'label', event.target.value)}
              />
              <Input
                label="Valeur"
                placeholder="Ex. : 420"
                value={figure.value}
                onChange={(event) => setFigure(index, 'value', event.target.value)}
              />
              <Select
                label="Unité"
                options={FIGURE_UNITS}
                value={figure.unit}
                onChange={(event) => setFigure(index, 'unit', event.target.value)}
              />
              <button type="button" className={styles.remove} onClick={() => removeFigure(index)} aria-label="Retirer ce chiffre">
                ×
              </button>
            </div>
          ))}
        </div>
        {errors.figures && <FormStatus tone="error">{errors.figures}</FormStatus>}
        {values.figures.length < LIMITS.figures && (
          <Button variant="ghost" size="sm" onClick={addFigure} className={styles.add}>
            Ajouter un chiffre
          </Button>
        )}
      </Card>

      <Card padding="lg" className={styles.section}>
        <h2 className={styles.sectionTitle}>Business Room</h2>
        <Checkbox
          label="J'accepte d'échanger avec plusieurs acquéreurs vérifiés intéressés par cet actif (co-acquisition). Les intentions qu'ils déclarent ne sont pas contractuelles et CAPEO n'organise aucune collecte."
          {...bind('coAcquisition')}
        />
      </Card>

      <Card padding="lg" accent className={styles.section}>
        <Checkbox
          label="Je certifie pouvoir disposer de cet actif et que les informations fournies sont exactes. J'ai compris que l'annonce sera examinée par l'équipe CAPEO avant publication, et que la transaction se conclura hors plateforme, sans commission."
          {...bind('certify')}
        />
        <div className={styles.actions}>
          <Button variant="glass" onClick={() => save(false)} loading={pending === 'draft'} disabled={Boolean(pending)}>
            Enregistrer le brouillon
          </Button>
          <Button onClick={() => save(true)} loading={pending === 'submit'} disabled={Boolean(pending)}>
            Soumettre à l&apos;examen
          </Button>
        </div>
      </Card>
    </form>
  )
}
