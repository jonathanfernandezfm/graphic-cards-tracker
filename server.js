const axios = require('axios');
const open = require('open');
const pccomponentes = require('./pccomponentes.json');
const sleep = require('await-sleep');
const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const checkAvailabilityPccom = async (id, name, link) => {
  const linkAva = `${pccomponentes.urlAvailability}${id}`;
  const {data} = await axios.get(linkAva)

  if(data.availability.status === 'outOfStock')
    console.log(`\x1b[31m[NO STOCK] - ${name} - ${data.priceIntegerPart} €\x1b[0m `);
  else {
    console.log(`\x1b[32m[STOCK ${data.availability.realStock}] - ${name} - ${data.priceIntegerPart} €\x1b[0m `);
    open(`${pccomponentes.url}${link}`);
  }
}

setInterval(() => {
  pccomponentes.tracking.forEach(async ({id, name, link}, index) => {
    await sleep(200*index);
    checkAvailabilityPccom(id, name, link);
  })
}, 120*1000);
