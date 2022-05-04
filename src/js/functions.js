const path = require('path')
const http = require('http').createServer()
const io = require('socket.io')(http, {
    cors: { origin: '*' }
})
const { keyboard, Key, mouse, Point } = require("@nut-tree/nut-js")
const shell = require('electron').shell

var pos = { x: 0, y: 0 }

function initListener(window) {

    io.on("connection", (socket) => {

        ipcSend(window, "setStatus", true)
        console.log("Connected")

        socket.on("key-press", (arg) => {
            keyPress(arg)
        })

        socket.on("mouse-gestures", (arg) => {
            startStopGestures(arg)
        })

        socket.on("open-link", (arg) => {
            shell.openExternal(arg)
        })

        socket.on("mouse-move", (arg) => {
            movePointer(arg)
        })

        socket.on("mouse-scroll", (arg) => {
            scroll(arg)
        })

        socket.on("mouse-click", (arg) => {
            mouseClick(arg)
        })

        socket.on("disconnect", () => {
            ipcSend(window, "setStatus", false)
        })
    })
}

async function startStopGestures(arg) {
    pos.x = (await mouse.getPosition()).x
    pos.y = (await mouse.getPosition()).y
}

async function keyPress(arg) {
    await keyboard.pressKey(Key[arg])
    await keyboard.releaseKey(Key[arg])
}

async function scroll(arg) {
    var jsonObject = JSON.parse(arg)
    var y = parseInt(jsonObject["y"])
    if (y > 0) {
        await mouse.scrollDown(-1 * y)
    } else {
        await mouse.scrollUp(y)
    }
}

async function movePointer(arg) {
    var jsonObject = JSON.parse(arg)
    var point = new Point()
    point.x = pos.x + parseInt(jsonObject["x"])
    point.y = pos.y + parseInt(jsonObject["y"])
    await mouse.setPosition(point)
}

async function mouseClick(arg) {
    if (arg == "leftclick") {
        await mouse.leftClick()
    }
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