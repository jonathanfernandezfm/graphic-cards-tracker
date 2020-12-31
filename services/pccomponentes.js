const axios = require('axios');
const open = require('open');
const pccomponentes_json = require('../index/pccomponentes.json');

var checked = [];

module.exports = {
  pccomponentes: async (id, name, link) => {
    const linkAva = `${pccomponentes_json.urlAvailability}${id}`;
    const {data} = await axios.get(linkAva)
  
    if(data.availability.status === 'outOfStock'){
      if(checked.includes(name)){ 
        checked = checked.filter(a=>a!=name);
      }
    }else {
      console.log(`\x1b[32m[STOCK ${data.availability.realStock}] - ${name} - ${data.priceIntegerPart} € {${pccomponentes_json.url}${link}}\x1b[0m`);
      if(!checked.includes(name)){ 
        open(`${pccomponenpccomponentes_jsontes.url}${link}`);
        checked.push(`${name}`)
      };
    }
  }
}