import { formatMonth } from '../months'

export default function MonthSwitcher({ year, month, onShift }) {
  return (
    <div className="month-switcher">
      <button type="button" className="icon-button" onClick={() => onShift(-1)}>
        Ankstesnis
      </button>
      <p className="month-label">{formatMonth(year, month)}</p>
      <button type="button" className="icon-button" onClick={() => onShift(1)}>
        Kitas
      </button>
    </div>
  )
}
