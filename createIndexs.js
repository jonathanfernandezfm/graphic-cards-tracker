const axios = require('axios');
const pccomponentes = require('./pccomponentes.json');
const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const PCCOM_URLS = [
  'https://www.pccomponentes.com/listado/ajax?idFilters[]=7793&order=relevance&gtmTitle=Tarjetas%20Gr%C3%A1ficas%20GeForce%20RTX%203060%20Series&idFamilies[]=6',
  'https://www.pccomponentes.com/listado/ajax?idFilters[]=7501&order=relevance&gtmTitle=Tarjetas%20Gr%C3%A1ficas%20GeForce%20RTX%203070%20Series&idFamilies[]=6',
  'https://www.pccomponentes.com/listado/ajax?idFilters[]=7498&order=relevance&gtmTitle=Tarjetas%20Gr%C3%A1ficas%20GeForce%20RTX%203080%20Series&idFamilies[]=6',
] 

const pccomScrap = async () => {
  let graphics = [];
  for (const url of PCCOM_URLS) {
    graphics = graphics.concat(await pccom(url, 0));
  }

  console.log("PCCOMPONENTES ENCONTRADAS: ", graphics.length)
  pccomponentes.tracking = graphics;
  fs.writeFileSync('pccomponentes.json', JSON.stringify(pccomponentes));
}

const pccom = async (url, page) => {
  const response = await axios.get(`${url}&page=${page}`);
  const dom = new JSDOM(`${response.data}`);

  let tracking = [];
  dom.window.document.querySelectorAll("article").forEach((item) => {
    let link = item.querySelectorAll(`[data-id="${item.getAttribute("data-id")}"]`).item(1).getAttribute("href");
    tracking.push({id: item.getAttribute("data-id"), name: item.getAttribute("data-name"), link: link})
  })

  console.log(`Saved ${tracking.length} articles`)
  if(tracking.length != 0) {
    console.log('Calling again');
    tracking = tracking.concat(await pccom(url, page+1));
    return tracking;
  } else {
    return tracking;
  }
}

pccomScrap();