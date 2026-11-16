import { CATEGORIES, CATEGORY_COLORS } from '../categories'
import { formatEuros, sumCents } from '../money'

export default function CategorySummary({ expenses }) {
  const totals = CATEGORIES.map((category) => ({
    category,
    amountCents: sumCents(expenses.filter((expense) => expense.category === category)),
  }))
  const totalCents = sumCents(expenses)

  return (
    <section className="category-summary" aria-labelledby="category-summary-title">
      <div className="section-head">
        <div>
          <h2 id="category-summary-title">Išlaidos pagal kategoriją</h2>
          <p className="muted">Kiekvienos kategorijos dalis nuo visų mėnesio išlaidų</p>
        </div>
      </div>
      <ul className="category-summary-list">
        {totals.map(({ category, amountCents }) => {
          const share = totalCents > 0 ? (amountCents / totalCents) * 100 : 0
          return (
            <li className="category-summary-item" key={category}>
              <div className="category-summary-head">
                <span className="category-summary-name" style={{ '--category-color': CATEGORY_COLORS[category] }}>
                  <span className="category-summary-dot" aria-hidden="true" />
                  {category}
                </span>
                <span className="category-summary-amount">{formatEuros(amountCents)}</span>
              </div>
              <div
                className="category-progress-track"
                role="progressbar"
                aria-label={`${category}: ${share.toFixed(1)} % mėnesio išlaidų`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Number(share.toFixed(1))}
              >
                <span
                  className="category-progress-fill"
                  style={{ width: `${share}%`, '--category-color': CATEGORY_COLORS[category] }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
