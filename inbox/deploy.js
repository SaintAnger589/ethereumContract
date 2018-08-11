const HDWalletProvider = require ('truffle-hdwallet-provider');
const Web3 = require('web3');
const {interface, bytecode} = require('./compile');

const provider = new HDWalletProvider(
  'bitter embrace decide winter bring february energy grain input speak dinner tail',
  'https://rinkeby.infura.io/19cc6c155da44d9192db9ec44f2b9530'
);

const web3 = new Web3(provider);

//used for using the async syntax. async can be done only inside a function
const deploy = async () => {
  //we have to do 2 things get the accounts, deploy the account and send the ether
  const  accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
  .deploy({ data: '0x' + bytecode, arguments : ['Hi There !!!'] })
  .send({ gas: '3000000', from: accounts[0] });

  console.log('Contract deployes to  : ', result.options.address);

};

//call to deploy function
deploy ();
