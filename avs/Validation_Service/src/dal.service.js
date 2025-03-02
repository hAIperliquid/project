require('dotenv').config();
const axios = require("axios");

var ipfsHost='';

function init() {
  ipfsHost = process.env.IPFS_HOST;
}

async function getIPfsTask(cid) {
    const res = await axios.get(ipfsHost + cid);
    return res.data;
  }  
  
module.exports = {
  init,
  getIPfsTask
}