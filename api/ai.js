export default async function handler(req, res) {
  // Only allow POST from your domain
  const origin = req.headers.origin || '';
  const allowed = ['https://dream-core-eight.vercel.app', 'http://localhost:3000', 'http://localhost'];
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  res.setHeader('Access-Control-Allow-Origin', allowed.includes(origin) ? origin : allowed[0]);
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const key = process.env.GEMINI_KEY;
    if (!key) return res.status(500).json({ error: { message: 'GEMINI_KEY not configured on server.' } });

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
