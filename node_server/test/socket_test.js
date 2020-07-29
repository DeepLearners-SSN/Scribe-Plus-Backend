const io = require("socket.io-client");

let socket = io.connect("http://13.234.75.146:5000/");

socket.on('message',(data) => {
    console.log("recieved : ",data);
});
socket.on('1595785935038',(dataJson) => {
    console.log("DATA FROM OTHER CLIENT : ",dataJson)
});