'use strict';
const { Product } = require('../../models');
const keyboards = require('../keyboards');

module.exports = async ctx => {
  const user = ctx.update.callback_query.from.id;
  const products = await Product.find({ user: user });

  await ctx.answerCbQuery();

  if (products.length) {
    await ctx.editMessageText('Choisir un produit dans la liste ci-dessous:', keyboards.list(products));
  } else {
    await ctx.editMessageText('Votre liste de produits est vide.');
  }
};
