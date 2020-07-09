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

    function addPatient(string memory _name, string memory _phone, string memory _email) public{
        if(msg.sender == owner){
            if(!patientExists[_phone]){
                patientCount++;
                patients[_phone].patientId = patientCount;
                patients[_phone].patientName = _name;
                patients[_phone].phone = _phone;
                patients[_phone].email = _email;
                patients[_phone].doctorsVisitedCount = 0;
                patientExists[_phone] = true;
            }
        }
    }

    function getPatient(string memory _phone) public view returns (uint _patientId, string memory _name, string memory _email, uint _doctorsVisitedCount, uint[] memory _prescription, address[] memory  _doctorsVisited){
        if(patientExists[_phone]){
            // _patientId = patients[_phone].patientId;
            // _name = patients[_phone].patientName;
            // _email = patients[_phone].email;
            // _doctorsVisitedCount = patients[_phone].doctorsVisitedCount;
            // uint[] memory pris = new uint[](patients[_phone].doctorsVisitedCount);
            // for(uint i = 0;i<patients[_phone].doctorsVisitedCount;i++){
            //         pris[i] = patients[_phone].prescription[i];
            // }
            // _prescription = pris;
            bool flag = false;
            for(uint i = 0;i<patients[_phone].doctorsVisitedCount;i++){
                if(patients[_phone].doctorsVisited[i] == msg.sender)
                {
                    flag = true;
                }
            }
            if(flag){
                _patientId = patients[_phone].patientId;
                _name = patients[_phone].patientName;
                _email = patients[_phone].email;
                _doctorsVisitedCount = patients[_phone].doctorsVisitedCount;
                uint[] memory pris = new uint[](patients[_phone].doctorsVisitedCount);
                for(i = 0;i<patients[_phone].doctorsVisitedCount;i++){
                        pris[i] = patients[_phone].prescription[i];
                }
                _prescription = pris;
            }
            else if(msg.sender == owner){
                _patientId = patients[_phone].patientId;
                _name = patients[_phone].patientName;
                _email = patients[_phone].email;
                _doctorsVisitedCount = patients[_phone].doctorsVisitedCount;
                uint[] memory pris_own = new uint[](patients[_phone].doctorsVisitedCount);
                address[] memory docs_own = new address[](patients[_phone].doctorsVisitedCount);
                for(uint l = 0;l<patients[_phone].doctorsVisitedCount;l++){
                        pris_own[l] = patients[_phone].prescription[l];
                }
                _prescription = pris_own;
                for(uint j = 0;j<patients[_phone].doctorsVisitedCount;j++){
                        docs_own[j] = patients[_phone].doctorsVisited[j];
                }
                _doctorsVisited = docs_own; 
            }
        }
        else{
            _patientId = 0;
            _name = "null";
            _email = "null";
            _doctorsVisitedCount = 0;
        }
    }
}