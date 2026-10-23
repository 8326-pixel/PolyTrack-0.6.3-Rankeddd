const WORKER_ORIGIN = process.env.RANKED_WORKER_URL || 'https://polytrack-ranked-worker.staticquasar931.workers.dev';

function readBody(request) {
  if (request.body === undefined || request.body === null) return Promise.resolve(null);
  if (Buffer.isBuffer(request.body)) return Promise.resolve(request.body);
  if (typeof request.body === 'string') return Promise.resolve(Buffer.from(request.body));
  return Promise.resolve(Buffer.from(JSON.stringify(request.body)));
}

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  const parts = Array.isArray(req.query?.path) ? req.query.path : [req.query?.path || ''];
  const suffix = parts.filter(Boolean).map(part => encodeURIComponent(String(part))).join('/');
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(req.query || {})) {
    if (key === 'path') continue;
    if (Array.isArray(value)) value.forEach(item => query.append(key, String(item)));
    else if (value !== undefined) query.set(key, String(value));
  }

  const target = `${WORKER_ORIGIN.replace(/\\/+$/, '')}/${suffix}${query.toString() ? `?${query}` : ''}`;
  const headers = {
    Accept: req.headers.accept || 'application/json',
    Origin: 'https://staticquasar931.github.io',
  };
  if (req.headers.authorization) headers.Authorization = req.headers.authorization;
  if (req.headers['content-type']) headers['Content-Type'] = req.headers['content-type'];

  try {
    const body = ['GET', 'HEAD'].includes(req.method) ? undefined : await readBody(req);
    const response = await fetch(target, {
      method: req.method || 'GET',
      headers,
      body: body || undefined,
    });
    const contentType = response.headers.get('content-type');
    if (contentType) res.setHeader('Content-Type', contentType);
    const cacheControl = response.headers.get('cache-control');
    if (cacheControl) res.setHeader('Cache-Control', cacheControl);
    res.status(response.status);
    const payload = Buffer.from(await response.arrayBuffer());
    res.send(payload);
  } catch (error) {
    res.status(502).json({ error: 'ranked_proxy_unavailable' });
  }
}
