export default function Stats({ habits }) {
  const total = habits.length
  const active = habits.filter((h) => h.is_active).length
  const paused = total - active

  return (
    <div
      style={{
        display: 'flex',
        gap: '1.5rem',
        padding: '0.75rem 1rem',
        border: '1px solid #eee',
        borderRadius: 8,
        margin: '1rem 0',
      }}
    >
      <Stat label="Total" value={total} />
      <Stat label="Active" value={active} />
      <Stat label="Paused" value={paused} />
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 'bold' }}>{value}</div>
      <div style={{ fontSize: 12, color: '#666' }}>{label}</div>
    </div>
  )
}