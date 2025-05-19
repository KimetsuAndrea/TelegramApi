// api/send.js
import axios from 'axios';

const TELEGRAM_TOKEN = '7935094184:AAEtCkwxmdKbOvKZuWmkBFRdxF702BaX0xo';
const CHAT_IDS = ['6260002708', '7409394162'];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, error: 'Message is required' });
  }

  try {
    const sendResults = await Promise.allSettled(
      CHAT_IDS.map(chat_id =>
        axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
          chat_id,
          text: message
        })
      )
    );

    res.status(200).json({
      success: true,
      results: sendResults.map((r, i) => ({
        chat_id: CHAT_IDS[i],
        status: r.status,
        ...(r.status === 'fulfilled' ? { data: r.value.data } : { reason: r.reason.message })
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
