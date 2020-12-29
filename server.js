const axios = require('axios');
const open = require('open');
const pccomponentes = require('./pccomponentes.json');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

var checked = [];

const VERSUS_URLS = [
  '?filter-modelo=rtxr-3060-ti-1268&_=1609186482495',
  '?filter-modelo=rtxr-3070-1224&_=1609188222878',
  '?filter-modelo=rtxr-3080-1225&_=1609188222880',
] 

const checkAvailabilityPccom = async (id, name, link) => {
  const linkAva = `${pccomponentes.urlAvailability}${id}`;
  const {data} = await axios.get(linkAva)

  if(data.availability.status === 'outOfStock'){
    if(checked.includes(name)){ 
      checked = checked.filter(a=>a!=name);
    }
  }else {
    console.log(`\x1b[32m[STOCK ${data.availability.realStock}] - ${name} - ${data.priceIntegerPart} € {${pccomponentes.url}${link}}\x1b[0m`);
    if(!checked.includes(name)){ 
      open(`${pccomponentes.url}${link}`);
      checked.push(`${name}`)
    };
  }
}

const versus = async (filters) => {
  const response = await axios.get(`https://www.vsgamers.es/category/componentes/tarjetas-graficas/5${filters}`); //todo
  const dom = new JSDOM(`${response.data}`);

  dom.window.document.querySelectorAll(".vs-product-card").forEach((item) => {
    let name = "";
    let price = "";
    let link = "";

    link = item.querySelector("a").getAttribute("href");
    item.querySelectorAll(".vs-product-card-title").forEach(a=>name = a.querySelector("a").innerHTML.trim())
    item.querySelectorAll(".vs-product-card-prices-price").forEach(div=> price = div.getAttribute("data-price"))

    if(!item.querySelector(".vs-product-card-follow")) {
      console.log(`\x1b[32m[STOCK] - ${name} - ${price} € - {https://www.vsgamers.es${link}}\x1b[0m`);
      if(!checked.includes(name)){ 
        open(`https://www.vsgamers.es${link}`);
        checked.push(`${name}`)
      };
    } else {
      if(checked.includes(name)){ 
        checked = checked.filter(a=>a!=name);
      }
    }
  })
}

const coolmod = async () => {
  const response = await axios.get(`https://www.coolmod.com/tarjetas-gr%C3%A1ficas?f=571::RTX%203080||571::RTX%203070||571::RTX%203060`); //todo
  const dom = new JSDOM(`${response.data}`);

  dom.window.document.querySelectorAll(".item-product").forEach((item) => {
    let name = "";
    let price = "";
    let link = "";

    name = item.querySelector(".product-name").querySelector("a").innerHTML.trim().replace(/<\/?span[^>]*>/g , '');
    link = item.querySelector(".product-name").querySelector("a").getAttribute("href");
    price = item.querySelector(".mod-featured-prices-container").querySelector("div.margin-top-20").innerHTML.trim();

    if(item.querySelector(".cat-product-availability").innerHTML.trim() !== 'Sin Stock') {
      console.log(`\x1b[32m[STOCK] - ${name} - ${price} € - {https://www.coolmod.com${link}}\x1b[0m`);
      if(!checked.includes(name)){ 
        open(`https://www.coolmod.com${link}`);
        checked.push(`${name}`)
      };
    } else {
      if(checked.includes(name)){ 
        checked = checked.filter(a=>a!=name);
      }
    }
  })
}

setInterval(() => {
  console.log("\x1b[36mCHECKING PCCOMPONENTES\x1b[0m");
  pccomponentes.tracking.forEach(async ({id, name, link}, index) => {
    checkAvailabilityPccom(id, name, link);
  })
}, 60000);

setInterval(async () => {
  console.log("\x1b[36mCHECKING VERSUS\x1b[0m");
  for (const url of VERSUS_URLS) {
    await versus(url);
  }
}, 60000)

setInterval(async () => {
  console.log("\x1b[36mCHECKING COOLMOD\x1b[0m");
  await coolmod();
}, 60000)