import { expenseSize, formatEuros } from '../money'
import { CATEGORIES, CATEGORY_COLORS } from '../categories'

export default function ExpenseList({ expenses, onAdd, onEdit, loaded = true }) {
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

      {ordered.length === 0 && loaded ? (
        <p className="empty-list">Šį mėnesį išlaidų dar nėra.</p>
      ) : (
        <ul className="expense-list">
          {ordered.map((expense) => {
            const size = expenseSize(expense.amountCents)
            return (
              <li key={expense.id} className="expense-item">
                <div>
                  <p className="expense-name">{expense.name}</p>
                  <div className="expense-badges">
                    <span
                      className="badge badge-category"
                      style={{ '--category-color': CATEGORY_COLORS[CATEGORIES.includes(expense.category) ? expense.category : 'Kita'] }}
                    >
                      {CATEGORIES.includes(expense.category) ? expense.category : 'Kita'}
                    </span>
                    <span className={size === 'Didelė' ? 'badge badge-large' : 'badge badge-small'}>
                      {size}
                    </span>
                  </div>
                </div>
                <div className="expense-actions">
                  <p className="expense-amount">{formatEuros(expense.amountCents)}</p>
                  <button type="button" className="btn btn-ghost" onClick={() => onEdit(expense)}>
                    Redaguoti
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
