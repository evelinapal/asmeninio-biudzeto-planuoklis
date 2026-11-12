import { useState } from 'react'
import { parseEurosToCents } from '../money'

const CATEGORIES = ['Maistas', 'Transportas', 'Būstas', 'Pramogos', 'Sveikata', 'Kita']

export default function ExpenseForm({ onSave, onCancel, saving = false }) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Įveskite išlaidos pavadinimą.')
      return
    }

    const parsed = parseEurosToCents(amount)
    if (!parsed.ok) {
      setError(parsed.error)
      return
    }

    setSubmitting(true)
    try {
      await onSave({ name: trimmed, amountCents: parsed.cents, category })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="entry-form" onSubmit={handleSubmit}>
      <label htmlFor="expense-name">Išlaidos pavadinimas</label>
      <input
        id="expense-name"
        autoComplete="off"
        placeholder="pvz. Maisto prekės"
        value={name}
        onChange={(event) => {
          setName(event.target.value)
          setError('')
        }}
      />
      <label htmlFor="expense-amount">Suma, €</label>
      <input
        id="expense-amount"
        inputMode="decimal"
        autoComplete="off"
        placeholder="pvz. 48,50"
        value={amount}
        onChange={(event) => {
          setAmount(event.target.value)
          setError('')
        }}
      />
      <label htmlFor="expense-category">Kategorija</label>
      <select id="expense-category" value={category} onChange={(event) => setCategory(event.target.value)}>
        {CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
      {error ? <p className="form-error">{error}</p> : null}
      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={saving || submitting}>
          {saving || submitting ? 'Saugoma…' : 'Išsaugoti'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={saving || submitting}>
          Atšaukti
        </button>
      </div>
    </form>
  )
}
