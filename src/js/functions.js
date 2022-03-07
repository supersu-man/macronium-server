const path = require('path')
const http = require('http').createServer()
const io = require('socket.io')(http, {
    cors: { origin: '*' }
})
const {keyboard, Key} = require("@nut-tree/nut-js")

function initListener(window) {

    io.on("connection", (socket) => {

        ipcSend(window, "setStatus", true)
        console.log("Connected")

        socket.on("key-press", (arg) => {
            console.log(arg)
            keyPress(arg)
        })
        
        socket.on("disconnect", () => {
            ipcSend(window, "setStatus", false)
        })
    })
}

async function keyPress(arg) {
    await keyboard.pressKey(Key[arg])
    await keyboard.releaseKey(Key[arg])
}

function startServer() {
    http.listen(6969, () => {
        console.log('Server running on port 6969')
    })
}

function ipcSend(window, channel, value) {
    window.webContents.send(channel, value)
}

function ipcReceive() {
    ipcMain.on('bar', (event, arg) => {
        //console.log(arg)
        event.sender.send('foo', 'done')
    })
}

module.exports = { path, initListener, startServer, ipcSend }