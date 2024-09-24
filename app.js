'use strict';
const config = require('config');
const logger = require('./lib/logger')();
const database = require('./lib/database');
const Bot = require('./lib/bot');
const priceTracker = require('./lib/price-tracker');
const Alert = require('./lib/templates/alert');

const mongoConnectionURI = process.env.MONGO_CONNECTION_URI || config.get('mongo.connectionURI');
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN || config.get('telegram.token');

const bot = new Bot(telegramBotToken);

database.connect(mongoConnectionURI).then(() => {
  bot.launch();
  priceTracker.start();

  priceTracker.on('update', product => {
    bot.sendMessage(product.user, new Alert(product).toMarkdown());
    logger.info(`Alerte envoyée : ${product.name} (${product.id})`);
  });

  logger.info('Pricegram a démarré...');
});
