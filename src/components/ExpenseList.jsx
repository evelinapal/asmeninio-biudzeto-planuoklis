import { expenseSize, formatEuros } from '../money'

export default function ExpenseList({ expenses, onAdd }) {
  const ordered = [...expenses].sort(
    (a, b) => b.createdAt - a.createdAt || b.id.localeCompare(a.id),
  )

  return (
    <section className="expenses">
      <div className="section-head">
        <h2>Išlaidos</h2>
        <button type="button" className="btn btn-primary" onClick={onAdd}>
          Pridėti išlaidą
        </button>
      </div>

      {ordered.length === 0 ? (
        <p className="empty-list">Šį mėnesį išlaidų dar nėra.</p>
      ) : (
        <ul className="expense-list">
          {ordered.map((expense) => {
            const size = expenseSize(expense.amountCents)
            return (
              <li key={expense.id} className="expense-item">
                <div>
                  <p className="expense-name">{expense.name}</p>
                  <span className={size === 'Didelė' ? 'badge badge-large' : 'badge badge-small'}>
                    {size}
                  </span>
                </div>
                <p className="expense-amount">{formatEuros(expense.amountCents)}</p>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
