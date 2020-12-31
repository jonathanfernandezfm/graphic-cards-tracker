const pccomponentes_json = require('./index/pccomponentes.json');
const { coolmod } = require('./services/coolmod');
const { versus } = require('./services/versusgamers');
const { pccomponentes } = require('./services/pccomponentes')
const config = require('./config/config.json');


setInterval(() => {
  console.log("\x1b[36mCHECKING PCCOMPONENTES\x1b[0m");
  if(pccomponentes_json.tracking) 
    if(pccomponentes_json.tracking.length == 0)
      console.log("Missing index. Generate it with 'npm run indexs'");
  
  pccomponentes_json.tracking.forEach(async ({id, name, link}, index) => {
    pccomponentes(id, name, link);
  })
}, 60000);

setInterval(async () => {
  console.log("\x1b[36mCHECKING VERSUS\x1b[0m");
  for (const url of config.VERSUS_URL) {
    versus(url);
  }
}, 60000)

// COOLMOD
setInterval(async () => {
  console.log("\x1b[36mCHECKING COOLMOD\x1b[0m");
  coolmod();
}, 60000)