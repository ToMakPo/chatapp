const express = require('express')
const app = express()
let port = process.env.PORT || 3000

app.use(express.static('public'))

var server = app.listen(port)

var socket = require('socket.io')

var io = socket(server)

io.sockets.on('connection', newConnection)

function newConnection(socket) {
    console.log('new connection: ', socket.id)
    
    socket.on('send-msg', data => {
        console.log(`${data.userID}: ${data.connectionID}-sent-msg`);
        socket.broadcast.emit(`${data.connectionID}-sent-msg`, data)
    })
    
    socket.on('name-change', data => {
        console.log(`${data.userID}: ${data.connectionID}-name-changed`);
        socket.broadcast.emit(`${data.connectionID}-name-changed`, data)
    })
    
    socket.on('log-on', data => {
        console.log(`${data.userID}: ${data.connectionID}-logged-on`);
        socket.broadcast.emit(`${data.connectionID}-logged-on`, data)
    })
    
    socket.on('log-off', data => {
        console.log(`${data.userID}: ${data.connectionID}-logged-off`);
        socket.broadcast.emit(`${data.connectionID}-logged-off`, data)
    })
}