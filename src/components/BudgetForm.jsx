import { useState } from 'react'
import { parseEurosToCents } from '../money'

export default function BudgetForm({ onSave, onCancel, saving = false }) {
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const parsed = parseEurosToCents(amount)
    if (!parsed.ok) {
      setError(parsed.error)
      return
    }
    onSave(parsed.cents)
  }

  return (
    <form className="entry-form" onSubmit={handleSubmit}>
      <label htmlFor="budget-amount">Suma, €</label>
      <input
        id="budget-amount"
        inputMode="decimal"
        autoComplete="off"
        placeholder="pvz. 1 400"
        value={amount}
        onChange={(event) => {
          setAmount(event.target.value)
          setError('')
        }}
      />
      {error ? <p className="form-error">{error}</p> : null}
      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saugoma…' : 'Išsaugoti'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={saving}>
          Atšaukti
        </button>
      </div>
    </form>
  )
}
