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
          This is the Pizza42 CIAM Demo API backend powered by Next.js.
        </p>
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            <strong>Available Endpoints:</strong>
          </p>
          <code style={{
            display: 'block',
            backgroundColor: '#f3f4f6',
            padding: '1rem',
            borderRadius: '0.25rem',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            textAlign: 'left'
          }}>
            POST /api/orders<br />
            GET /api/user-orders<br />
            GET /api/tokens
          </code>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
          Protected by Auth0 • Built with Next.js
        </p>
      </div>
    </div>
  );
}
