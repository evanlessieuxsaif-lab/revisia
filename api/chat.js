export default async function handler(req, res) {

  if (req.method !== 'POST') {

      return res.status(405).json({ error: { message: 'Method not allowed' } });

  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {

      return res.status(500).json({ error: { message: 'GEMINI_API_KEY not configured' } });

  }

  try {

      const { messages, system } = req.body;

      if (!messages || !Array.isArray(messages)) {

          return res.status(400).json({ error: { message: 'messages array required' } });

      }

      const contents = [];

      if (system) {

          contents.push({ role: 'user', parts: [{ text: `[Instructions système]: ${system}` }] });

          contents.push({ role: 'model', parts: [{ text: 'Compris.' }] });

      }

      for (const msg of messages) {

          const role = msg.role === 'assistant' ? 'model' : 'user';

          let text = '';

          if (typeof msg.content === 'string') {

                text = msg.content;

          } else if (Array.isArray(msg.content)) {

                text = msg.content.map(c => c.text || '').join('');

          }

          if (text) contents.push({ role, parts: [{ text }] });

      }

      if (contents.length === 0) {

          return res.status(400).json({ error: { message: 'No content to send' } });

      }

      const response = await fetch(

              `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,

        {

                method: 'POST',

                  headers: { 'Content-Type': 'application/json' },

                  body: JSON.stringify({

                                                 contents,

                              generationConfig: { maxOutputTokens: 2048, temperature: 0.7 }

                  })

        }

            );

      const data = await response.json();

      if (!response.ok) {

          const errMsg = data.error?.message || JSON.stringify(data);

          return res.status(response.status).json({ error: { message: errMsg } });

      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (!text) {

          return res.status(500).json({ error: { message: 'Empty response from Gemini: ' + JSON.stringify(data) } });

      }

      res.status(200).json({ content: [{ type: 'text', text }] });

  } catch (error) {

      res.status(500).json({ error: { message: error.message } });

  }

}
