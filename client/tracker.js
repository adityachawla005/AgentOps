(() => {
    const sessionId = crypto.randomUUID(); 
    const page = window.location.pathname;
    const events = [];
  
    function getElementDescriptor(el) {
      if (!el || !el.tagName) return 'UNKNOWN';
      let desc = el.tagName;
      if (el.id) desc += `#${el.id}`;
      if (el.classList?.length)
        desc += `.${[...el.classList].join('.')}`;
      return desc;
    }
  
    function recordEvent(type, element) {
      events.push({
        type,
        element: getElementDescriptor(element),
        timestamp: Date.now(),
      });
    }
  
 
    document.addEventListener('click', (e) => recordEvent('click', e.target));
  
   
    let lastScroll = 0;
    document.addEventListener('scroll', () => {
      if (Date.now() - lastScroll > 2000) {
        recordEvent('scroll', document.body);
        lastScroll = Date.now();
      }
    });
  

    setInterval(() => {
      if (events.length === 0) return;
  
      const payload = {
        session_id: sessionId,
        page,
        user_agent: navigator.userAgent,
        events: [...events],
      };
  
      console.log(' Sending events:', payload);
  
      fetch('http://localhost:8000/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          if (!res.ok) throw new Error('Network response not ok');
          console.log('Events sent');
          events.length = 0;
        })
        .catch((err) => {
          console.error('Tracking failed:', err);
        });
    }, 5000);
  })();
  