const path = require('path');
const fs   = require('fs');
const solc = require('solc');

const lotteryPath = path.resolve(__dirname, 'contract','Lottery.sol');
const source    = fs.readFileSync(lotteryPath,'utf8');

const temp = solc.compile(source, 1).contracts[':Lottery'];
//console.log("temp = " + temp);

module.exports = temp;
