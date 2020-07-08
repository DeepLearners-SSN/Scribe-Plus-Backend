const fs = require('fs-extra');
const { web3 } = require('./deploy.js');



const getContractObject = () => {
    const contractReceipt = require('./build/eth-receipt.json');
    const compiledContract = require('./build/Message.json');
    return new web3.eth.Contract(JSON.parse(compiledContract.interface),contractReceipt.address);
}

const getMessage = async() => {
    const contractObject = getContractObject();
    const accounts = await web3.eth.getAccounts();
    const result = await contractObject.methods
                   .getGreet()
                   .call({from:accounts[2]});
    console.log(result);
    return result;

}

const createDoctor = async(name, phno, email, password) =>{
    console.log("CREATE DOCTOR : ",name,phno,email,password);
    const count = await getDocCount();
    const id = (parseInt(count,10) + 1) * 2;
    const contractObject = getContractObject();
    return web3.eth.getAccounts().then(async (accounts) => {
        let hash = {}
      await  contractObject.methods.addDoctor(name, phno, email, password, accounts[id]).send({from:accounts[0],gas:'1000000'},(err,thash) => {
           console.log(thash,accounts[id]);
           hash = thash;
        });
        return {account:accounts[id],hash:hash};
    });

}

const getDoctor = async(address) =>{
    console.log("GET DOCTOR : ",address);
    const contractObject = getContractObject();
    return await contractObject.methods.getDoctor(address).call().then((doc) => {return doc});
}

const getDocCount  = async() => {
    const contractObject = getContractObject();
    return await contractObject.methods.doctorCount().call().then((c) => { return c });
}

module.exports.getMessage = getMessage;
module.exports.getDocCount = getDocCount;
module.exports.createDoctor = createDoctor;
module.exports.getDoctor = getDoctor;