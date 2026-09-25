export default function ErrorBanner({ message, onRetry }) {
  if (!message) return null
  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '10px 12px',
        margin: '8px 0',
        borderRadius: 10,
        border: '1px solid #7f1d1d',
        background: 'rgba(127, 29, 29, 0.35)',
        color: '#fecaca',
      }}
    >
      <span>{message}</span>
      {onRetry && (
        <button type="button" className="btn" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  )
}
