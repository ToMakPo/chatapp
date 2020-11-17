var socket

var senderNameInput = $('#sender-name-input')
var connectionDisplay = $('#connection-id')
var connectToInput = $('#connect-to')
var messageInput = $('#message-input')
var log = $('#log')

var connectionID
var username
var userID

function init() {
    connectionID = localStorage.getItem('chatapp-connection-id')
    if (!connectionID) {
        connectionID = Math.floor(Math.random() * 36**6).toString(36).padStart(6, '0').toUpperCase()
        localStorage.setItem('chatapp-connection-id', connectionID)
    }
    connectionDisplay.text(connectionID)

    username = localStorage.getItem('chatapp-username') || ''
    userID = localStorage.getItem('chatapp-user-id')
    if (!userID) {
        userID = Math.floor(Math.random() * 36**9).toString(36).padStart(9, '0').toUpperCase()
        localStorage.setItem('chatapp-user-id', userID)
    }
    
    setup()

    // event listeners
    $('#connect-button').on('click', event => {
        connectTo(connectToInput.val())
        connectToInput.val('')
    })

    $('#new-channel-button').on('click', event => {
        let newID = Math.floor(Math.random() * 36**6).toString(36).padStart(6, '0').toUpperCase()
        connectTo(newID)
    })

    $('#send-button').on('click', event => {
        let msg = messageInput.val()
        if (msg) sendMsg(msg)
        messageInput.val('')
        messageInput.focus()
    })

    $(window).on('beforeunload', event => {
        logoff()
    })

    senderNameInput.val(username).on('blur', event => {
        changeName(senderNameInput.val())
    })
}

function connectTo(newID) {
    newID = newID.toUpperCase()
    if (newID != connectionID) {
        logoff()
        console.log('connecting to: ', newID)
        connectionID = newID
        localStorage.setItem('chatapp-connection-id', connectionID)
        connectionDisplay.text(connectionID)
        logon()
    }
}

function sendMsg(msg) {
    console.log('sending msg: ', msg);

    var data = {
        connectionID: connectionID,
        userID: userID,
        timestamp: moment(),
        username: username,
        msg: msg
    }
    socket.emit('send-msg', data)

    logMsg(data, 'blue')
}

function changeName(newName) {
    if (newName != username) {
        var data = {
            connectionID: connectionID,
            userID: userID,
            timestamp: moment(),
            username: username,
            msg: `${username} just changed name to ${newName}.`
        }

        username = newName
        localStorage.setItem('chatapp-username', username)

        console.log('name change: ', data.msg);

        socket.emit('name-change', data)

        logMsg(data, 'DodgerBlue')
    }
}

function logon() {
    var data = {
        connectionID: connectionID,
        userID: userID,
        timestamp: moment(),
        username: username,
        msg: `${username} just logged on.`
    }

    console.log('user log on: ', data.msg);

    socket.emit('log-on', data)
    
    socket.on(`${connectionID}-sent-msg`, data => {
        console.log('getting msg: ', data.msg);
        logMsg(data)
    })

    socket.on(`${connectionID}-name-changed`, data => {
        console.log('getting msg: ', data.msg);
        logMsg(data, 'DodgerBlue')
    })
    
    socket.on(`${connectionID}-logged-on`, data => {
        console.log('user logged: ', data.msg);
        logMsg(data, 'green')
    })

    socket.on(`${connectionID}-logged-off`, data => {
        console.log('user logged: ', data.msg);
        logMsg(data, 'DarkMagenta')
    })

    logMsg(data, 'green')
}

function logoff() {
    var data = {
        connectionID: connectionID,
        userID: userID,
        timestamp: moment(),
        username: username,
        msg: `${username} just logged off.`
    }

    console.log('user log off: ', data.msg);

    socket.emit('log-off', data)

    socket.off()

    logMsg(data, 'DarkMagenta')
}

function setup() {
    let path = 'https://postnet-chatapp.herokuapp.com/'
    socket = io.connect(path)
    logon()
}

function logMsg(data, color='black') {
    let cells = [
        $('<td>').text(moment(data.timestamp).format('MM-DD-YYYY HH:mm:ss')),
        $('<td>').text(data.username),
        $('<td>').text(data.msg)
    ]
    let row = $('<tr>').append(cells).css('color', color)
    log.append(row)
}
