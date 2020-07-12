const io = require("socket.io-client");

let socket = io.connect("http://13.234.64.136:5000/");

socket.on('message',(data) => {
    console.log("recieved : ",data);
});
socket.on('1594485638429',(dataJson) => {
    console.log("DATA FROM OTHER CLIENT : ",dataJson)
});