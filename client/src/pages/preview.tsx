import { useEffect, useState } from 'react';

export default function Preview() {
  const [elementId, setElementId] = useState('');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const rawHtml = localStorage.getItem('rawHtml');
    const id = localStorage.getItem('elementId');

    if (rawHtml && id) {
      setInput(rawHtml);
      setElementId(id);
    } else {
      setError('No element found. Please navigate from Dashboard.');
    }
  }, []);

  const optimize = async () => {
    setError('');
    setResult('');
    setMessage('');
    try {
      const res = await fetch('http://localhost:8000/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ element: input, goal: 'conversions' }),
      });

      const data = await res.json();
      setResult(data.optimized);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch optimized result');
    }
  };

  const extractHtmlCss = () => {
    const html = result
      .replace(/<optimized>/, '')
      .replace(/<\/optimized>/, '')
      .replace(/<style>[\s\S]*<\/style>/, '')
      .trim();

    const cssMatch = result.match(/<style>([\s\S]*?)<\/style>/);
    const css = cssMatch ? cssMatch[1].trim() : '';

    return { html, css };
  };

  const saveVariant = async () => {
    const { html, css } = extractHtmlCss();

    try {
      const res = await fetch('http://localhost:8000/variant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Optimized Variant',
          elementId,
          version: 2, // optionally make dynamic
          html,
          css,
        }),
      });

      if (res.ok) {
        setMessage('✅ Variant saved successfully!');
      } else {
        const err = await res.json();
        setMessage(`❌ Failed to save: ${err.error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Network error');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🛠️ Preview Optimized Variant</h1>

      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <>
          <textarea
            rows={5}
            style={{ width: '100%' }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <br />
          <button onClick={optimize} style={{ marginTop: 10 }}>
            Optimize & Preview
          </button>

          {result && (
            <>
              <div style={{ marginTop: 20 }}>
                <h2>🔍 Preview:</h2>
                <div
                  dangerouslySetInnerHTML={{ __html: result }}
                  style={{
                    border: '1px solid #ccc',
                    padding: '20px',
                    marginTop: '10px',
                  }}
                />
              </div>

              <button onClick={saveVariant} style={{ marginTop: 20 }}>
                💾 Save This Variant
              </button>
              {message && <p style={{ marginTop: 10 }}>{message}</p>}
            </>
          )}
        </>
      )}
    </div>
  );
}
