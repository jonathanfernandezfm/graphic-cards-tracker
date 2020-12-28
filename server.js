const axios = require('axios');
const open = require('open');
const pccomponentes = require('./pccomponentes.json');
const sleep = require('await-sleep');
const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const VERSUS_URLS = [
  '?filter-modelo=rtxr-3060-ti-1268&_=1609186482495',
  '?filter-modelo=rtxr-3070-1224&_=1609188222878',
  '?filter-modelo=rtxr-3080-1225&_=1609188222880',
] 

const checkAvailabilityPccom = async (id, name, link) => {
  const linkAva = `${pccomponentes.urlAvailability}${id}`;
  const {data} = await axios.get(linkAva)

  if(data.availability.status === 'outOfStock'){
    // console.log(`\x1b[31m[NO STOCK] - ${name} - ${data.priceIntegerPart} €\x1b[0m `);
  }else {
    console.log(`\x1b[32m[STOCK ${data.availability.realStock}] - ${name} - ${data.priceIntegerPart} €\x1b[0m `);
    open(`${pccomponentes.url}${link}`);
  }
}

const versus = async (filters) => {
  const response = await axios.get(`https://www.vsgamers.es/category/componentes/tarjetas-graficas/5${filters}`); //todo
  const dom = new JSDOM(`${response.data}`);


  dom.window.document.querySelectorAll(".vs-product-card").forEach((item) => {
    let name = "";
    let price = "";
    item.querySelectorAll(".vs-product-card-title").forEach(a=>name = a.querySelector("a").innerHTML)
    item.querySelectorAll(".vs-product-card-prices-price").forEach(div=> price = div.getAttribute("data-price"))

    if(item.querySelector(".vs-product-card-follow")) {
      // console.log(`\x1b[31m[NO STOCK] - ${name} - ${price} €\x1b[0m `);
    } else {
      console.log(`\x1b[32m[STOCK] - ${name} - ${price} €\x1b[0m `);
    }
  })
}

setInterval(() => {
  pccomponentes.tracking.forEach(async ({id, name, link}, index) => {
    console.log("\x1b[36m PCCOMPONENTES CHECKING");
    checkAvailabilityPccom(id, name, link);
  })
}, 120000);

setInterval(async () => {
  for (const url of VERSUS_URLS) {
    console.log("\x1b[36m VERSUS CHECKING");
    await versus(url);
  }
}, 120000)
