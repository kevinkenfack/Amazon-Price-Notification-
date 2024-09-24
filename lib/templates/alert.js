'use strict';

class Alert {
  constructor(product) {
    this.title = product.name;
    this.price = product.price;
    this.currency = product.currency;
    this.availability = product.availability;
    this.url = product.url;
  }

  toMarkdown() {
    const markdown =
      `*${this.title}*\n\n` +
      '💰  ' + (this.price ? `*${this.price.toFixed(2)} ${this.currency}*` : '-') + '\n\n' +
      `🧭  ${this.availability}\n\n` +
      `[Vérifiez ici!](${this.url})`;

    return markdown;
  }
}

module.exports = Alert;
