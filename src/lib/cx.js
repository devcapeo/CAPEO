/* Concatène des noms de classes en ignorant les valeurs falsy. */
export function cx(...classNames) {
  return classNames.filter(Boolean).join(' ')
}
