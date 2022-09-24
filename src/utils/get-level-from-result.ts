export function getLevelFromResult(result: number) {
  if (result >= 200) {
    return 'Expert'
  } else if (result >= 100) {
    return 'Proficiente'
  }

  return 'Novato'
}
