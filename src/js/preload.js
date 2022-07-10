const ip = require("ip")
const { ipcRenderer, contextBridge } = require('electron')
const qrcode = require('qrcode')
const package = require('../../package.json')
const checkUpdate = require('./checkUpdate.js')
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

contextBridge.exposeInMainWorld('connection', {
  setStatusListener: (element) => {
    ipcRenderer.on("setStatus", (_, arg) => {
      if (arg) {
        element.innerHTML = "Connected"
      } else {
        element.innerHTML = "Not Connected"
      }
    })
  }
})

try {
  checkUpdate.isNewUpdateFound((bool) => {
    if (bool) {
      var element = document.getElementById("updateButton")
      element.removeAttribute("hidden")
    }
  })
} catch (error) {
  console.log("Unable to check for update")
}
