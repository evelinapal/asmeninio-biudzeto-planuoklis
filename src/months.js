const MONTH_NAMES = [
  'sausis',
  'vasaris',
  'kovas',
  'balandis',
  'gegužė',
  'birželis',
  'liepa',
  'rugpjūtis',
  'rugsėjis',
  'spalis',
  'lapkritis',
  'gruodis',
]

export function monthKey(year, month) {
  return `${year}-${String(month).padStart(2, '0')}`
}

export function formatMonth(year, month) {
  return `${year} m. ${MONTH_NAMES[month - 1]}`
}

export function shiftMonth(year, month, delta) {
  const date = new Date(year, month - 1 + delta, 1)
  return { year: date.getFullYear(), month: date.getMonth() + 1 }
}
