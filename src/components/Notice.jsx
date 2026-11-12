export default function Notice({ notice, onRetry }) {
  if (!notice) return null

  return (
    <p
      className={`notice notice-${notice.type}`}
      role={notice.type === 'error' ? 'alert' : 'status'}
      aria-live={notice.type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      {notice.type === 'success' ? <strong>✓ {notice.text}</strong> : notice.text}
      {onRetry ? (
        <button type="button" className="btn btn-ghost" onClick={onRetry}>
          Bandyti dar kartą
        </button>
      ) : null}
    </p>
  )
}
