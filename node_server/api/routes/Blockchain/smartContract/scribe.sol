pragma solidity ^0.4.25;

contract Scribe {
    uint public doctorCount;
    address owner;
    struct Doctor{
        uint doctorId;
        string doctorName;
        address doctorAddress;
        uint phno;
        string email;
        string password;
    }

    mapping(address=>Doctor) public doctors;
    mapping(address=>bool) public doctorExists;


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
}