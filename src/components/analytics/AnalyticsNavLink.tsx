export function AnalyticsNavLink() {
  return (
    <div style={{ padding: '8px var(--gutter-h, 32px) 12px', marginBottom: 8, borderBottom: '1px solid var(--theme-elevation-150)' }}>
      <a
        href="/admin/analytics"
        style={{ display: 'block', padding: '10px 12px', borderRadius: 5, fontSize: 13, fontWeight: 700, color: 'var(--theme-text)', textDecoration: 'none', background: 'var(--theme-elevation-50)' }}
      >
        Detailed analytics reports
      </a>
    </div>
  )
}
