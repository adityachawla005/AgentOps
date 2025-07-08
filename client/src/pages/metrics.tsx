import { useState } from 'react';

export default function MetricsPage() {
  const [elementId, setElementId] = useState('');
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMetrics = async () => {
    setLoading(true);
    setError('');
    setMetrics(null);

    try {
      const res = await fetch(`http://localhost:8000/variant/${elementId}/metrics`);
      if (!res.ok) throw new Error('Element not found or server error');

      const data = await res.json();
      setMetrics(data);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to fetch metrics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📊 Element Metrics</h1>

      <input
        type="text"
        placeholder="Enter element ID"
        value={elementId}
        onChange={(e) => setElementId(e.target.value)}
        style={{ padding: '8px', width: '300px', marginRight: '10px' }}
      />
      <button onClick={fetchMetrics} style={{ padding: '8px 16px' }}>
        Fetch Metrics
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>❌ {error}</p>}

      {metrics && (
        <div style={{ marginTop: 20 }}>
          <p><strong>Element ID:</strong> {metrics.elementId}</p>
          <p><strong>Total Impressions:</strong> {metrics.totalImpressions}</p>
          <p><strong>Total Clicks:</strong> {metrics.totalClicks}</p>
          <p><strong>CTR:</strong> {metrics.ctr}</p>
        </div>
      )}
    </div>
  );
}
