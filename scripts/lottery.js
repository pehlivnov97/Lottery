const { web3 } = require('hardhat');

const compiledProxy = require('../artifacts/contracts/Proxy.sol/Proxy.json');
const compiledFactory = require('../artifacts/contracts/Factory.sol/Factory.json');
const compiledTicket = require('../artifacts/contracts/Ticket.sol/Ticket.json');

async function deploy() {
    const accounts = await web3.eth.getAccounts();

    const Factory = await new web3.eth.Contract(compiledFactory.abi)
                                    .deploy({
                                        data: compiledFactory.bytecode
                                    })
                                    .send({
                                        from: accounts[0],
                                        gas: '5000000'
                                    });

    const Ticket = await new web3.eth.Contract(compiledTicket.abi)
                                    .deploy({
                                        data: compiledTicket.bytecode
                                    })
                                    .send({
                                        from: accounts[0],
                                        gas: '5000000'
                                    });

    await Factory.methods.createProxy().send({from: accounts[0]});
    const Proxy = await Factory.methods.getProxy().call();

    const proxyInstance = new web3.eth.Contract(compiledProxy.abi, Proxy[0]);

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


    console.log('Participents ', await proxyInstance.methods.callGetParticipants(Ticket.options.address).call());
    const fund = await proxyInstance.methods.callGetFund(Ticket.options.address).call();
    console.log(`Fund ${web3.utils.fromWei(fund, 'ether')} ether`);
    await proxyInstance.methods.callPickWinner(Ticket.options.address).send({
        from: accounts[0]
    });

}

deploy();