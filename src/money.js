export function formatEuros(cents) {
  const sign = cents < 0 ? '−' : ''
  const absolute = Math.abs(cents)
  const euros = Math.floor(absolute / 100)
  const fraction = String(absolute % 100).padStart(2, '0')
  const grouped = new Intl.NumberFormat('lt-LT').format(euros)
  return `${sign}${grouped},${fraction} €`
}

export function parseEurosToCents(raw) {
  const value = raw.trim().replace(/\s/g, '').replace(',', '.')

  if (!value) {
    return { ok: false, error: 'Įveskite sumą, didesnę už nulį.' }
  }

  if (!/^\d+(\.\d{1,2})?$/.test(value)) {
    return { ok: false, error: 'Įveskite sumą eurais, pvz. 12,50.' }
  }

  const [whole, fraction = ''] = value.split('.')
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'))

  if (!Number.isSafeInteger(cents) || cents <= 0) {
    return { ok: false, error: 'Suma turi būti didesnė už nulį.' }
  }

  if (cents > 100_000_000_00) {
    return { ok: false, error: 'Suma per didelė.' }
  }

  return { ok: true, cents }
}

export function sumCents(expenses) {
  return expenses.reduce((total, expense) => total + expense.amountCents, 0)
}

export function usagePercent(spentCents, budgetCents) {
  if (budgetCents <= 0) return 0
  return Math.round((spentCents * 100) / budgetCents)
}

export function expenseSize(amountCents) {
  return amountCents >= 5000 ? 'Didelė' : 'Maža'
}
