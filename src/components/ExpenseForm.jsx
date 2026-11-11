import { useState } from 'react'
import { parseEurosToCents } from '../money'

export default function ExpenseForm({ onSave, onCancel }) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
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

    onSave({ name: trimmed, amountCents: parsed.cents })
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
      {error ? <p className="form-error">{error}</p> : null}
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Išsaugoti
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Atšaukti
        </button>
      </div>
    </form>
  )
}
