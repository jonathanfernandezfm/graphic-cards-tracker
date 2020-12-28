const axios = require('axios');
const open = require('open');
const pccomponentes = require('./pccomponentes.json');
const sleep = require('await-sleep');

const checkAvailabilityPccom = async (id, slug) => {
  const link = `${pccomponentes.urlAvailability}${id}`;
  const {data} = await axios.get(link)

  if(data.availability.status === 'outOfStock')
    console.log(`\x1b[31m[NO STOCK] - ${slug} - ${data.priceIntegerPart} €\x1b[0m `);
  else {
    console.log(`\x1b[32m[STOCK ${data.availability.realStock}] - ${slug} - ${data.priceIntegerPart} €\x1b[0m `);
    open(`${pccomponentes.url}/${slug}`);
  }
}

setInterval(() => {
  pccomponentes.tracking.forEach(async ({id, slug}, index) => {
    await sleep(200*index);
    checkAvailabilityPccom(id, slug);
  })
}, 120*1000);
