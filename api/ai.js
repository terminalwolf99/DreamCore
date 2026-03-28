
export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const allowed = ['https://dream-core-eight.vercel.app', 'http://localhost:3000', 'http://localhost'];

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  try {
    const key = process.env.GEMINI_KEY
              || process.env.gemini_key
              || process.env.GEMINI
              || null;

    if (!key) {
      // Return all available env var names (not values) for debugging
      const envKeys = Object.keys(process.env).join(', ');
      return res.status(500).json({
        error: { message: `GEMINI_KEY not found. Available env vars: ${envKeys}` }
      });
    }

    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(req.body) }
    );
    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (e) {
    res.status(500).json({ error: { message: e.message } });
  }
}
