const ip = require("ip")
const { ipcRenderer, contextBridge } = require('electron')
const qrcode = require('qrcode')
const package = require('../../package.json')
const Store = require('electron-store')

const store = new Store()

contextBridge.exposeInMainWorld('store', {
  isDarkModeEnabled: () => {
    return store.has('darkMode')
  },
  enableDarkMode: () => {
    store.set('darkMode', true)
  },
  disableDarkMode: () => {
    store.delete('darkMode')
  }
})

contextBridge.exposeInMainWorld('qr', {
  setQR: (canvas, tint) => {
    const qrString = ip.address()
    const opts = {
      width: 300,
      color: {
        dark: tint.trim(),
        light: "#0000"
      }
    }
    qrcode.toCanvas(canvas, qrString, opts, (error) => {
      if (error) console.error(error)
    })
  }
})

contextBridge.exposeInMainWorld('shell', {
  openExternal: (link) => {
    require('electron').shell.openExternal(link)
  }
})

contextBridge.exposeInMainWorld('version', {
  setVersionText: (element) => {
    var currentVersion = package.version.toString()
    element.innerHTML = 'v' + currentVersion
  }
})



window.addEventListener('DOMContentLoaded', () => {
  initIpcListeners()
})

function initIpcListeners() {

  ipcRenderer.on("setStatus", (_, arg) => {
    var textView = document.getElementById("status_text")
    if (arg) {
      console.log("Connected")
      textView.innerHTML = "Connected"
    } else {
      textView.innerHTML = "Not Connected"
    }
  })

  ipcRenderer.on("showButton", (_, arg) => {
    var element = document.getElementById("updateButton")
    element.removeAttribute("hidden")
  })

}

function sendMessage() {
  ipcRenderer.send("", "")
}

function recieveMessage(key, callback) {
  ipcRenderer.on(key, (event, arg) => {
    callback(event, arg)
  })
}