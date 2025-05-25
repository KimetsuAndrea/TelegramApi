const TelegramBot = require('node-telegram-bot-api');

const TELEGRAM_TOKEN = '7956105040:AAGagM_U2RAYeCTJkGTtB1cNyy9fTCGdQYk';
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'You are now Good To receive IP addresses');
});