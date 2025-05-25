export default async function handler(req, res) {
  if (req.method === 'POST') {
    const body = req.body;
    const chatId = body.message?.chat.id;
    const text = body.message?.text?.toLowerCase() || '';

    if (text.includes('/start')) {
      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: 'You are now Good To receive IP addresses',
        }),
      });
    } else if (text.includes('/chatid')) {
      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `Your chat ID is: \`${chatId}\``,
          parse_mode: 'MarkdownV2'
        }),
      });
    }

    res.status(200).send('ok');
  } else {
    res.status(405).send('Method not allowed');
  }
}