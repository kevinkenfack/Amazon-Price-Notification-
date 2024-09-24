'use strict';
const { Telegraf, Scenes } = require('telegraf');
const LocalSession = require('telegraf-session-local');
const scenes = require('./scenes');
const commands = require('./commands');
const actions = require('./actions');
const errorHandler = require('./error-handler');

const stage = new Scenes.Stage(Object.values(scenes));
const session = new LocalSession();

const welcomeMessage = '*Bienvenue sur Pricegram*\n\n' +
  'Commencez à économiser de l\'argent en suivant les produits Amazon et recevez ' +
  'des alertes sur les prix et les disponibilités en fonction de vos préférences.\n\n' +
  '_Commands_\n\n' +
  '/track - suivre un nouveau produit\n' +
  '/list - gérer vos produits';

class Bot extends Telegraf {
  constructor(token, options) {
    super(token, options);

    this.use(session.middleware());
    this.use(stage.middleware());

    this.catch(errorHandler);

    this.start(ctx => ctx.replyWithMarkdown(welcomeMessage));

    this.command('track', commands.track);
    this.command('list', commands.list);

    this.action('!list', actions.list);
    this.action(/^!menu=(\w+)$/, actions.menu);
    this.action(/^!remove\?id=(\w+)$/, actions.remove);
    this.action(/^!availability\?id=(\w+)&value=(\w+)$/, actions.availability);
    this.action(/^!price\?id=(\w+)$/, actions.price);
  }

  sendMessage(user, message) {
    // eslint-disable-next-line
    this.telegram.sendMessage(user, message, { parse_mode: 'Markdown', disable_web_page_preview: true });
  }
}

module.exports = Bot;
