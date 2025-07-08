const session_id = localStorage.getItem('session_id') || crypto.randomUUID();
localStorage.setItem('session_id', session_id);

const page = window.location.pathname;
const user_agent = navigator.userAgent;
const events: any[] = [];

document.querySelectorAll('[data-track]').forEach(async (el) => {
  const elementId = el.id;

  // 🧠 Get a random variant from the backend
  const res = await fetch(`http://localhost:8000/variant/${elementId}`);
  if (!res.ok) return;

  const variant = await res.json();
  if (!variant || !variant.html) return;
  

  // 🧬 Replace original element with optimized HTML
  const tempWrapper = document.createElement('div');
  tempWrapper.innerHTML = variant.html;
  const newEl = tempWrapper.firstElementChild;
  if (!newEl) return;
  if (el.outerHTML.trim() === newEl.outerHTML.trim()) return;

  el.replaceWith(newEl);
  // 🖌️ Apply CSS if available
  if (variant.css) {
    const style = document.createElement('style');
    style.innerHTML = variant.css;
    document.head.appendChild(style);
  }

  el.replaceWith(newEl);

  // 🧠 Track impression
  fetch(`http://localhost:8000/variant/${variant.id}/impression`, {
    method: 'POST',
  });

  // 🖱️ Track click
  newEl.addEventListener('click', () => {
    events.push({
      type: 'click',
      element: newEl.tagName + (newEl.id ? `#${newEl.id}` : ''),
      timestamp: Date.now(),
    });

    fetch(`http://localhost:8000/variant/${variant.id}/click`, {
      method: 'POST',
    });
  });
});

// 🔁 Every 10 seconds, send batched events
setInterval(() => {
  if (events.length === 0) return;

  fetch('http://localhost:8000/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id, page, user_agent, events: [...events] }),
  });

  events.length = 0;
}, 10000);
