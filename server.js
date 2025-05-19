import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

const TELEGRAM_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';
const CHAT_IDS = ['6260002708', '7409394162'];

app.post('/send', async (req, res) => {
  const message = req.body.message;

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

    res.json({
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
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
