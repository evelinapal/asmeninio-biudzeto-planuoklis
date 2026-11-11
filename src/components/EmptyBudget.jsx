export default function EmptyBudget({ onCreate }) {
  return (
    <section className="empty-card">
      <p className="eyebrow">Nėra biudžeto</p>
      <h2>Šiam mėnesiui biudžetas dar nesukurtas</h2>
      <p className="muted">
        Sukurkite šio mėnesio biudžetą, kad galėtumėte įvesti išlaidas ir matyti
        likutį.
      </p>
      <button type="button" className="btn btn-primary" onClick={onCreate}>
        Sukurti biudžetą
      </button>
    </section>
  )
}
