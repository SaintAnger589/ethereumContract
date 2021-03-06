const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

//console.log("inside lottery test");

const {interface, bytecode} = require('../compile');

//console.log("Back to lottery test");
//console.log("interface = " + interface);

let lottery;
let accounts;


beforeEach(async() => {
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(JSON.parse(interface))
            .deploy({data : bytecode})
            .send({from: accounts[0], gas: '1000000'});
});

  describe ('lottery', () => {
    it ('deploys a contract', () => {
      //console.log("inside deploy");
      //console.log(lottery);
      assert.ok(lottery.options.address);
    });

    it('allows one account to enter', async () => {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei('0.02', 'ether')
      });

      const players = await lottery.methods.getPlayers().call({
        from: accounts[0]
      });

      assert.equal(accounts[0], players[0]);
      assert.equal(1,players.length);
    });

    //asserting multiple players enters
    it('allows multiple account to enter', async () => {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei('0.02', 'ether')
      });
      await lottery.methods.enter().send({
        from: accounts[1],
        value: web3.utils.toWei('0.03', 'ether')
      });

      const players = await lottery.methods.getPlayers().call({
        from: accounts[0]
      });

      assert.equal(accounts[0], players[0]);
      assert.equal(accounts[1], players[1]);
      assert.equal(2,players.length);
    });

    it('requires minimum amount of ether to enter', async() => {
      try{
        await lottery.methods.enter().send({
          from: accounts[0],
          value: '2'
        });
        assert(false);
      } catch(err){
        assert(err);
      }
    });

    it('only manager calls pickwinner', async() => {
      try{
        await lottery.methods.pickWinner().send({
          from: accounts[1],
          //value: web3.utils.toWei('0.02','ether')
        });
        assert(false);
      } catch(err) {
        assert(err);
      }
    });

    it ('sends money to winner and reset', async() => {
      await lottery.methods.enter().send({
        from: accounts[3],
        value: web3.utils.toWei('2', 'ether')
      });
      const initialBalance = await web3.eth.getBalance(accounts[3]);

      await lottery.methods.pickWinner().send({
        from: accounts[0],
        //value: web3.utils.toWei('0.02','ether')
      });

      const finalBalance = await web3.eth.getBalance(accounts[3]);

      const players = await lottery.methods.getPlayers().call({
        from: accounts[0]
      });

      console.log("players = " + players.length);

      assert.equal(0,players.length);
      const difference = finalBalance - initialBalance;
      console.log("difference = " + difference);
      assert(difference > web3.utils.toWei('1.5','ether'));




    })

  });
