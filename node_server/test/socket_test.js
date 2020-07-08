const io = require("socket.io-client");

let socket = io.connect("http://13.234.75.104:5000/");

socket.on('message',(data) => {
    console.log("recieved : ",data);
});
socket.on('1594098288464',(dataJson) => {
    console.log("DATA FROM OTHER CLIENT : ",dataJson)
});