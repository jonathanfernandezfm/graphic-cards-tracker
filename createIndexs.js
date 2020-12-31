const axios = require('axios');
const pccomponentes_json = require('./index/pccomponentes.json');
const config = require('./config/config.json');
const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const pccomScrap = async () => {
  let graphics = [];
  for (const url of config.PCCOM_URL) {
    graphics = graphics.concat(await pccom(url, 0));
  }

  console.log("PCCOMPONENTES ENCONTRADAS: ", graphics.length)
  pccomponentes_json.tracking = graphics;
  fs.writeFileSync('pccomponentes.json', JSON.stringify(pccomponentes_json));
}

const pccom = async (url, page) => {
  const response = await axios.get(`${url}&page=${page}`);
  const dom = new JSDOM(`${response.data}`);

  let tracking = [];
  dom.window.document.querySelectorAll("article").forEach((item) => {
    let link = item.querySelectorAll(`[data-id="${item.getAttribute("data-id")}"]`).item(1).getAttribute("href");
    tracking.push({id: item.getAttribute("data-id"), name: item.getAttribute("data-name"), link: link})
  })

  console.log(`PCCOM: Saved ${tracking.length} articles`)
  if(tracking.length != 0) {
    console.log('Calling again');
    tracking = tracking.concat(await pccom(url, page+1));
    return tracking;
  } else {
    return tracking;
  }
}

// PCCOMPONENTES SCRAPPING
pccomScrap();