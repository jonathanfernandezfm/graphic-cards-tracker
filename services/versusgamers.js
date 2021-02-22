var checked = [];

const axios = require('axios');
const open = require('open');
const jsdom = require('jsdom');
const colors = require('colors');

const { JSDOM } = jsdom;

module.exports = {
	versus: async (filters) => {
		try {
			const response = await axios.get(
				`https://www.vsgamers.es/category/componentes/tarjetas-graficas/5${filters}`
			);
			const dom = new JSDOM(`${response.data}`);

			dom.window.document.querySelectorAll('.vs-product-card').forEach((item) => {
				let name = '';
				let price = '';
				let link = '';

				link = item.querySelector('a').getAttribute('href');
				item.querySelectorAll('.vs-product-card-title').forEach(
					(a) => (name = a.querySelector('a').innerHTML.trim())
				);
				item.querySelectorAll('.vs-product-card-prices-price').forEach(
					(div) => (price = div.getAttribute('data-price'))
				);

				if (!item.querySelector('.vs-product-card-follow')) {
					console.log(
						colors.green(
							`🟢 [STOCK] - ${name} - ${price} € - {https://www.vsgamers.es${link}}`
						)
					);
					if (!checked.includes(name)) {
						open(`https://www.vsgamers.es${link}`);
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
