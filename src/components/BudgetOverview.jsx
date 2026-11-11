import { formatEuros, usagePercent } from '../money'

export default function BudgetOverview({ budgetCents, spentCents }) {
  const remainingCents = budgetCents - spentCents
  const percent = usagePercent(spentCents, budgetCents)
  const overBudget = remainingCents < 0
  const barWidth = Math.min(percent, 100)

  return (
    <section className="overview">
      <div className="stat-grid">
        <article className="stat-card">
          <p className="eyebrow">Mėnesio biudžetas</p>
          <p className="stat-value">{formatEuros(budgetCents)}</p>
        </article>
        <article className="stat-card">
          <p className="eyebrow">Išleista</p>
          <p className="stat-value stat-spent">{formatEuros(spentCents)}</p>
        </article>
        <article className="stat-card">
          <p className="eyebrow">Likutis</p>
          <p className={`stat-value ${overBudget ? 'stat-negative' : 'stat-left'}`}>
            {formatEuros(remainingCents)}
          </p>
        </article>
      </div>

      <div className="progress-card">
        <div className="progress-head">
          <p className="eyebrow">Biudžeto panaudojimas</p>
          <p className={overBudget ? 'progress-label is-over' : 'progress-label'}>
            {overBudget ? `Viršyta · ${percent} %` : `${percent} %`}
          </p>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={barWidth}
          aria-label="Biudžeto panaudojimas"
        >
          <span
            className={overBudget ? 'progress-fill is-over' : 'progress-fill'}
            style={{ width: `${barWidth}%` }}
          />
        </div>
        {overBudget ? (
          <p className="over-note">Biudžetas viršytas šį mėnesį.</p>
        ) : null}
      </div>
    </section>
  )
}
