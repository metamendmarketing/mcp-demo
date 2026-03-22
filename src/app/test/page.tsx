export default function TestPage() {
  return (
    <div style={{ padding: '100px', backgroundColor: 'magenta', color: 'white', minHeight: '100vh', textAlign: 'center' }}>
      <h1 style={{ fontSize: '100px' }}>DEPLOYMENT TEST SUCCESSFUL</h1>
      <p style={{ fontSize: '50px' }}>IF YOU SEE THIS, NEW ROUTES ARE BUILDING.</p>
      <p>TIMESTAMP: {new Date().toISOString()}</p>
    </div>
  );
}
