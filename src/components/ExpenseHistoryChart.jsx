import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { formatEuros } from '../money'
import { monthKey, shiftMonth } from '../months'

function getMonthRows(year, month) {
  return Array.from({ length: 6 }, (_, index) => {
    const date = shiftMonth(year, month, index - 5)
    return {
      ...date,
      key: monthKey(date.year, date.month),
      label: new Intl.DateTimeFormat('lt-LT', { month: 'short', year: 'numeric' })
        .format(new Date(date.year, date.month - 1, 1)),
      amountCents: 0,
    }
  })
}

export default function ExpenseHistoryChart({ userId, year, month, refreshKey }) {
  const [retryCount, setRetryCount] = useState(0)
  const [state, setState] = useState({ key: null, status: 'loading', rows: [] })
  const requestKey = `${userId}:${year}:${month}:${retryCount}:${refreshKey}`

  useEffect(() => {
    let active = true
    const rows = getMonthRows(year, month)

    async function loadHistory() {
      try {
        const { data: budgets, error: budgetsError } = await supabase
          .from('budgets')
          .select('id, name')
          .eq('user_id', userId)
          .gte('name', rows[0].key)
          .lte('name', rows[rows.length - 1].key)

        if (budgetsError) throw budgetsError

        if (budgets.length === 0) {
          if (active) setState({ key: requestKey, status: 'success', rows })
          return
        }

        const budgetMonthById = new Map(budgets.map((budget) => [budget.id, budget.name]))
        const { data: expenses, error: expensesError } = await supabase
          .from('expenses')
          .select('budget_id, amount')
          .eq('user_id', userId)
          .in('budget_id', budgets.map((budget) => budget.id))

        if (expensesError) throw expensesError

        const totalsByMonth = new Map(rows.map((row) => [row.key, 0]))
        expenses.forEach((expense) => {
          const key = budgetMonthById.get(expense.budget_id)
          if (key && totalsByMonth.has(key)) {
            totalsByMonth.set(key, totalsByMonth.get(key) + Math.round(Number(expense.amount) * 100))
          }
        })

        if (active) {
          setState({
            key: requestKey,
            status: 'success',
            rows: rows.map((row) => ({ ...row, amountCents: totalsByMonth.get(row.key) ?? 0 })),
          })
        }
      } catch (error) {
        console.error('Expense history read failed:', error)
        if (active) setState({ key: requestKey, status: 'error', rows: [] })
      }
    }

    loadHistory()
    return () => {
      active = false
    }
  }, [userId, year, month, retryCount, refreshKey, requestKey])

  const stateMatchesRequest = state.key === requestKey
  const status = stateMatchesRequest ? state.status : 'loading'
  const rows = stateMatchesRequest ? state.rows : []
  const maxCents = Math.max(0, ...rows.map((row) => row.amountCents))
  const hasExpenses = maxCents > 0

  return (
    <section className="expense-history" aria-labelledby="expense-history-title">
      <div className="expense-history-heading">
        <div>
          <h2 id="expense-history-title">Išlaidų istorija</h2>
          <p className="muted">Paskutinių šešių mėnesių išlaidos</p>
        </div>
      </div>

      {status === 'loading' ? (
        <p className="expense-history-message" role="status">Įkeliama išlaidų istorija…</p>
      ) : status === 'error' ? (
        <div className="expense-history-error" role="alert">
          <p>Nepavyko įkelti išlaidų istorijos.</p>
          <button type="button" className="btn btn-ghost" onClick={() => setRetryCount((count) => count + 1)}>
            Bandyti dar kartą
          </button>
        </div>
      ) : !hasExpenses ? (
        <p className="expense-history-message" role="status">Šiuo laikotarpiu išlaidų nėra.</p>
      ) : (
        <ul className="expense-history-list">
          {rows.map((row) => {
            const width = maxCents > 0 ? (row.amountCents / maxCents) * 100 : 0
            return (
              <li className="expense-history-row" key={row.key}>
                <span className="expense-history-month">{row.label}</span>
                <div
                  className="expense-history-track"
                  role="progressbar"
                  aria-label={`${row.label}: ${formatEuros(row.amountCents)}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(width)}
                >
                  <span className="expense-history-fill" style={{ width: `${width}%` }} />
                </div>
                <span className="expense-history-amount">{formatEuros(row.amountCents)}</span>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
