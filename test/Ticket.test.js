const { web3, upgrades } = require('hardhat');
const assert = require('assert');
const compiledFactory = require('../artifacts/contracts/Factory.sol/Factory.json');
const compiledProxy = require('../artifacts/contracts/Proxy.sol/Proxy.json');
const compiledTicket = require('../artifacts/contracts/Ticket.sol/Ticket.json');


let accounts;
let Ticket;
let ticket;
let Proxy;
let proxy;
let Factory;
let factory;
let lotteries;
let proxies;
let singleLottery;
let proxyInstance;
let winner;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

});

describe("Contracts", () => {
    it('Deploys Factory contract successfully', async () => {
        Factory = await new web3.eth.Contract(compiledFactory.abi)
                                .deploy({
                                    data: compiledFactory.bytecode
                                })
                                .send({
                                    from: accounts[0],
                                    gas: '5000000'
                                });
        assert.ok(Factory.options.address);
    });

    it('Deploys Ticket contract successfully', async () => {
        Ticket = await new web3.eth.Contract(compiledTicket.abi)
                                .deploy({
                                    data: compiledTicket.bytecode
                                })
                                .send({
                                    from: accounts[0],
                                    gas: '5000000'
                                });
        assert.ok(Ticket.options.address);
    });

    it('Deploys Proxy contract successfully', async () => {
        await Factory.methods.createProxy().send({from: accounts[0]});
        Proxy = await Factory.methods.getProxy().call();
        assert.ok(Proxy);
    });


    it('Buys ticket successfully', async () => {
        proxyInstance = new web3.eth.Contract(compiledProxy.abi, Proxy[0]);
        await proxyInstance.methods.callInit(Ticket.options.address, accounts[0]).send({from: accounts[0]});

        await proxyInstance.methods.callBuyTicket(Ticket.options.address)
                                    .send({
                                        value: web3.utils.toWei('1', 'ether'),
                                        from: accounts[1]});
        await proxyInstance.methods.callBuyTicket(Ticket.options.address)
                                    .send({
                                        value: web3.utils.toWei('1', 'ether'),
                                        from: accounts[2]});
        await proxyInstance.methods.callBuyTicket(Ticket.options.address)
                                    .send({
                                        value: web3.utils.toWei('1', 'ether'),
                                        from: accounts[3]});
        await proxyInstance.methods.callBuyTicket(Ticket.options.address)
                                    .send({
                                        value: web3.utils.toWei('1', 'ether'),
                                        from: accounts[4]});
    });

    it('Picks winner successfully', async () => {
        winner = await proxyInstance.methods.callPickWinner(Ticket.options.address).send({
            from: accounts[0]
        });

        assert(winner);
    })
})