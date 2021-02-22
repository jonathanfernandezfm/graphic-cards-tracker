const axios = require('axios');
const open = require('open');
const colors = require('colors');
const pccomponentes_json = require('../index/pccomponentes.json');

var checked = [];

module.exports = {
	pccomponentes: async (id, name, link) => {
		const linkAva = `${pccomponentes_json.urlAvailability}${id}`;
		const { data } = await axios.get(linkAva);

		if (data.availability.status === 'outOfStock') {
			if (checked.includes(name)) checked = checked.filter((a) => a != name);
		} else {
			if (!checked.includes(name)) {
				console.log(
					colors.green(
						`🟠 [STOCK ${data.availability.realStock}] - ${name} - ${data.priceIntegerPart} € {${pccomponentes_json.url}${link}}`
					)
				);
				open(`${pccomponentes_json.url}${link}`);
				checked.push(`${name}`);
			}
		}
	},
};
