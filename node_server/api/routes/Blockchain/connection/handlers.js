const fs = require('fs-extra');
const { web3, accounts } = require('./deploy.js');



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
    try{
        return await contractObject.methods.getDoctor(address).call().then((doc) => {return doc});
   }
    catch(e){
        return e;
    }
    
}

const getDocCount  = async() => {
    const contractObject = getContractObject();
    return await contractObject.methods.doctorCount().call().then((c) => { return c });
}

const getPatCount  = async() => {
    const contractObject = getContractObject();
    return await contractObject.methods.patientCount().call().then((c) => { return c });
}

const createPatient = async(name, phno, email) =>{
    console.log("CREATE PATIENT : ",name,phno,email);
    const contractObject = getContractObject();
    return web3.eth.getAccounts().then(async (accounts) => {
        let hash = {}
        console.log(accounts[0]);
        await  contractObject.methods.addPatient(name, phno, email).send({from:accounts[0],gas:'1000000'},(err,thash) => {
            console.log(thash,phno);
            hash = thash;
            });
        return {account:phno,hash:hash};
    });
}

const getPatient = async(phone,address) =>{
    console.log("GET PATIENT : ",phone);
    const contractObject = getContractObject();
    try{
        await  contractObject.methods.getPatient(phone).call({from:accounts[0]}).then((patient) => {
            console.log("PAT : ",patient);
            return result;
        });
        

   }
    catch(e){
        return e;
    }
    
}

module.exports.getMessage = getMessage;
module.exports.getDocCount = getDocCount;
module.exports.createDoctor = createDoctor;
module.exports.getDoctor = getDoctor;
module.exports.createPatient = createPatient;
module.exports.getPatient = getPatient;
module.exports.patientCount = getPatCount;