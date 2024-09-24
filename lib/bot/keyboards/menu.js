'use strict';
const { Markup } = require('telegraf');

module.exports = product => {
  const availabilityAlerts = product.preferences.availabilityAlerts;
  const targetPrice = product.preferences.targetPrice;
  const currency = product.currency || '';

  const items = [
    {
      text: '💰 Fixer un prix cible ' + (targetPrice ? '(' + currency + (currency ? ' ' : '') + targetPrice + ')' : ''),
      callbackData: '!price?id=' + product.id
    },
    {
      text: '🧭  Alertes de disponibilité : ' + (availabilityAlerts ? 'ON' : 'OFF'),
      callbackData: '!availability?id=' + product.id + '&value=' + !availabilityAlerts
    },
    {
      text: '🗑  Supprimer',
      callbackData: '!remove?id=' + product.id
    },
    {
      text: '      <<  Retour à la liste des produits      ',
      callbackData: '!list'
    }
  ];

  return Markup.inlineKeyboard([...items.map(e => [Markup.button.callback(e.text, e.callbackData)])]);
};
