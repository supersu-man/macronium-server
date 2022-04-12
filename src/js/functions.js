const path = require('path')
const http = require('http').createServer()
const io = require('socket.io')(http, {
    cors: { origin: '*' }
})
const {keyboard, Key, mouse, Point} = require("@nut-tree/nut-js")

var pos = {x:0,y: 0}

function initListener(window) {

    io.on("connection", (socket) => {

        ipcSend(window, "setStatus", true)
        console.log("Connected")

        socket.on("key-press", (arg) => {
            console.log(arg)
            keyPress(arg)
        })

        socket.on("mouse-move", (arg) => {
            movePointer(arg)
            //console.log(arg)
        })

        socket.on("mouse-click", (arg) => {
            mouseClick(arg)
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

async function movePointer(arg) {
    if(arg=="start" || arg=="stop"){
        pos.x = (await mouse.getPosition()).x
        pos.y = (await mouse.getPosition()).y
    } else {
        var jsonObject = JSON.parse(arg)
        var point = new Point()
        point.x = pos.x + parseInt(jsonObject["x"])
        point.y = pos.y + parseInt(jsonObject["y"])
        await mouse.setPosition(point)
    }
}

async function mouseClick(arg) {
    if(arg=="leftclick"){
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