const { Server } = require("socket.io")
const { keyboard, Key, mouse, Point } = require("@nut-tree/nut-js")
const shell = require('electron').shell
const loudness = require('loudness')
keyboard.config = { autoDelayMs: 0 }

var mainWindow
const io = new Server()

var pos = { x: 0, y: 0 }

io.on("connection", (socket) => {
    mainWindow.webContents.send('status', true)

    socket.on("key-press", (arg) => {
        if (arg.includes('+')) {
            keysPress(arg)
        } else {
            keyPress(arg)
        }
    })

    socket.on("keyboard",  (arg) => {
        keyboard.type(arg)
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

    socket.on("disconnect", (reason) => {
        mainWindow.webContents.send('status', false)
    })

    socket.on("set-volume", (arg) => {
        loudness.setVolume(arg)
    })

    console.log("connected")
})

const listen = async (window) => {
    mainWindow = window
    io.listen(6969)
    console.log('listening')
}

const startStopGestures = async (arg) => {
    pos.x = (await mouse.getPosition()).x
    pos.y = (await mouse.getPosition()).y
}

const keysPress = async (arg) => {
    var list = arg.split('+')
    for (const k in list) {
        await keyboard.pressKey(Key[list[k]])
    }
    list.reverse()
    for (const k in list) {
        await keyboard.releaseKey(Key[list[k]])
    }
}

const keyPress = async (arg) => {
    await keyboard.pressKey(Key[arg])
    await keyboard.releaseKey(Key[arg])
}

const scroll = async (arg) => {
    var jsonObject = JSON.parse(arg)
    var y = parseInt(jsonObject["y"])
    if (y > 0) {
        await mouse.scrollDown(-1 * y)
    } else {
        await mouse.scrollUp(y)
    }
}

const movePointer = async (arg) => {
    var jsonObject = JSON.parse(arg)
    var point = new Point()
    point.x = pos.x + parseInt(jsonObject["x"])
    point.y = pos.y + parseInt(jsonObject["y"])
    await mouse.setPosition(point)
}

const mouseClick = async (arg) => {
    if (arg == "leftclick") {
        await mouse.leftClick()
    }
}

module.exports = { listen }