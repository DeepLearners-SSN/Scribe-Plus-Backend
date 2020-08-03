const io = require("socket.io-client");

let socket = io.connect("http://72fbc7e761a8.ngrok.io");

socket.on('message',(data) => {
    console.log("recieved : ",data);
});
socket.on('1596270583357',(dataJson) => {
    console.log("DATA FROM OTHER CLIENT : ",dataJson)
});