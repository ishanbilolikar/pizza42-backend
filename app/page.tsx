export default function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif',
      backgroundColor: '#f9fafb'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍕 Pizza42 API</h1>
      <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '2rem' }}>
        Backend API Server
      </p>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        textAlign: 'center'
      }}>
        <p style={{ marginBottom: '1rem', color: '#374151' }}>
          This is the API backend. The frontend is running separately.
        </p>
        <p style={{ marginBottom: '1.5rem', color: '#6b7280', fontSize: '0.9rem' }}>
          API Endpoint: <code style={{
            backgroundColor: '#f3f4f6',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            fontFamily: 'monospace'
          }}>/api/orders</code>
        </p>
        <a
          href="http://localhost:5173"
          style={{
            display: 'inline-block',
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '600'
          }}
        >
          Open React Frontend →
        </a>
      </div>
    </div>
  );
}
