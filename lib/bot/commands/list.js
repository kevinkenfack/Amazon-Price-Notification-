'use strict';
const { Product } = require('../../models');
const keyboards = require('../keyboards');

module.exports = async ctx => {
  const user = ctx.update.message.from.id;
  const products = await Product.find({ user: user });

  if (products.length) {
    await ctx.reply('Choisissez un produit dans la liste ci-dessous:', keyboards.list(products));
  } else {
    await ctx.reply('Votre liste de produits est vide.');
  }
};
