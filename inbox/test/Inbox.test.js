const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();

const web3 = new Web3(provider);

const {interface, bytecode} = require('../compile');

//====================
//simele test
// class Car {
//   park() {
//     return 'stopped';
//   }
//
//   drive() {
//     return 'vroom';
//   }
// }
// let car;
// beforeEach(() => {
//     car = new Car();
// });
// describe ('Car', () => {
//   it ('can park', () => {
//     assert.equal(car.park(),'stopped');
//   });
//
//   it ('can drive',() => {
//     assert.equal(car.drive(),'vroom')
//   });
// });
//


// ===============================================
//with promise
// beforeEach (() => {
//
//   //get the list of all accounts
//   web3.eth.getAccounts()
//     .then(fetchedAccounts => {
//       console.log(fetchedAccounts);
//     });
//
//   //use one of the accounts to deploy the contracts
//
// });
//=====================================================
let accounts;
let inbox;
const INITIAL_STRING = 'Hi There';
const message2 = 'Bye Bye';

beforeEach (async () => {

  //get the list of all accounts
  accounts = await web3.eth.getAccounts();

  //use one of the accounts to deploy the contracts
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments : [INITIAL_STRING]})
    .send({ from: accounts[0], gas: '1000000' });

    inbox.setProvider(provider);

});

describe ('inbox', () => {
  it ('deploy the contracts', () => {
    assert.ok(inbox.options.address);

  });

  it ('has a default message', async () => {
    const message  = await inbox.methods.message().call();
    assert.equal(message, INITIAL_STRING);
  });

  it ('can change the message', async () => {
    await inbox.methods.setMessage(message2).send({ from: accounts[0], gas: '1000000' });
    const message  = await inbox.methods.message().call();
    assert.equal(message, message2);
  });

});
