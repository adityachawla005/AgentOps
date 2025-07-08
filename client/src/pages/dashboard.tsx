import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [elementIds, setElementIds] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchLowCTR() {
      try {
        const res = await fetch('http://localhost:8000/elements/low-ctr');
        const data = await res.json();
        const ids = data.map((el: any) => el.elementId);
        setElementIds(ids);

        const metricData: Record<string, any> = {};
        for (const id of ids) {
          try {
            const res = await fetch(`http://localhost:8000/variant/${id}/metrics`);
            if (res.ok) {
              const json = await res.json();
              metricData[id] = json;
            }
          } catch (err) {
            console.error(`Failed to fetch metrics for ${id}:`, err);
          }
        }

        setMetrics(metricData);
      } catch (err) {
        console.error('Failed to fetch low CTR elements:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLowCTR();
  }, []);

  async function handleOptimize(elementId: string) {
    const el = document.getElementById(elementId);
    if (!el) {
      alert(`Element with ID "${elementId}" not found on this page.`);
      return;
    }

    const rawHtml = el.outerHTML;

    // Store data temporarily for preview page
    localStorage.setItem('elementId', elementId);
    localStorage.setItem('rawHtml', rawHtml);

    // Redirect to preview
    router.push('/preview');
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>📊 AgentOps: Low-CTR Elements</h1>
      {loading ? <p>Loading...</p> : (
        Object.entries(metrics).map(([id, metric]) => (
          <div key={id} style={{ marginBottom: '2rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
            <h3>🧩 Element: <code>{id}</code></h3>
            <ul>
              <li>Total Impressions: {metric.totalImpressions}</li>
              <li>Total Clicks: {metric.totalClicks}</li>
              <li>CTR: {metric.ctr}</li>
            </ul>

            <button onClick={() => handleOptimize(id)} style={{ marginTop: 10 }}>
              ⚡ Optimize & Preview
            </button>
          </div>
        ))
      )}
    </div>
  );
}
