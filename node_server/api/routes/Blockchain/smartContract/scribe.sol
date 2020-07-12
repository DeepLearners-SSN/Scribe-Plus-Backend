pragma solidity ^0.4.25;

contract Scribe {
    uint public doctorCount;
    uint public patientCount;
    uint public prescriptionCount;
    address owner;

    struct Doctor{
        uint doctorId;
        string doctorName;
        address doctorAddress;
        uint phno;
        string email;
        string password;
    }
    struct Patient{
        uint patientId;
        string patientQrCode;
        string patientName;
        string phone;
        string email;
        uint doctorsVisitedCount;
        address[] doctorsVisited;
        uint[] prescription;
    }
    struct Prescription{
        uint prescriptionId;
        string medicines;
        string symptoms;
        string diagnosis;
        string advice;
        string date;
        address doctor;
    }

    mapping(address=>Doctor)  doctors;
    mapping(address=>bool) doctorExists;
    mapping(string=>Patient)  patients;
    mapping(string=>bool) patientExists;
    mapping(uint=>Prescription) prescriptions;


    constructor() public {
        owner = msg.sender;
    }

    function addDoctor(string memory _name, uint _phno, string memory _email,  string memory _password, address _address) public {
        if(msg.sender == owner){
           if(!doctorExists[_address]){
                doctorCount++;
                doctors[_address] = Doctor(doctorCount,_name,_address,_phno,_email,_password);
                doctorExists[_address] = true;
        }
        }
    }

    function getDoctor(address _address) public view returns (uint _doctorId, string memory _name, uint _phno, string memory _email, string memory _password){
        if(doctorExists[_address]){
            _doctorId = doctors[_address].doctorId;
            _name = doctors[_address].doctorName;
            _phno = doctors[_address].phno;
            _email = doctors[_address].email;
            _password = doctors[_address].password;
        }
    }

    function addPatient(string memory _name, string memory _phone, string memory _email, string memory _patientQrCode) public{
        if(msg.sender == owner){
            if(!patientExists[_patientQrCode]){
                patientCount++;
                patients[_patientQrCode].patientId = patientCount;
                patients[_patientQrCode].patientName = _name;
                patients[_patientQrCode].phone = _phone;
                patients[_patientQrCode].email = _email;
                patients[_patientQrCode].doctorsVisitedCount = 0;
                patients[_patientQrCode].patientQrCode = _patientQrCode;
                patientExists[_patientQrCode] = true;
            }
        }
    }

    function getPatient(string memory _patientQrCode) public view returns (uint _patientId, string memory _name, string memory _email, string memory _phone, uint _doctorsVisitedCount, uint[] memory _prescription, address[] memory  _doctorsVisited){
        if(patientExists[_patientQrCode]){
            bool flag = false;
            for(uint i = 0;i<patients[_patientQrCode].doctorsVisitedCount;i++){
                if(patients[_patientQrCode].doctorsVisited[i] == msg.sender)
                {
                    flag = true;
                }
            }
            if(flag){
                _patientId = patients[_patientQrCode].patientId;
                _name = patients[_patientQrCode].patientName;
                _email = patients[_patientQrCode].email;
                _doctorsVisitedCount = patients[_patientQrCode].doctorsVisitedCount;
                _phone = patients[_patientQrCode].phone;
                uint[] memory pris = new uint[](patients[_patientQrCode].doctorsVisitedCount);
                for(i = 0;i<patients[_patientQrCode].doctorsVisitedCount;i++){
                        pris[i] = patients[_patientQrCode].prescription[i];
                }
                _prescription = pris;
            }
            else if(msg.sender == owner){
                _patientId = patients[_patientQrCode].patientId;
                _name = patients[_patientQrCode].patientName;
                _email = patients[_patientQrCode].email;
                _phone = patients[_patientQrCode].phone;
                _doctorsVisitedCount = patients[_patientQrCode].doctorsVisitedCount;
                uint[] memory pris_own = new uint[](patients[_patientQrCode].doctorsVisitedCount);
                address[] memory docs_own = new address[](patients[_patientQrCode].doctorsVisitedCount);
                for(i = 0;i<patients[_patientQrCode].doctorsVisitedCount;i++){
                        pris_own[i] = patients[_patientQrCode].prescription[i];
                }
                _prescription = pris_own;
                for(i = 0;i<patients[_patientQrCode].doctorsVisitedCount;i++){
                        docs_own[i] = patients[_patientQrCode].doctorsVisited[i];
                }
                _doctorsVisited = docs_own; 
            }
            else{
            _patientId = 0;
            _name = "newDoctor";
            _email = "newDoctor";
            _doctorsVisitedCount = 0;
            _phone = patients[_patientQrCode].phone;
            }
        }
        else{
            _patientId = 0;
            _name = "null";
            _email = "null";
            _doctorsVisitedCount = 0;
        }
    }

    function createPrescription(string memory _medicines, string memory _symptoms, string memory _diagnosis, string memory _advice, string memory _date, string memory _patientQrCode) public {
        if(patientExists[_patientQrCode]){
            if(doctorExists[msg.sender]){
                prescriptionCount++;
                prescriptions[prescriptionCount] = Prescription(prescriptionCount, _medicines, _symptoms, _diagnosis, _advice, _date, msg.sender);
                patients[_patientQrCode].doctorsVisitedCount += 1;
                patients[_patientQrCode].doctorsVisited.push(msg.sender);
                patients[_patientQrCode].prescription.push(prescriptionCount);
            }
        }
    }

    function getPrescription(uint prescriptionId,string memory _patientQrCode) public view returns (uint _prescriptionId, string memory _medicines, string memory _symptoms, string memory _diagnosis, string memory _advice, string memory _date, string memory _doctorName){
        if(patientExists[_patientQrCode]){
            bool flag = false;
            for(uint i = 0;i<patients[_patientQrCode].doctorsVisitedCount;i++){
                if(patients[_patientQrCode].doctorsVisited[i] == msg.sender)
                {
                    flag = true;
                }
            }
            if(flag){
                _prescriptionId = prescriptionId;
                _medicines = prescriptions[prescriptionId].medicines;
                _symptoms = prescriptions[prescriptionId].symptoms;
                _diagnosis = prescriptions[prescriptionId].diagnosis;
                _advice = prescriptions[prescriptionId].advice;
                _date = prescriptions[prescriptionId].date;
                _doctorName = doctors[msg.sender].doctorName;
            }
            else{
                _doctorName = "Verify OTP first!";
            }
        }
        else{
            _doctorName = "Patient Does Not Exist";
        }
    }
}