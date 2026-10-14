import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-custom-api-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const customKeyHeader = req.headers['x-custom-api-key'] as string | undefined;
    const apiKey = (customKeyHeader || '').trim() || (process.env.GEMINI_API_KEY || '').trim();

    if (!apiKey) {
      return res.status(200).json({
        ok: true,
        model: 'Built-in Tourism Knowledge Engine',
        provider: 'local',
        usingCustomKey: false,
        msg: 'Free tier ready with built-in instant travel knowledge fallback.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: 'Hello' }] }],
    });

    return res.status(200).json({
      ok: true,
      provider: 'gemini',
      model: 'gemini-2.5-flash',
      sample: (response.text || '').slice(0, 50),
      usingCustomKey: Boolean(customKeyHeader),
      msg: 'Verified! Successfully connected to Google Gemini.',
    });
  } catch (err: any) {
    return res.status(200).json({
      ok: false,
      error: err.message || 'Connection test failed. Please verify API key format.',
    });
  }
}
