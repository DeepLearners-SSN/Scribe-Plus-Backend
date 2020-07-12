const fs = require('fs-extra');
const { web3, accounts } = require('./deploy.js');
const { prescriptionSchema } = require('../../Patient/patient_schema.js');



const getContractObject = () => {
    const contractReceipt = require('./build/eth-receipt.json');
    const compiledContract = require('./build/Message.json');
    return new web3.eth.Contract(JSON.parse(compiledContract.interface),contractReceipt.address);
}

const getAccounts = () => {
   return  web3.eth.getAccounts().then(async (accounts) => {
       return accounts;
   });
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
    const id = (parseInt(count,10) + 1);
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

const createPatient = async(name, phno, email, patientQrCode) =>{
    console.log("CREATE PATIENT : ",name,phno,email);
    const contractObject = getContractObject();
    return web3.eth.getAccounts().then(async (accounts) => {
        let hash = {}
        console.log(accounts[0]);
        await  contractObject.methods.addPatient(name, phno, email, patientQrCode).send({from:accounts[0],gas:'1000000'},(err,thash) => {
            console.log(thash,phno);
            hash = thash;
            });
        return {account:patientQrCode,hash:hash};
    });
}

const getPatient = async(patientQrCode,address) =>{
    console.log("GET PATIENT : ",patientQrCode);
    const contractObject = getContractObject();
    try{
        return await  contractObject.methods.getPatient(patientQrCode).call({from:address}).then((patient) => {
            console.log("PAT : ",patient);
            return patient;
        });
        

   }
    catch(e){
        return e;
    }
    
}


const getPatientForAdmin = async(patientQrCode,address) =>{
    try{
        console.log("GET PATIENT : ",patientQrCode);
        const contractObject = getContractObject();
        return web3.eth.getAccounts().then(async (accounts) => {
            return await contractObject.methods.getPatient(patientQrCode).call({from:accounts[0]}).then((patient) => {
                console.log("PAT : ",patient);
                return {id:patient[0], name:patient[1], email:patient[2], phone:patient[3], doctorVisited:patient[4], doctorsVisited:patient[6]};
            });     
        });
   }
    catch(e){
        return e;
    }
    
}


const createPrescription = async(medicines, symptoms, diagnosis, advice, patientQrCode, doctorAddress) => {
    try{
        console.log("CREATE PRESCRIPTION : ",patientQrCode);
        const contractObject = getContractObject();
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;
        let hash = "";
        await contractObject.methods.createPrescription(medicines,symptoms,diagnosis,advice,dateTime,patientQrCode).send({from:doctorAddress,gas:'1000000'},(err,thash) => {
            console.log("PRESCRIPTION",thash);
            hash = thash;
            });
        return {hash:hash};
    }
    catch(e){
        return { error:e };
    }
}

const getPrescription = async (prescriptionId, patientQrCode, doctorAddress) => {
    try{
        console.log("GET PRESCRIPTION : ",prescriptionId);
        const contractObject = getContractObject();
        return await contractObject.methods.getPrescription(prescriptionId, patientQrCode).call({from:doctorAddress}).then((prescription) => {
            console.log("PRESCRIPTION : ",prescription);
            return {prescriptionId:prescription["0"], medicines: prescription["1"], symptoms:prescription["2"], diagnosis:prescription["3"], advice:prescription["4"], date:prescription["5"], doctorName:prescription["6"]};
        });
    }
    catch(e){
        return { error:e } ;
    }
}

module.exports.getAccounts = getAccounts;
module.exports.getMessage = getMessage;
module.exports.getDocCount = getDocCount;
module.exports.createDoctor = createDoctor;
module.exports.getDoctor = getDoctor;
module.exports.createPatient = createPatient;
module.exports.getPatient = getPatient;
module.exports.patientCount = getPatCount;
module.exports.getPatientForAdmin = getPatientForAdmin;
module.exports.createPrescription = createPrescription;
module.exports.getPrescription = getPrescription;