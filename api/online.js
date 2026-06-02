const TTL_MS = 45_000;

function getStore() {
  if (!globalThis.__weSessions) globalThis.__weSessions = new Map();
  return globalThis.__weSessions;
}

function cleanup(store) {
  const now = Date.now();
  for (const [id, ts] of store) {
    if (now - ts > TTL_MS) store.delete(id);
  }
}

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Session-Id');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const store = getStore();
  cleanup(store);

  const sid = req.headers['x-session-id'] || req.query?.sid;
  if ((req.method === 'POST' || req.method === 'GET') && sid) {
    store.set(String(sid), Date.now());
    cleanup(store);
  }

  res.status(200).json({ online: store.size, ok: true });
};
