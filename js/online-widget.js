(function () {
  const cfg = window.WE_CONFIG || {};
  const OWNER_KEY = cfg.OWNER_KEY || 'bagir';
  const API = cfg.STATS_API || '/api/online';
  const PING_MS = cfg.PING_MS || 20000;
  const SHOW_PUBLIC = !!cfg.SHOW_PUBLIC_ONLINE;

  const params = new URLSearchParams(location.search);
  if (params.get('owner') === OWNER_KEY) {
    try { localStorage.setItem('we_owner', '1'); } catch (_) {}
  }

  const isOwner = (() => {
    try {
      return localStorage.getItem('we_owner') === '1' || params.get('owner') === OWNER_KEY;
    } catch (_) {
      return params.get('owner') === OWNER_KEY;
    }
  })();

  if (!SHOW_PUBLIC && !isOwner) return;

  const sessionId = (() => {
    const key = 'we_sid';
    try {
      let id = sessionStorage.getItem(key);
      if (!id) {
        id = crypto.randomUUID?.() || String(Date.now()) + Math.random().toString(16).slice(2);
        sessionStorage.setItem(key, id);
      }
      return id;
    } catch (_) {
      return 's-' + Date.now();
    }
  })();

  const el = document.createElement('div');
  el.className = 'online-widget' + (isOwner ? ' online-widget--owner' : '');
  el.setAttribute('aria-live', 'polite');
  el.innerHTML =
    '<span class="online-widget__dot" aria-hidden="true"></span>' +
    '<span class="online-widget__text">' +
    '<span class="online-widget__count" data-online>—</span> online' +
    (isOwner ? '<span class="online-widget__hint"> · owner</span>' : '') +
    '</span>';
  document.body.appendChild(el);

  async function ping() {
    try {
      const res = await fetch(API + '?sid=' + encodeURIComponent(sessionId), {
        method: 'GET',
        headers: { 'X-Session-Id': sessionId },
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('bad status');
      const data = await res.json();
      const n = el.querySelector('[data-online]');
      if (n) n.textContent = String(data.online ?? '—');
    } catch (_) {
      const n = el.querySelector('[data-online]');
      if (n && isOwner) n.textContent = '—';
      if (n && !isOwner) el.hidden = true;
    }
  }

  ping();
  setInterval(ping, PING_MS);
})();
