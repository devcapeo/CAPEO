import Spinner from '@/components/ui/Spinner/Spinner'
import styles from './SectionState.module.css'

/* Chargement ou erreur d'une section ; ne rend rien quand les données sont prêtes */
export default function SectionState({ loading, error, onRetry, hasData }) {
  if (error) {
    return (
      <div className={styles.box}>
        <p className={styles.error}>{error}</p>
        {onRetry && <button type="button" className={styles.retry} onClick={() => onRetry()}>Réessayer</button>}
      </div>
    )
  }
  if (loading && !hasData) {
    return (
      <div className={styles.box}>
        <Spinner />
      </div>
    )
  }
  return null
}
