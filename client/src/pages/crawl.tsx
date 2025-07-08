// client/src/pages/crawl.tsx
import { useState } from 'react';

export default function CrawlPage() {
  const [url, setUrl] = useState('');
  const [pages, setPages] = useState<{ full: string; path: string }[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleCrawl() {
    setLoading(true);
    setPages([]);

    const res = await fetch('http://localhost:8000/crawl', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();
    setPages(data.pages || []);
    setLoading(false);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>🌍 Crawl Website</h1>
      <input
        type="url"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ padding: '10px', width: '300px' }}
      />
      <button onClick={handleCrawl} style={{ marginLeft: 10, padding: '10px 20px' }}>
        Crawl
      </button>

      {loading && <p>Loading...</p>}

      {pages.length > 0 && (
        <ul>
          {pages.map((page, i) => (
            <li key={i}>
              <code>{page.path}</code> — <a href={page.full} target="_blank">{page.full}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
