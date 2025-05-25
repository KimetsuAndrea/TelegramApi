export default async function handler(req, res) {
  const BOT_TOKEN = process.env.BOT_TOKEN; // Set this in Vercel environment variables
  const WEBHOOK_URL = `https://${req.headers.host}/api/webhook`;

  const apiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${WEBHOOK_URL}`;

  try {
    const telegramRes = await fetch(apiUrl);
    const data = await telegramRes.json();

    if (data.ok) {
      res.status(200).json({ success: true, message: 'Webhook set successfully', result: data });
    } else {
      res.status(500).json({ success: false, message: 'Failed to set webhook', error: data });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error setting webhook', error: error.message });
  }
}