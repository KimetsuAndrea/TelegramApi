const axios = require('axios');

const TELEGRAM_TOKEN = '7935094184:AAEtCkwxmdKbOvKZuWmkBFRdxF702BaX0xo'; // Replace with your bot token

const API_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/getMe`;

axios.get(API_URL)
  .then(response => {
    const bot = response.data.result;
    console.log('Bot ID:', bot.id);
    console.log('Bot Username:', bot.username);
    console.log('Bot Name:', bot.first_name);
  })
  .catch(error => {
    console.error('Error fetching bot info:', error.message);
  });
