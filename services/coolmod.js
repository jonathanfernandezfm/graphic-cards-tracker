const axios = require('axios');
const open = require('open');
const jsdom = require('jsdom');
const colors = require('colors');
const config = require('../config/config.json');
const { JSDOM } = jsdom;

var checked = [];

module.exports = {
	coolmod: async () => {
		try {
			const response = await axios.get(`${config.COOLMOD_URL}`);
			const dom = new JSDOM(`${response.data}`);

			dom.window.document.querySelectorAll('.item-product').forEach((item) => {
				let name = '';
				let price = '';
				let link = '';

				name = item
					.querySelector('.product-name')
					.querySelector('a')
					.innerHTML.trim()
					.replace(/<\/?span[^>]*>/g, '');
				link = item.querySelector('.product-name').querySelector('a').getAttribute('href');
				price = item
					.querySelector('.mod-featured-prices-container')
					.querySelector('div.margin-top-20')
					.innerHTML.trim();

				if (
					item.querySelector('.cat-product-availability').innerHTML.trim() !==
						'Sin Stock' &&
					item.querySelector('.cat-product-availability').innerHTML.trim() !== 'Agotado'
				) {
					console.log(
						colors.green(
							`🔵 [STOCK] - ${name} - ${price} € - {https://www.coolmod.com${link}}`
						)
					);
					if (!checked.includes(name)) {
						open(`https://www.coolmod.com${link}`);
						checked.push(`${name}`);
					}
				} else {
					if (checked.includes(name)) {
						checked = checked.filter((a) => a != name);
					}
				}
			});
		} catch (err) {
			console.log(err.message);
		}
	},
};
