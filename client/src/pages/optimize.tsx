import { useState } from 'react';

export default function OptimizeUI() {
  const [inputHtml, setInputHtml] = useState('');
  const [goal, setGoal] = useState('conversions');
  const [output, setOutput] = useState('');

  const handleOptimize = async () => {
    const res = await fetch('http://localhost:8000/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ element: inputHtml, goal }),
    });

    const data = await res.json();
    setOutput(data.optimized);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>⚙️ Optimize Element</h1>
      <textarea rows={6} cols={60} placeholder="<button>Buy Now</button>" value={inputHtml} onChange={e => setInputHtml(e.target.value)} />
      <br />
      <input value={goal} onChange={e => setGoal(e.target.value)} />
      <br /><br />
      <button onClick={handleOptimize}>Optimize</button>

      {output && (
        <div style={{ marginTop: 20 }}>
          <h3>Optimized Output:</h3>
          <pre>{output}</pre>

          <h3>Preview:</h3>
          <div dangerouslySetInnerHTML={{ __html: output }} />
        </div>
      )}
    </div>
  );
}
