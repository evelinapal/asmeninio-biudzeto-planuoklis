export default function Notice({ notice }) {
  if (!notice) return null

  return (
    <p className={`notice notice-${notice.type}`} role="status">
      {notice.text}
    </p>
  )
}
