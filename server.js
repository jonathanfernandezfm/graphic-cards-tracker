const pccomponentes_json = require('./index/pccomponentes.json');
const colors = require('colors');
const { coolmod } = require('./services/coolmod');
const { versus } = require('./services/versusgamers');
const { pccomponentes } = require('./services/pccomponentes');
const config = require('./config/config.json');

setInterval(() => {
	console.log(colors.cyan('🟠 PCCOMPONENTES'));
	if (pccomponentes_json.tracking)
		if (pccomponentes_json.tracking.length == 0)
			console.log("Missing index. Generate it with 'npm run indexs'");

	pccomponentes_json.tracking.forEach(async ({ id, name, link }, index) => {
		pccomponentes(id, name, link);
	});
}, 15000);

setInterval(async () => {
	console.log(colors.cyan('🟢 VERSUS GAMERS'));
	for (const url of config.VERSUS_URL) {
		versus(url);
	}
}, 15000);

// COOLMOD
setInterval(async () => {
	console.log(colors.cyan('🔵 COOLMOD'));
	coolmod();
}, 15000);
