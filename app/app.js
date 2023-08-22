const express = require('express');
const path = require('path');
const app = express();
const redis = require('redis')
const appid = process.env.APPID
const server = app.listen(appid,
    () => console.log('chat server on port ' + appid));

const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public')));

const subscriber = redis.createClient({
    port: 6379,
    host: 'rds'
});

const publisher = redis.createClient({
    port: 6379,
    host: 'rds'
});


subscriber.on("message", function(channel, message) {
    io.sockets.emit('chat-message', message);
});
subscriber.subscribe("livechat");



socketsConnected = new Set()

io.on('connection', onConnectd)

function onConnectd(socket) {
    console.log(appid);
    socketsConnected.add(socket.id);

    io.emit('clients-total', socketsConnected.size);

    socket.on('disconnect', () => {
        socketsConnected.delete(socket.id);
        io.emit('clients-total', socketsConnected.size);
    })

    socket.on('message', (data) => {

        publisher.publish("livechat", data.utf8Data)

    })

    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data);
    })
}