'use strict';
const { Scenes } = require('telegraf');
const extractDomain = require('extract-domain');
const logger = require('../../logger')('bot');
const { Product } = require('../../models');
const http = require('../../helpers/http');
const validator = require('../../helpers/validator');
const AmazonProductPage = require('../../amazon/amazon-product-page');

const steps = [
  async ctx => {
    await ctx.reply('Quel est le nom du produit ?');

    ctx.wizard.next();
  },
  async ctx => {
    const name = ctx.update.message.text;
    const user = ctx.update.message.from.id;
    const exists = await Product.exists({ name: name, user: user });

    if (exists) {
      return await ctx.reply(
        'Vous avez déjà un produit portant le même nom. Veuillez en choisir un autre ou utiliser /exit pour quitter.'
      );
    }

    await ctx.reply('Insérer l\'sURL ou partager le produit avec Pricegram depuis l\'sapplication Amazon');

    ctx.wizard.state.name = name;
    ctx.wizard.next();
  },
  async ctx => {
    const message = ctx.update.message.text;
    const urls = message.match(/\bhttps?:\/\/\S+/gi);

    if (!urls) {
      return await ctx.reply('Ce n\'sest pas une URL valide, veuillez réessayer ou utiliser /exit pour quitter.');
    }

    const url = urls[0];
    const domain = extractDomain(url);

    if (!validator.isUrl(url) || !domain.startsWith('amazon.')) {
      return await ctx.reply('Ceci n\'sest pas un produit Amazon valide, veuillez réessayer ou utiliser /exit pour quitter.');
    }

    await ctx.reply('Récupération des informations sur les produits...');

    const html = await http.get(url);
    const productPage = new AmazonProductPage(html);

    const product = new Product({
      name: ctx.wizard.state.name,
      url: url,
      user: ctx.update.message.from.id,
      price: productPage.price,
      currency: productPage.currency,
      availability: productPage.availability,
      lastCheck: Math.floor(Date.now() / 1000)
    });

    await product.save();

    logger.info(`Product added: ${product.name} (${product.id}) - ${product.price} - ${product.availability}`);

    await ctx.reply('Votre produit est suivi 🎉');
    await ctx.scene.leave();
  }
];

const scene = new Scenes.WizardScene('add-product', ...steps);

scene.command('exit', async ctx => {
  await ctx.scene.leave();
  await ctx.reply('L\'opération a été interrompue.');
});

module.exports = scene;
