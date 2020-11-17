var socket

var senderNameInput = $('#sender-name-input')
var messageInput = $('#message-input')
var log = $('#log')

var senderName

function init() {

    $('#connect-button').on('click', event => {
        let key = $('#connect-to').val()
        if (key) connectTo(key)
    })

    $('#send-button').on('click', event => {
        let msg = messageInput.val()
        if (msg) sendMsg(msg)
        messageInput.val('')
    })

    senderName = localStorage.getItem('sender-name') || ''
    senderNameInput.val(senderName)
        .on('blur', event => {
            senderName = senderNameInput.val()
            localStorage.setItem('sender-name', senderName)
        })

    setup()
}

function connectTo(key) {
    console.log('connecting to: ', key);
}

function sendMsg(msg) {
    console.log('sending msg: ', msg);

    var data = {
        senderName: senderName,
        msg: msg,
        timestamp: moment()
    }
    socket.emit('send-msg', data)

    logMsg(data)
}

function setup() {
    let path = 'https://postnet-chatapp-server.herokuapp.com/'
    // let path = 'http://localhost:3000'
    socket = io.connect(path)
    socket.on('send-msg', data => {
        logMsg(data)
    })
}

function logMsg(data) {
    let cells = [
        $('<td>').text(moment(data.timestamp).format('MM-DD-YYYY HH:mm:ss')),
        $('<td>').text(data.senderName),
        $('<td>').text(data.msg)
    ]
    let row = $('<tr>').append(cells)
    log.append(row)
}
