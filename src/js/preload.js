const ip = require("ip")
const { ipcRenderer } = require('electron')
const qrcode = require('qrcode')
const package = require('../../package.json')

window.addEventListener('DOMContentLoaded', () => {
  setVersionText()
  initIpcListeners()
  initElementListeners()
})

function initIpcListeners() {

  ipcRenderer.on("setQR", (_, arg) => {
    var canvas = document.getElementById("img-container")
    makeQR(canvas)
  })

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

function initElementListeners() {

  var darkModeSwitch = document.getElementById("darkSwitch")
  darkModeSwitch.addEventListener('change', () => {
    if(darkModeSwitch.checked){
      document.getElementsByTagName("body")[0].classList.add("darkBody")
      document.getElementsByTagName("button")[0].classList.add("lightBody")
      document.getElementsByTagName("button")[1].classList.add("lightBody")
    } else{
      document.getElementsByTagName("body")[0].classList.remove("darkBody")
      document.getElementsByTagName("button")[0].classList.remove("lightBody")
      document.getElementsByTagName("button")[1].classList.remove("lightBody")
    }
  })

  var updateButton = document.getElementById("updateButton")
  updateButton.addEventListener('click', () => {
    require('electron').shell.openExternal("https://github.com/supersu-man/macronium-pc/releases/latest")
  })

  var repoButton = document.getElementById("repoButton")
  repoButton.addEventListener('click', () => {
    require('electron').shell.openExternal("https://github.com/supersu-man/macronium-pc")
  })
}

function setVersionText() {
  var currentVersion = package.version.toString()
  document.getElementById('version-text').innerHTML = 'v' + currentVersion
}

function makeQR(canvas) {
  var qrString = ip.address()
  qrcode.toCanvas(canvas, qrString, { width: 300 }, (error) => {
    if (error) console.error(error)
    console.log('QR set successfully')
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